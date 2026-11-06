import { Router, Request, Response } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../utils/database';

export const taskRouter = Router();

// 获取所有任务
taskRouter.get('/', (req: Request, res: Response) => {
  try {
    const tasks = getTasks();
    res.json(tasks);
  } catch (error: any) {
    console.error('获取任务列表失败:', error);
    res.status(500).json({ error: '获取任务列表失败', message: error.message });
  }
});

// 获取任务统计（必须在 /:id 之前定义，否则会被 /:id 拦截）
taskRouter.get('/stats/summary', (req: Request, res: Response) => {
  try {
    const stats = getTaskStats();
    res.json(stats);
  } catch (error: any) {
    console.error('获取任务统计失败:', error);
    res.status(500).json({ error: '获取任务统计失败', message: error.message });
  }
});

// 获取单个任务
taskRouter.get('/:id', (req: Request, res: Response) => {
  try {
    const task = getTaskById(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ error: '任务不存在' });
    }
  } catch (error: any) {
    console.error('获取任务失败:', error);
    res.status(500).json({ error: '获取任务失败', message: error.message });
  }
});

// 创建任务
taskRouter.post('/', (req: Request, res: Response) => {
  try {
    const { title, description, skillType, vid, conversationId, prompt } = req.body;
    const id = Date.now().toString();

    createTask({
      id,
      title: title || '新任务',
      description: description || '',
      skillType,
      vid,
      conversationId,
      prompt,
    });

    const task = getTaskById(id);
    res.status(201).json(task);
  } catch (error: any) {
    console.error('创建任务失败:', error);
    res.status(500).json({ error: '创建任务失败', message: error.message });
  }
});

// 更新任务状态
taskRouter.patch('/:id', (req: Request, res: Response) => {
  try {
    const task = getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }

    const { status, result, volcTaskId } = req.body;
    updateTask(req.params.id, { status, result, volcTaskId });

    const updatedTask = getTaskById(req.params.id);
    res.json(updatedTask);
  } catch (error: any) {
    console.error('更新任务失败:', error);
    res.status(500).json({ error: '更新任务失败', message: error.message });
  }
});

// 删除任务
taskRouter.delete('/:id', (req: Request, res: Response) => {
  try {
    const task = getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }

    deleteTask(req.params.id);
    res.json({ success: true, message: '任务已删除' });
  } catch (error: any) {
    console.error('删除任务失败:', error);
    res.status(500).json({ error: '删除任务失败', message: error.message });
  }
});
