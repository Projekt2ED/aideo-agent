/**
 * WebSocket 服务器 - 实时任务状态推送
 */
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

interface WsClient {
  ws: WebSocket;
  subscribedTasks: Set<string>;
  isAlive: boolean;
}

const clients: Set<WsClient> = new Set();
let wss: WebSocketServer | null = null;
let heartbeatTimer: NodeJS.Timeout | null = null;

const HEARTBEAT_INTERVAL = 30000; // 30秒心跳检测

export function initWebSocket(server: Server): WebSocketServer {
  wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    const client: WsClient = { ws, subscribedTasks: new Set(), isAlive: true };
    clients.add(client);
    console.log(`🔌 WebSocket 客户端已连接 (当前 ${clients.size} 个)`);

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(client, message);
      } catch (e) {
        ws.send(JSON.stringify({ type: 'error', message: '无效的消息格式' }));
      }
    });

    ws.on('close', () => {
      clients.delete(client);
      console.log(`🔌 WebSocket 客户端已断开 (当前 ${clients.size} 个)`);
    });

    ws.on('error', (error) => {
      console.error('WebSocket 错误:', error);
      clients.delete(client);
    });

    // 响应 pong 消息，标记客户端存活
    ws.on('pong', () => {
      client.isAlive = true;
    });

    // 发送欢迎消息
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'WebSocket 连接成功',
      timestamp: new Date().toISOString(),
    }));
  });

  // 启动心跳检测
  startHeartbeat();

  console.log('🔌 WebSocket 服务器已启动 (路径: /ws)');
  return wss;
}

/**
 * 心跳检测：定期清理不活跃的连接
 */
function startHeartbeat() {
  if (heartbeatTimer) return;

  heartbeatTimer = setInterval(() => {
    clients.forEach(client => {
      if (!client.isAlive) {
        console.log('💀 清理不活跃的 WebSocket 连接');
        client.ws.terminate();
        clients.delete(client);
        return;
      }
      client.isAlive = false;
      client.ws.ping();
    });
  }, HEARTBEAT_INTERVAL);
}

/**
 * 停止心跳检测（优雅关闭时调用）
 */
export function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

function handleMessage(client: WsClient, message: any) {
  switch (message.type) {
    case 'subscribe':
      // 订阅任务状态更新
      if (message.taskId) {
        client.subscribedTasks.add(message.taskId);
        client.ws.send(JSON.stringify({
          type: 'subscribed',
          taskId: message.taskId,
        }));
      }
      break;

    case 'unsubscribe':
      // 取消订阅
      if (message.taskId) {
        client.subscribedTasks.delete(message.taskId);
        client.ws.send(JSON.stringify({
          type: 'unsubscribed',
          taskId: message.taskId,
        }));
      }
      break;

    case 'ping':
      client.ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
      break;

    default:
      client.ws.send(JSON.stringify({ type: 'error', message: `未知消息类型: ${message.type}` }));
  }
}

/**
 * 向所有订阅了指定任务的客户端推送状态更新
 */
export function broadcastTaskUpdate(taskId: string, data: any) {
  const message = JSON.stringify({
    type: 'task_update',
    taskId,
    data,
    timestamp: new Date().toISOString(),
  });

  let sentCount = 0;
  clients.forEach(client => {
    if (client.subscribedTasks.has(taskId) && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
      sentCount++;
    }
  });

  if (sentCount > 0) {
    console.log(`📡 推送任务更新 ${taskId} 到 ${sentCount} 个客户端`);
  }
}

/**
 * 向所有客户端广播消息
 */
export function broadcastAll(data: any) {
  const message = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString(),
  });

  clients.forEach(client => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
}

/**
 * 获取当前连接的客户端数量
 */
export function getClientCount(): number {
  return clients.size;
}
