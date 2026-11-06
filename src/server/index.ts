import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { aideoRouter, resumePendingTaskPolling, stopAllPolling } from './routes/aideo';
import { taskRouter } from './routes/tasks';
import { conversationRouter } from './routes/conversations';
import { translationRouter } from './routes/translation';
import { initDatabase, flushDatabase } from './utils/database';
import { initWebSocket } from './utils/websocket';

// 加载环境变量
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// 确保 uploads 目录存在
const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' })); // 支持大文件上传
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 请求日志中间件（开发环境）
if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
  });
}

// 静态文件服务（生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client')));
}

// API路由
app.use('/api/aideo', aideoRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/conversations', conversationRouter);
app.use('/api/translation', translationRouter);

// 健康检查（包含轮询状态监控）
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 生产环境：所有其他路由返回index.html
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
  });
}

// 全局错误处理中间件
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ 未捕获的路由错误:', err.message);
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'production' ? '请联系管理员' : err.message,
  });
});

// 创建 HTTP 服务器
const server = http.createServer(app);

// 初始化数据库并启动服务器
async function startServer() {
  try {
    // 初始化 SQLite 数据库
    await initDatabase();

    // 初始化 WebSocket 服务器
    initWebSocket(server);

    // 启动 HTTP 服务器
    server.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
      console.log(`🔌 WebSocket 地址: ws://localhost:${PORT}/ws`);
      console.log(`📝 环境: ${process.env.NODE_ENV || 'development'}`);

      // 恢复未完成任务的轮询（服务器重启场景）
      resumePendingTaskPolling();
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// ============ 优雅关闭 ============

function gracefulShutdown(signal: string) {
  console.log(`\n📴 收到 ${signal} 信号，开始优雅关闭...`);
  
  // 1. 停止接受新连接
  server.close(() => {
    console.log('🔌 HTTP 服务器已关闭');
    
    // 2. 停止所有任务轮询
    stopAllPolling();
    
    // 3. 立即保存数据库
    flushDatabase();
    console.log('💾 数据库已保存');
    
    console.log('✅ 优雅关闭完成');
    process.exit(0);
  });
  
  // 超时强制退出（10秒）
  setTimeout(() => {
    console.error('⚠️ 优雅关闭超时，强制退出');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// 未捕获异常处理
process.on('uncaughtException', (err) => {
  console.error('❌ 未捕获异常:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ 未处理的 Promise 拒绝:', reason);
});

startServer();

export default app;
