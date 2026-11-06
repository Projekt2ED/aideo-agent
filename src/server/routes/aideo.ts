import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { vodOpenapi } from '@volcengine/openapi';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createTask,
  getTaskById,
  updateTask,
  getTaskByVolcId,
} from '../utils/database';
import { broadcastTaskUpdate } from '../utils/websocket';

export const aideoRouter = Router();

// 火山引擎API配置（延迟读取环境变量，确保 dotenv 已加载）
function getSpaceName() {
  return process.env.VOD_SPACE_NAME || '';
}

// ============ 任务自动轮询服务 ============

// 存储正在轮询的任务定时器
const pollingTimers: Map<string, NodeJS.Timeout> = new Map();
const POLLING_INTERVAL = 10000; // 10秒轮询一次
const MAX_POLLING_DURATION = 30 * 60 * 1000; // 最大轮询30分钟

/**
 * 启动任务状态轮询
 * 提交任务后自动开始轮询，直到任务完成/失败或超时
 */
function startTaskPolling(localTaskId: string, volcTaskId: string) {
  // 避免重复轮询
  if (pollingTimers.has(localTaskId)) {
    console.log(`⚠️ 任务 ${localTaskId} 已在轮询中，跳过`);
    return;
  }

  const startTime = Date.now();
  console.log(`🔄 开始轮询任务状态: ${localTaskId} (volcTaskId: ${volcTaskId})`);

  const poll = async () => {
    // 检查是否超时
    if (Date.now() - startTime > MAX_POLLING_DURATION) {
      console.log(`⏰ 任务 ${localTaskId} 轮询超时，停止轮询`);
      stopTaskPolling(localTaskId);
      // 更新任务状态为超时
      updateTask(localTaskId, {
        status: 'failed',
        result: { error: '任务处理超时，请手动查询结果' },
      });
      broadcastTaskUpdate(localTaskId, {
        event: 'task_status_changed',
        taskId: localTaskId,
        volcTaskId,
        status: 'failed',
        result: { error: '任务处理超时，请手动查询结果' },
      });
      return;
    }

    try {
      const getAideoTaskResult = getGetAideoTaskResult();
      const data = await getAideoTaskResult({
        SpaceName: getSpaceName(),
        TaskId: volcTaskId,
      });

      // 检查 API 错误
      if (data?.ResponseMetadata?.Error) {
        console.error(`❌ 轮询任务 ${localTaskId} 出错:`, data.ResponseMetadata.Error.Message);
        return; // 继续轮询，可能是临时错误
      }

      const result = data?.Result;
      const status = result?.Status?.toLowerCase() || 'unknown';

      console.log(`📊 任务 ${localTaskId} 状态: ${status}`);

      // 辅助函数：确保错误信息是字符串
      const formatError = (err: any): string => {
        if (!err) return '任务失败';
        if (typeof err === 'string') return err;
        if (typeof err === 'object') {
          // 火山引擎可能返回 { Code, Message } 格式
          return err.Message || err.message || JSON.stringify(err);
        }
        return String(err);
      };

      // 更新数据库
      const updates: any = { status };
      if (status === 'completed') {
        updates.result = result;
      } else if (status === 'failed') {
        updates.result = { error: formatError(result?.Error) };
      }
      updateTask(localTaskId, updates);

      // 广播状态更新
      broadcastTaskUpdate(localTaskId, {
        event: 'task_status_changed',
        taskId: localTaskId,
        volcTaskId,
        status,
        result: status === 'completed' ? result : (status === 'failed' ? { error: formatError(result?.Error) } : undefined),
      });

      // 如果任务完成或失败，停止轮询
      if (status === 'completed' || status === 'failed') {
        console.log(`✅ 任务 ${localTaskId} 已${status === 'completed' ? '完成' : '失败'}，停止轮询`);
        stopTaskPolling(localTaskId);
      }
    } catch (error: any) {
      console.error(`❌ 轮询任务 ${localTaskId} 异常:`, error.message);
    }
  };

  // 立即执行一次
  poll();

  // 设置定时轮询
  const timer = setInterval(poll, POLLING_INTERVAL);
  pollingTimers.set(localTaskId, timer);
}

