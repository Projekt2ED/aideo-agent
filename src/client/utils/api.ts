import { Task, Skill, Conversation, Message } from '../types';

const API_BASE = '/api';

// ============ 网络重试机制 ============
const MAX_RETRIES = 2; // 最多重试 2 次
const RETRY_DELAY_MS = 1000; // 初始延迟 1 秒

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 判断是否应该重试（仅网络错误或 5xx 服务端错误）
function shouldRetry(error: Error, attempt: number): boolean {
  if (attempt >= MAX_RETRIES) return false;
  // 网络错误、超时、5xx 可重试
  return error.message.includes('Failed to fetch') ||
         error.message.includes('NetworkError') ||
         error.message.includes('503') ||
         error.message.includes('502') ||
         error.message.includes('500');
}

// 通用请求方法（带重试）
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(`${API_BASE}${url}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '请求失败' }));
        const err = new Error(error.message || `HTTP ${response.status}`);
        // 仅服务端错误可重试，客户端错误（4xx）直接抛出
        if (response.status >= 500 && shouldRetry(err, attempt)) {
          lastError = err;
          await sleep(RETRY_DELAY_MS * Math.pow(2, attempt)); // 指数退避
          continue;
        }
        throw err;
      }

      return response.json();
    } catch (err: any) {
      lastError = err;
      if (shouldRetry(err, attempt)) {
        console.warn(`⚠️ 请求重试 (${attempt + 1}/${MAX_RETRIES}): ${url}`);
        await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('请求失败');
}

// ============ Aideo Agent API ============

export const aideoApi = {
  // 提交任务
  submit: (data: {
    vid: string;
    prompt?: string;
    skillType?: string;
    skillParams?: any;
    conversationId?: string;
  }) => request<{ success: boolean; taskId: string; volcTaskId: string; message: string }>(
    '/aideo/submit',
    { method: 'POST', body: JSON.stringify(data) }
  ),

  // 查询任务结果
  getResult: (taskId: string) => request<{ status: string; result: any }>(
    `/aideo/result/${taskId}`
  ),

  // 获取支持的技能
  getSkills: () => request<{ skills: Skill[] }>('/aideo/skills'),
};

// ============ 视频上传 API ============

export const uploadApi = {
  // 获取上传凭证
  getUploadToken: (data?: { fileType?: string }) =>
    request<{ success: boolean; data: any }>('/aideo/upload/apply', {
      method: 'POST',
      body: JSON.stringify(data || {}),
    }),

  // 确认上传完成
  commitUpload: (data: { sessionKey: string }) =>
    request<{ success: boolean; data: any }>('/aideo/upload/commit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // 直接上传文件（使用 FormData + multipart/form-data）
  uploadDirect: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/aideo/upload/direct`, {
      method: 'POST',
      body: formData,
      // 不设置 Content-Type，让浏览器自动设置 multipart/form-data boundary
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '上传失败' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // 查询视频信息
  getVideoInfo: (vid: string) =>
    request<{ success: boolean; data: any }>(`/aideo/video/${vid}`),
};

// ============ 任务管理 API ============

export const taskApi = {
  // 获取所有任务
  getAll: () => request<Task[]>('/tasks'),

  // 获取单个任务
  getById: (id: string) => request<Task>(`/tasks/${id}`),

  // 创建任务
  create: (data: {
    title?: string;
    description?: string;
    skillType?: string;
    vid?: string;
    conversationId?: string;
    prompt?: string;
  }) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(data) }),

  // 更新任务
  update: (id: string, data: { status?: string; result?: any; volcTaskId?: string }) =>
    request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // 删除任务
  delete: (id: string) =>
    request<{ success: boolean }>(`/tasks/${id}`, { method: 'DELETE' }),

  // 获取任务统计
  getStats: () => request<any>('/tasks/stats/summary'),
};

// ============ 对话管理 API ============

export const conversationApi = {
  // 获取所有对话
  getAll: () => request<Conversation[]>('/conversations'),

  // 创建对话（支持绑定视频）
  create: (title?: string, vid?: string, videoName?: string) =>
    request<{ id: string; title: string; vid?: string; videoName?: string }>('/conversations', {
      method: 'POST',
      body: JSON.stringify({ title, vid, videoName }),
    }),

  // 获取对话消息
  getMessages: (id: string) => request<Message[]>(`/conversations/${id}/messages`),

  // 添加消息
  addMessage: (conversationId: string, data: {
    role: string;
    content: string;
    taskId?: string;
    status?: string;
  }) => request<Message>(`/conversations/${conversationId}/messages`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 更新消息状态
  updateMessage: (conversationId: string, messageId: string, data: { status?: string; content?: string }) =>
    request<{ id: string; status?: string; content?: string }>(`/conversations/${conversationId}/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 更新对话（标题、视频绑定）
  update: (id: string, data: { title?: string; vid?: string; videoName?: string }) =>
    request<{ id: string; title?: string; vid?: string; videoName?: string }>(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // 删除对话
  delete: (id: string) =>
    request<{ success: boolean }>(`/conversations/${id}`, { method: 'DELETE' }),
};

// ============ 健康检查 ============

export const healthApi = {
  check: () => request<{ status: string; timestamp: string }>('/health'),
};

// ============ WebSocket 连接管理 ============

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private subscribedTasks: Set<string> = new Set();

  constructor(private url: string = `ws://${window.location.host}/ws`) {}

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('🔌 WebSocket 已连接');
      // 重新订阅之前的任务
      this.subscribedTasks.forEach(taskId => {
        this.subscribe(taskId);
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.notifyListeners(data.type || 'message', data);

        // 如果是任务更新，也通知特定任务的监听器
        if (data.type === 'task_update' && data.taskId) {
          this.notifyListeners(`task:${data.taskId}`, data);
        }
      } catch (e) {
        console.error('WebSocket 消息解析失败:', e);
      }
    };

    this.ws.onclose = () => {
      console.log('🔌 WebSocket 已断开');
      // 自动重连
      this.reconnectTimer = setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket 错误:', error);
    };
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(taskId: string) {
    this.subscribedTasks.add(taskId);
    this.send({ type: 'subscribe', taskId });
  }

  unsubscribe(taskId: string) {
    this.subscribedTasks.delete(taskId);
    this.send({ type: 'unsubscribe', taskId });
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  private send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  private notifyListeners(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }
}

// 全局 WebSocket 客户端实例
export const wsClient = new WebSocketClient();
