import React, { useState, useRef } from 'react';
import { Loader2, CheckCircle, XCircle, Play, RefreshCw, ArrowRight, Upload, FileVideo } from 'lucide-react';

interface TranslationTask {
  projectId: string;
  status: string;
  vid: string;
  videoName: string;
  sourceLanguage: string;
  targetLanguage: string;
  result?: any;
  createdAt: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
  { value: 'th', label: 'ไทย' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'id', label: 'Bahasa Indonesia' },
];

export function TranslationPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [sourceLanguage, setSourceLanguage] = useState('zh');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translationTypes, setTranslationTypes] = useState(['SubtitleTranslation', 'VoiceTranslation']);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TranslationTask[]>([]);
  const [pollingIntervals, setPollingIntervals] = useState<Map<string, NodeJS.Timeout>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setError('请选择视频文件');
      return;
    }

    setIsUploading(true);
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. 上传视频到火山引擎
      const formData = new FormData();
      formData.append('file', videoFile);

      const uploadResponse = await fetch('/api/aideo/upload/direct', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.message || uploadData.error || '视频上传失败');
      }

      const vid = uploadData.data.vid;
      if (!vid) {
        throw new Error('上传成功但未获取到视频ID');
      }

      setIsUploading(false);

      // 2. 提交翻译任务
      const translateResponse = await fetch('/api/translation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vid,
          sourceLanguage,
          targetLanguage,
          translationTypes,
        }),
      });

      const translateData = await translateResponse.json();

      if (!translateResponse.ok) {
        throw new Error(translateData.message || translateData.error || '翻译任务提交失败');
      }

      const newTask: TranslationTask = {
        projectId: translateData.projectId,
        status: 'processing',
        vid,
        videoName: videoFile.name,
        sourceLanguage,
        targetLanguage,
        createdAt: new Date().toISOString(),
      };

      setTasks(prev => [newTask, ...prev]);
      setVideoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      startPolling(translateData.projectId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  const startPolling = (projectId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/translation/project/${projectId}`);
        const data = await response.json();

        if (data.success && data.data) {
          const project = data.data;
          const status = project.Status?.toLowerCase() || 'unknown';

          setTasks(prev => prev.map(t =>
            t.projectId === projectId
              ? { ...t, status, result: project }
              : t
          ));

          if (status === 'completed' || status === 'failed') {
            stopPolling(projectId);
          }
        }
      } catch (err) {
        console.error('轮询翻译状态失败:', err);
      }
    }, 5000);

    setPollingIntervals(prev => new Map(prev).set(projectId, interval));
  };

  const stopPolling = (projectId: string) => {
    const interval = pollingIntervals.get(projectId);
    if (interval) {
      clearInterval(interval);
      setPollingIntervals(prev => {
        const next = new Map(prev);
        next.delete(projectId);
        return next;
      });
    }
  };

  const handleResume = async (projectId: string) => {
    try {
      const response = await fetch(`/api/translation/resume/${projectId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || '恢复失败');
      }

      setTasks(prev => prev.map(t =>
        t.projectId === projectId
          ? { ...t, status: 'processing' }
          : t
      ));

      startPolling(projectId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRefresh = async (projectId: string) => {
    try {
      const response = await fetch(`/api/translation/refresh/${projectId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || '刷新失败');
      }

      setTasks(prev => prev.map(t =>
        t.projectId === projectId
          ? { ...t, status: 'processing' }
          : t
      ));

      startPolling(projectId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      case 'processing':
      case 'pending':
        return <Loader2 size={16} className="animate-spin text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      case 'processing':
        return '处理中';
      case 'pending':
        return '等待中';
      case 'suspended':
        return '已暂停';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI视频翻译</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">上传视频并翻译</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                选择视频文件
              </label>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="video-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="video-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <Upload size={18} />
                  选择文件
                </label>
                {videoFile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileVideo size={16} />
                    <span>{videoFile.name}</span>
                    <span className="text-gray-400">({(videoFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  源语言
                </label>
                <select
                  value={sourceLanguage}
                  onChange={(e) => setSourceLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {LANGUAGE_OPTIONS.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目标语言
                </label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  {LANGUAGE_OPTIONS.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                翻译类型
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={translationTypes.includes('SubtitleTranslation')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTranslationTypes(prev => [...prev, 'SubtitleTranslation']);
                      } else {
                        setTranslationTypes(prev => prev.filter(t => t !== 'SubtitleTranslation'));
                      }
                    }}
                    className="mr-2"
                    disabled={isSubmitting}
                  />
                  字幕翻译
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={translationTypes.includes('VoiceTranslation')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTranslationTypes(prev => [...prev, 'VoiceTranslation']);
                      } else {
                        setTranslationTypes(prev => prev.filter(t => t !== 'VoiceTranslation'));
                      }
                    }}
                    className="mr-2"
                    disabled={isSubmitting}
                  />
                  语音翻译
                </label>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !videoFile}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  上传中...
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <ArrowRight size={18} />
                  上传并翻译
                </>
              )}
            </button>
          </form>
        </div>

        {tasks.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">翻译任务列表</h2>

            <div className="space-y-4">
              {tasks.map(task => (
                <div
                  key={task.projectId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">{getStatusText(task.status)}</span>
                    </div>

                    <div className="flex gap-2">
                      {task.status === 'suspended' && (
                        <button
                          onClick={() => handleResume(task.projectId)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          <Play size={14} />
                          继续
                        </button>
                      )}
                      {task.status === 'completed' && (
                        <button
                          onClick={() => handleRefresh(task.projectId)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          <RefreshCw size={14} />
                          重新导出
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>项目ID: {task.projectId}</p>
                    <p>视频: {task.videoName} ({task.vid})</p>
                    <p>{task.sourceLanguage} → {task.targetLanguage}</p>
                    <p>创建时间: {new Date(task.createdAt).toLocaleString()}</p>
                  </div>

                  {task.result && task.status === 'completed' && (
                    <div className="mt-3 p-3 bg-green-50 rounded text-sm">
                      <p className="font-medium text-green-800 mb-2">翻译结果:</p>
                      <pre className="whitespace-pre-wrap text-green-700 overflow-auto max-h-40">
                        {JSON.stringify(task.result, null, 2)}
                      </pre>
                    </div>
                  )}

                  {task.result && task.status === 'failed' && (
                    <div className="mt-3 p-3 bg-red-50 rounded text-sm">
                      <p className="font-medium text-red-800 mb-2">错误信息:</p>
                      <pre className="whitespace-pre-wrap text-red-700">
                        {JSON.stringify(task.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
