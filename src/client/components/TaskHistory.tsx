import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp, Trash2, RefreshCw } from 'lucide-react';
import { Task } from '../types';

interface TaskHistoryProps {
  tasks: Task[];
  onDeleteTask?: (taskId: string) => void;
  onRefreshTask?: (taskId: string) => void;
}

export function TaskHistory({ tasks, onDeleteTask, onRefreshTask }: TaskHistoryProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'processing':
        return <Loader2 size={16} className="text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'failed':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return '等待中';
      case 'processing':
        return '处理中';
      case 'completed':
        return '已完成';
      case 'failed':
        return '失败';
      default:
        return '未知';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const renderTaskResult = (task: Task) => {
    if (!task.result) return null;

    const result = task.result;

    // 如果是错误结果
    if (result.error) {
      return (
        <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-600">
          {result.error}
        </div>
      );
    }

    // 如果是成功的视频处理结果
    if (result.OutputUrl || result.output_url) {
      const videoUrl = result.OutputUrl || result.output_url;
      return (
        <div className="mt-2 space-y-2">
          <div className="p-2 bg-green-50 rounded text-sm text-green-600">
            视频处理完成
          </div>
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg max-h-48"
            preload="metadata"
          />
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-blue-500 hover:text-blue-700 underline"
          >
            下载视频
          </a>
        </div>
      );
    }

    // 通用结果展示
    return (
      <div className="mt-2 p-2 bg-gray-50 rounded text-xs font-mono overflow-auto max-h-32">
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8 text-sm">
        <Clock size={32} className="mx-auto mb-2 opacity-50" />
        <p>暂无任务记录</p>
        <p className="text-xs mt-1">上传视频并提交任务后将在此显示</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div
          key={task.id}
          className="border rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
        >
          {/* 任务头部 */}
          <div
            className="flex items-center gap-2 p-3 cursor-pointer"
            onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
          >
            {getStatusIcon(task.status)}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {task.title || '未命名任务'}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(task.createdAt)}
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </span>
            {expandedTaskId === task.id ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>

          {/* 任务详情（展开时显示） */}
          {expandedTaskId === task.id && (
            <div className="px-3 pb-3 border-t pt-2">
              {/* 任务描述 */}
              {task.description && (
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              )}

              {/* 任务信息 */}
              <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-2">
                {task.skillType && (
                  <div>技能类型: {task.skillType}</div>
                )}
                {task.vid && (
                  <div className="truncate">视频ID: {task.vid.slice(0, 12)}...</div>
                )}
                <div>创建时间: {new Date(task.createdAt).toLocaleString('zh-CN')}</div>
                {task.updatedAt !== task.createdAt && (
                  <div>更新时间: {new Date(task.updatedAt).toLocaleString('zh-CN')}</div>
                )}
              </div>

              {/* 任务结果 */}
              {renderTaskResult(task)}

              {/* 操作按钮 */}
              <div className="flex items-center gap-2 mt-3">
                {(task.status === 'pending' || task.status === 'processing') && onRefreshTask && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRefreshTask(task.id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-blue-500 hover:bg-blue-50 rounded transition-colors"
                  >
                    <RefreshCw size={12} />
                    刷新状态
                  </button>
                )}
                {onDeleteTask && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={12} />
                    删除
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
