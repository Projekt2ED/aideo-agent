import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  createConversation,
  getConversations,
  getMessages,
  addMessage,
  deleteConversation,
  updateConversation,
  getDatabase,
  saveDatabase,
} from '../utils/database';

export const conversationRouter = Router();

// 获取所有对话
conversationRouter.get('/', (req: Request, res: Response) => {
  try {
    const conversations = getConversations();
    res.json(conversations);
  } catch (error: any) {
    console.error('获取对话列表失败:', error);
    res.status(500).json({ error: '获取对话列表失败', message: error.message });
  }
});

// 创建新对话
conversationRouter.post('/', (req: Request, res: Response) => {
  try {
    const { title, vid, videoName } = req.body;
    const id = uuidv4();
    const convTitle = vid ? `视频处理 - ${videoName || vid}` : (title || '新对话');
    createConversation(id, convTitle, vid, videoName);
    res.status(201).json({ id, title: convTitle, vid, videoName });
  } catch (error: any) {
    console.error('创建对话失败:', error);
    res.status(500).json({ error: '创建对话失败', message: error.message });
  }
});

// 获取对话的消息列表
conversationRouter.get('/:id/messages', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messages = getMessages(id);
    res.json(messages);
  } catch (error: any) {
    console.error('获取消息列表失败:', error);
    res.status(500).json({ error: '获取消息列表失败', message: error.message });
  }
});

// 添加消息到对话
conversationRouter.post('/:id/messages', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, content, taskId, status } = req.body;

    if (!role || !content) {
      return res.status(400).json({ error: '需要提供 role 和 content' });
    }

    const messageId = uuidv4();
    addMessage(messageId, id, role, content, taskId, status);
    res.status(201).json({ id: messageId, role, content, taskId, status });
  } catch (error: any) {
    console.error('添加消息失败:', error);
    res.status(500).json({ error: '添加消息失败', message: error.message });
  }
});

// 更新对话（标题、视频绑定）
conversationRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, vid, videoName } = req.body;

    if (title) {
      updateConversation(id, title);
    }

    // 如果提供了 vid，绑定视频到对话
     if (vid) {
       const db = getDatabase();
       const convTitle = videoName ? `视频处理 - ${videoName}` : undefined;
       if (convTitle) {
         db.run('UPDATE conversations SET vid = ?, video_name = ?, title = ?, updated_at = ? WHERE id = ?',
           [vid, videoName || null, convTitle, new Date().toISOString(), id]);
       } else {
         db.run('UPDATE conversations SET vid = ?, updated_at = ? WHERE id = ?',
           [vid, new Date().toISOString(), id]);
       }
       saveDatabase();
     }

    res.json({ id, title, vid, videoName });
  } catch (error: any) {
    console.error('更新对话失败:', error);
    res.status(500).json({ error: '更新对话失败', message: error.message });
  }
});

// 更新消息状态
conversationRouter.patch('/:id/messages/:messageId', (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { status, content } = req.body;

    const db = getDatabase();
    const fields: string[] = [];
    const values: any[] = [];

    if (status) {
      fields.push('status = ?');
      values.push(status);
    }
    if (content) {
      fields.push('content = ?');
      values.push(content);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: '需要提供 status 或 content' });
    }

    values.push(messageId);
    db.run(`UPDATE messages SET ${fields.join(', ')} WHERE id = ?`, values);
    saveDatabase();

    res.json({ id: messageId, status, content });
  } catch (error: any) {
    console.error('更新消息失败:', error);
    res.status(500).json({ error: '更新消息失败', message: error.message });
  }
});

// 删除对话
conversationRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    deleteConversation(id);
    res.json({ success: true, message: '对话已删除' });
  } catch (error: any) {
    console.error('删除对话失败:', error);
    res.status(500).json({ error: '删除对话失败', message: error.message });
  }
});
