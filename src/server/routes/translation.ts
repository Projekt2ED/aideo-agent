import { Router, Request, Response } from 'express';
import { vodOpenapi } from '@volcengine/openapi';

export const translationRouter = Router();

function getSpaceName() {
  return process.env.VOD_SPACE_NAME || '';
}

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

let _submitTranslation: any = null;
let _getProject: any = null;
let _listProjects: any = null;
let _continueWorkflow: any = null;
let _updateUtterances: any = null;
let _refreshProject: any = null;

function getSubmitTranslation() {
  if (!_submitTranslation) {
    _submitTranslation = getVodService().createJSONAPI('SubmitAITranslationWorkflow', { Version: '2025-01-01' });
  }
  return _submitTranslation;
}

function getGetProject() {
  if (!_getProject) {
    _getProject = getVodService().createJSONAPI('GetAITranslationProject', { Version: '2025-01-01' });
  }
  return _getProject;
}

function getListProjects() {
  if (!_listProjects) {
    _listProjects = getVodService().createJSONAPI('ListAITranslationProject', { Version: '2025-01-01' });
  }
  return _listProjects;
}

function getContinueWorkflow() {
  if (!_continueWorkflow) {
    _continueWorkflow = getVodService().createJSONAPI('ContinueAITranslationWorkflow', { Version: '2025-01-01' });
  }
  return _continueWorkflow;
}

function getUpdateUtterances() {
  if (!_updateUtterances) {
    _updateUtterances = getVodService().createJSONAPI('UpdateAITranslationUtterances', { Version: '2025-01-01' });
  }
  return _updateUtterances;
}

function getRefreshProject() {
  if (!_refreshProject) {
    _refreshProject = getVodService().createJSONAPI('RefreshAITranslationProject', { Version: '2025-01-01' });
  }
  return _refreshProject;
}

// 提交视频翻译任务
translationRouter.post('/submit', async (req: Request, res: Response) => {
  try {
    const { vid, sourceLanguage, targetLanguage, translationTypes, suspensionStage } = req.body;

    if (!vid) {
      return res.status(400).json({ error: '视频ID(vid)是必需的' });
    }

    if (!sourceLanguage || !targetLanguage) {
      return res.status(400).json({ error: '源语言和目标语言是必需的' });
    }

    const requestBody: any = {
      SpaceName: getSpaceName(),
      Vid: vid,
      TranslationConfig: {
        SourceLanguage: sourceLanguage,
        TargetLanguage: targetLanguage,
        TranslationTypeList: translationTypes || ['SubtitleTranslation', 'VoiceTranslation'],
      },
    };

    if (suspensionStage) {
      requestBody.ProcessConfig = {
        SuspensionStageList: Array.isArray(suspensionStage) ? suspensionStage : [suspensionStage],
      };
    }

    const submitTranslation = getSubmitTranslation();
    const result = await submitTranslation(requestBody);

    if (result?.ResponseMetadata?.Error) {
      const apiError = result.ResponseMetadata.Error;
      return res.status(400).json({
        error: '火山引擎API错误',
        code: apiError.Code,
        message: apiError.Message,
      });
    }

    const projectId = result?.Result?.ProjectId;

    res.json({
      success: true,
      projectId,
      message: '翻译任务已提交',
    });
  } catch (error: any) {
    console.error('提交翻译任务失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '提交翻译任务失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 查询翻译项目详情
translationRouter.get('/project/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const getProject = getGetProject();
    const result = await getProject({
      SpaceName: getSpaceName(),
      ProjectId: projectId,
    });

    if (result?.ResponseMetadata?.Error) {
      const apiError = result.ResponseMetadata.Error;
      return res.status(400).json({
        error: '火山引擎API错误',
        code: apiError.Code,
        message: apiError.Message,
      });
    }

    res.json({
      success: true,
      data: result?.Result,
    });
  } catch (error: any) {
    console.error('查询翻译项目失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '查询翻译项目失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 列出翻译项目
translationRouter.get('/projects', async (req: Request, res: Response) => {
  try {
    const { status, pageSize, pageToken } = req.query;

    const requestBody: any = {
      SpaceName: getSpaceName(),
    };

    if (status) requestBody.Status = status;
    if (pageSize) requestBody.PageSize = parseInt(pageSize as string);
    if (pageToken) requestBody.PageToken = pageToken;

    const listProjects = getListProjects();
    const result = await listProjects(requestBody);

    if (result?.ResponseMetadata?.Error) {
      const apiError = result.ResponseMetadata.Error;
      return res.status(400).json({
        error: '火山引擎API错误',
        code: apiError.Code,
        message: apiError.Message,
      });
    }

    res.json({
      success: true,
      data: result?.Result,
    });
  } catch (error: any) {
    console.error('列出翻译项目失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '列出翻译项目失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 恢复暂停的翻译任务
translationRouter.post('/resume/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const continueWorkflow = getContinueWorkflow();
    const result = await continueWorkflow({
      SpaceName: getSpaceName(),
      ProjectId: projectId,
    });

    if (result?.ResponseMetadata?.Error) {
      const apiError = result.ResponseMetadata.Error;
      return res.status(400).json({
        error: '火山引擎API错误',
        code: apiError.Code,
        message: apiError.Message,
      });
    }

    res.json({
      success: true,
      message: '翻译任务已恢复',
    });
  } catch (error: any) {
    console.error('恢复翻译任务失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '恢复翻译任务失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 更新字幕内容
translationRouter.put('/utterances/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { updateType, utterances, subtitleFileName } = req.body;

    if (!updateType) {
      return res.status(400).json({ error: 'updateType是必需的' });
    }

    const requestBody: any = {
      SpaceName: getSpaceName(),
      ProjectId: projectId,
      UpdateType: updateType,
    };

    if (updateType === 'Utterances' && utterances) {
      requestBody.Utterances = utterances;
    } else if (updateType === 'OutputSubtitleFile' && subtitleFileName) {
      requestBody.OutputSubtitleFileName = subtitleFileName;
    }

    const updateUtterances = getUpdateUtterances();
    const result = await updateUtterances(requestBody);

    if (result?.ResponseMetadata?.Error) {
      const apiError = result.ResponseMetadata.Error;
      return res.status(400).json({
        error: '火山引擎API错误',
        code: apiError.Code,
        message: apiError.Message,
      });
    }

    res.json({
      success: true,
      message: '字幕已更新',
    });
  } catch (error: any) {
    console.error('更新字幕失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '更新字幕失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});

// 重新导出翻译视频
translationRouter.post('/refresh/:projectId', async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    const refreshProject = getRefreshProject();
    const result = await refreshProject({
      SpaceName: getSpaceName(),
      ProjectId: projectId,
    });

    if (result?.ResponseMetadata?.Error) {
      const apiError = result.ResponseMetadata.Error;
      return res.status(400).json({
        error: '火山引擎API错误',
        code: apiError.Code,
        message: apiError.Message,
      });
    }

    res.json({
      success: true,
      message: '视频正在重新导出',
    });
  } catch (error: any) {
    console.error('重新导出视频失败:', error?.response?.data || error.message);
    res.status(500).json({
      error: '重新导出视频失败',
      message: error?.response?.data?.Message || error.message,
    });
  }
});