/**
 * 停止任务状态轮询
 */
function stopTaskPolling(localTaskId: string) {
  const timer = pollingTimers.get(localTaskId);
  if (timer) {
    clearInterval(timer);
    pollingTimers.delete(localTaskId);
    console.log(`🛑 停止轮询任务: ${localTaskId}`);
  }
}

/**
 * 恢复未完成任务的轮询（服务器重启时调用）
 */
export function resumePendingTaskPolling() {
  try {
    const { getTasks } = require('../utils/database');
    const tasks = getTasks();
    const pendingTasks = tasks.filter((t: any) => t.status === 'pending' || t.status === 'processing');
    
    console.log(`🔄 恢复 ${pendingTasks.length} 个未完成任务的轮询`);
    
    for (const task of pendingTasks) {
      if (task.volcTaskId) {
        startTaskPolling(task.id, task.volcTaskId);
      }
    }
  } catch (error) {
    console.error('恢复任务轮询失败:', error);
  }
}

/**
 * 停止所有轮询（优雅关闭时调用）
 */
export function stopAllPolling() {
  console.log(`🛑 停止所有轮询（共 ${pollingTimers.size} 个）`);
  for (const [taskId, timer] of pollingTimers) {
    clearInterval(timer);
  }
  pollingTimers.clear();
}

/**
 * 获取当前轮询任务数量（用于监控）
 */
export function getActivePollingCount(): number {
  return pollingTimers.size;
}

// 延迟初始化火山引擎 VOD 官方 SDK（确保 dotenv 已加载）
let _vodService: any = null;
function getVodService() {
  if (!_vodService) {
    _vodService = new vodOpenapi.VodService({
      serviceName: 'vod',
      region: 'cn-north-1',
      accessKeyId: process.env.VOLC_ACCESS_KEY_ID || '',
      secretKey: process.env.VOLC_SECRET_ACCESS_KEY || '',
    });
  }
  return _vodService;
}

// 延迟初始化 Aideo API 函数（使用 createJSONAPI，因为 Aideo API 不在 VodService 中）
let _submitAideoTask: any = null;
let _getAideoTaskResult: any = null;

function getSubmitAideoTask() {
  if (!_submitAideoTask) {
    _submitAideoTask = getVodService().createJSONAPI('SubmitAideoTaskAsync', {Version: '2025-03-03'});
  }
  return _submitAideoTask;
}

function getGetAideoTaskResult() {
  if (!_getAideoTaskResult) {
    // GetAideoTaskResult 是 GET 请求，使用 createAPI（默认 GET）
    _getAideoTaskResult = getVodService().createAPI('GetAideoTaskResult', {Version: '2025-03-03'});
  }
  return _getAideoTaskResult;
}

// ============ Aideo Agent 路由 ============

