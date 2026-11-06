import React from 'react';
import { Bot, User, Copy, Check, Loader2, CheckCircle2, XCircle, Clock, Video } from 'lucide-react';
import { Message } from '../types';
import { VideoPreview } from './VideoPreview';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = React.useState(false);

  const isUser = message.role === 'user';
  const isError = message.status === 'error';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTaskStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={12} className="text-yellow-600" />;
      case 'processing':
        return <Loader2 size={12} className="text-purple-600 animate-spin" />;
      case 'completed':
        return <CheckCircle2 size={12} className="text-green-600" />;
      case 'failed':
        return <XCircle size={12} className="text-red-600" />;
      default:
        return null;
    }
  };

  const getTaskStatusText = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'PENDING';
      case 'processing':
        return 'PROCESSING';
      case 'completed':
        return 'COMPLETED';
      case 'failed':
        return 'FAILED';
      default:
        return '';
    }
  };

  const renderVideoAttachment = () => {
    // 检查消息内容中是否包含视频URL
    const videoUrlMatch = message.content.match(/https?:\/\/[^\s]+\.(mp4|mov|avi|webm)/i);
    if (videoUrlMatch) {
      return (
        <div className="mt-3">
          <VideoPreview src={videoUrlMatch[0]} title="视频预览" />
        </div>
      );
    }
    return null;
  };

  const renderContent = (content: string) => {
    // 简单的markdown渲染
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // 代码块
      if (line.startsWith('```')) {
        return null;
      }
      // 列表项
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={index} className="ml-4 list-disc">
            {line.slice(2)}
          </li>
        );
      }
      // 普通文本
      return (
        <p key={index} className={index > 0 ? 'mt-2' : ''}>
          {line || <br />}
        </p>
      );
    });
  };

  return (
    <div
      className={`flex items-start gap-4 message-enter ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {/* 头像 - 几何方块 */}
      <div
        className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${
          isUser
            ? 'bg-black text-white'
            : isError
            ? 'bg-red-600 text-white'
            : 'bg-gradient-to-br from-purple-600 to-cyan-500 text-white'
        }`}
      >
        {isUser ? (
          <User size={20} strokeWidth={3} />
        ) : (
          <Bot size={20} strokeWidth={3} />
        )}
      </div>

      {/* 消息内容 */}
      <div
        className={`relative group max-w-[80%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        <div
          className={`px-5 py-4 text-sm leading-relaxed font-display ${
            isUser
              ? 'bg-black text-white border-2 border-black'
              : isError
              ? 'bg-red-50 text-red-900 border-2 border-red-600'
              : 'bg-white text-gray-900 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
          }`}
        >
          {renderContent(message.content)}
          
          {/* 视频附件预览 */}
          {!isUser && renderVideoAttachment()}
          
          {/* 任务状态显示 */}
          {message.taskId && !isUser && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs font-mono uppercase tracking-wider">
              <span className={`inline-flex items-center gap-1.5 px-2 py-1 border ${
                message.status === 'completed' ? 'border-green-600 text-green-600 bg-green-50' :
                message.status === 'failed' ? 'border-red-600 text-red-600 bg-red-50' :
                message.status === 'processing' ? 'border-purple-600 text-purple-600 bg-purple-50' :
                'border-yellow-600 text-yellow-600 bg-yellow-50'
              }`}>
                {getTaskStatusIcon(message.status)}
                {getTaskStatusText(message.status)}
              </span>
            </div>
          )}
        </div>

        {/* 时间和操作 */}
        <div
          className={`flex items-center gap-3 mt-2 ${
            isUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
            {formatTime(message.timestamp)}
          </span>
          {message.taskId && (
            <span className="text-[10px] text-gray-400 font-mono">
              ID: {message.taskId.slice(0, 6)}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
            title="复制消息"
          >
            {copied ? (
              <Check size={12} className="text-green-600" strokeWidth={3} />
            ) : (
              <Copy size={12} className="text-gray-400" strokeWidth={3} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
