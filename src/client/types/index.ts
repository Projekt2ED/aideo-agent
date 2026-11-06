// 消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  taskId?: string;
  status?: 'sending' | 'sent' | 'error' | 'pending' | 'processing' | 'completed' | 'failed';
}

// 任务类型
export interface Task {
  id: string;
  volcTaskId?: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  skillType?: string;
  vid?: string;
  conversationId?: string; // 关联的对话 ID
  createdAt: string;
  updatedAt: string;
  result?: any;
}

// 技能类型
export interface Skill {
  type: string;
  name: string;
  description: string;
  paramsRequired: boolean;
}

// 对话会话类型
export interface Conversation {
  id: string;
  title: string;
  vid?: string; // 绑定的视频 ID
  videoName?: string; // 视频文件名
  createdAt: string;
  updatedAt: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 提交任务请求类型
export interface SubmitTaskRequest {
  vid: string;
  prompt?: string;
  skillType?: string;
  skillParams?: Record<string, any>;
}

// 任务状态类型
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

// 侧边栏项目类型
export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  count?: number;
}