// 提交Aideo任务
aideoRouter.post('/submit', async (req: Request, res: Response) => {
  try {
    const { vid, prompt, skillType, skillParams, conversationId } = req.body;

    if (!vid) {
      return res.status(400).json({ error: '视频ID(vid)是必需的' });
    }

    const taskId = uuidv4();

    const requestBody: any = {
      SpaceName: getSpaceName(),
      MultiInputs: [
        { Type: 'Vid', Vid: vid },
      ],
    };

    if (prompt) {
      requestBody.Prompt = prompt;
    } else if (skillType) {
      requestBody.SkillType = skillType;
      if (skillParams) {
        requestBody.SkillParams = typeof skillParams === 'string'
          ? skillParams
          : JSON.stringify(skillParams);
      }
    } else {
      return res.status(400).json({ error: '需要提供prompt或skillType' });
    }

    // 使用 createJSONAPI 创建的函数提交任务（自动签名，POST + JSON body）
    const submitAideoTask = getSubmitAideoTask();
    const result = await submitAideoTask(requestBody);
    
    // 检查 API 错误
    if (result?.ResponseMetadata?.Error) {
      const apiError = result.ResponseMetadata.Error;
      return res.status(400).json({
        error: '火山引擎 API 错误',
        code: apiError.Code,
        message: apiError.Message,
      });
    }
    
    const volcTaskId = result?.Result?.TaskId;

    // 保存任务到数据库
    createTask({
      id: taskId,
      volcTaskId,
      conversationId,
      vid,
      prompt,
      skillType,
      title: prompt ? `AI处理: ${prompt.substring(0, 30)}...` : `技能: ${skillType}`,
      description: prompt || `使用 ${skillType} 技能处理视频`,
    });

    // 广播任务创建事件
    broadcastTaskUpdate(taskId, {
      event: 'task_created',
      taskId,
      volcTaskId,
      status: 'pending',
    });

    // 自动启动任务状态轮询
    if (volcTaskId) {
      startTaskPolling(taskId, volcTaskId);
    }

    res.json({
      success: true,
      taskId,
      volcTaskId,
      message: '任务已提交',
    });
  } catch (error: any) {
    console.error('提交任务失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '提交任务失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 查询任务结果
aideoRouter.get('/result/:taskId', async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    // 使用 createJSONAPI 创建的函数查询任务结果
    const getAideoTaskResult = getGetAideoTaskResult();
    const data = await getAideoTaskResult({
      SpaceName: getSpaceName(),
      TaskId: taskId,
    });

    // 检查 API 错误
    if (data?.ResponseMetadata?.Error) {
      const apiError = data.ResponseMetadata.Error;
      return res.status(400).json({
        error: '火山引擎 API 错误',
        code: apiError.Code,
        message: apiError.Message,
      });
    }

    const result = data?.Result;
    const status = result?.Status?.toLowerCase() || 'unknown';

    // 更新数据库中的任务状态
    const localTask = getTaskByVolcId(taskId);
    if (localTask) {
      const updates: any = { status };
      if (status === 'completed') {
        updates.result = result;
      } else if (status === 'failed') {
        updates.result = { error: result?.Error || '任务失败' };
      }
      updateTask(localTask.id, updates);

      // 通过 WebSocket 广播状态更新
      broadcastTaskUpdate(localTask.id, {
        event: 'task_status_changed',
        taskId: localTask.id,
        volcTaskId: taskId,
        status,
        result: status === 'completed' ? result : undefined,
      });
    }

    res.json({
      status,
      result,
    });
  } catch (error: any) {
    console.error('查询任务失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '查询任务失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 获取支持的技能类型
aideoRouter.get('/skills', (req: Request, res: Response) => {
  res.json({
    skills: [
      {
        type: 'AITranslation',
        name: 'AI视频翻译',
        description: '将视频翻译成其他语言，支持字幕和语音翻译',
        paramsRequired: true,
      },
      {
        type: 'Erase',
        name: 'AI字幕擦除',
        description: '自动检测并擦除视频中的硬字幕',
        paramsRequired: false,
      },
      {
        type: 'Highlight',
        name: 'AI高光剪辑',
        description: '自动分析视频，生成高光集锦',
        paramsRequired: true,
      },
      {
        type: 'VCreative',
        name: 'AI创意剪辑',
        description: '将图片或视频素材拼接成新视频',
        paramsRequired: true,
      },
      {
        type: 'Vision',
        name: 'AI视频理解',
        description: '深度理解视频内容，生成文字描述',
        paramsRequired: true,
      },
    ],
  });
});

// ============ 视频上传路由 ============

// 获取上传凭证
aideoRouter.post('/upload/apply', async (req: Request, res: Response) => {
  try {
    const { spaceName, sessionKey, fileName, fileType } = req.body;

    const params: Record<string, any> = {
      SpaceName: spaceName || getSpaceName(),
    };

    if (sessionKey) params.SessionKey = sessionKey;
    if (fileName) params.FileName = fileName;
    if (fileType) params.FileType = fileType;

    // 使用 SDK 获取上传凭证（自动签名）
    const data = await getVodService().ApplyUploadInfo(params);
    const result = data?.Result;
    const uploadAddress = result?.Data?.UploadAddress;
    const storeInfo = uploadAddress?.StoreInfos?.[0];

    res.json({
      success: true,
      data: {
        sessionKey: uploadAddress?.SessionKey,
        storeUri: storeInfo?.StoreUri,
        auth: storeInfo?.Auth,
        uploadHosts: uploadAddress?.UploadHosts,
        vid: result?.Data?.Vid,
      },
    });
  } catch (error: any) {
    console.error('获取上传凭证失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '获取上传凭证失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 提交上传结果（确认上传完成）
aideoRouter.post('/upload/commit', async (req: Request, res: Response) => {
  try {
    const { spaceName, sessionKey } = req.body;

    if (!sessionKey) {
      return res.status(400).json({ error: '需要提供 sessionKey' });
    }

    // 使用 SDK 提交上传确认（自动签名）
    const data = await getVodService().CommitUploadInfo({
      SpaceName: spaceName || getSpaceName(),
      SessionKey: sessionKey,
    });

    const result = data?.Result;
    const resultItem = result?.Results?.[0];

    res.json({
      success: true,
      data: {
        vid: resultItem?.Vid,
        duration: resultItem?.VideoMeta?.Duration,
        format: resultItem?.VideoMeta?.Format,
        height: resultItem?.VideoMeta?.Height,
        width: resultItem?.VideoMeta?.Width,
        bitrate: resultItem?.VideoMeta?.Bitrate,
        size: resultItem?.VideoMeta?.Size,
      },
    });
  } catch (error: any) {
    console.error('确认上传失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '确认上传失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 直接上传文件（通过 multipart/form-data 上传）
// 使用 SDK 的 UploadMedia 方法，自动处理 TOS 上传和 CRC32 校验
const upload = multer({ dest: 'uploads/' });

aideoRouter.post('/upload/direct', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '需要上传文件（字段名: file）' });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const ext = path.extname(originalName);

    // 使用 SDK 的 UploadMedia 方法（自动处理 ApplyUploadInfo → TOS上传 → CommitUploadInfo）
    const result = await getVodService().UploadMedia({
      SpaceName: getSpaceName(),
      FilePath: filePath,
      FileExtension: ext,
      Functions: JSON.stringify([{ Name: 'GetMeta' }]),
    });

    // 清理临时文件
    fs.unlinkSync(filePath);

    const vid = result?.Result?.Data?.Vid;
    const sourceInfo = result?.Result?.Data?.SourceInfo;

    res.json({
      success: true,
      data: {
        vid,
        size: sourceInfo?.Size,
        storeUri: sourceInfo?.StoreUri,
        fileName: sourceInfo?.FileName,
      },
    });
  } catch (error: any) {
    // 清理临时文件（如果存在）
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch {}
    }
    console.error('上传文件失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '上传文件失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 查询视频信息
aideoRouter.get('/video/:vid', async (req: Request, res: Response) => {
  try {
    const { vid } = req.params;

    // 使用 SDK 查询视频信息（注意：GetMediaInfos 使用 Vids 参数，复数形式）
    const data = await getVodService().GetMediaInfos({
      Vids: vid,
    });

    // 检查 API 错误
    if (data?.ResponseMetadata?.Error) {
      const apiError = data.ResponseMetadata.Error;
      return res.status(400).json({
        error: '火山引擎 API 错误',
        code: apiError.Code,
        message: apiError.Message,
      });
    }

    const result = data?.Result;

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('查询视频信息失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '查询视频信息失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});
