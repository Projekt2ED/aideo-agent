import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader2, Video, ArrowRight } from 'lucide-react';
import { Conversation, Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { FileUpload } from './FileUpload';

interface ChatAreaProps {
  conversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onUploadVideo: (file: File) => Promise<void>;
}

export function ChatArea({ conversation, messages, isLoading, onSendMessage, onUploadVideo }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自动聚焦输入框
  useEffect(() => {
    if (!isLoading && hasVideo) {
      inputRef.current?.focus();
    }
  }, [isLoading, conversation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !hasVideo) return;

    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 处理视频文件选择 → 上传并创建对话
  const handleFileSelected = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);
    try {
      await onUploadVideo(file);
    } catch (err: any) {
      setUploadError(err.message || '上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };

  // 判断当前对话是否已绑定视频
  const hasVideo = !!conversation?.vid;

  // 无对话或无视频绑定 → 显示上传界面
  const showUploadView = !conversation || !hasVideo;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      {/* 头部 - 包豪斯风格 */}
      <header className="flex items-center justify-between px-6 h-16 border-b-2 border-black bg-white z-10">
        <div className="flex items-center gap-4">
          <h1 className="font-display font-bold text-lg tracking-tight text-black">
            {conversation?.title || 'AIDEO WORKSPACE'}
          </h1>
          {hasVideo && (
            <div className="flex items-center gap-2 px-2 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest">
              <Video size={12} />
              <span className="truncate max-w-[200px]">{conversation?.videoName || 'VIDEO BOUND'}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-widest border-2 ${
            hasVideo ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-gray-200 text-gray-500'
          }`}>
            {hasVideo ? 'VIDEO MODE' : 'IDLE'}
          </span>
        </div>
      </header>

      {/* 消息区域 / 上传界面 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        {showUploadView ? (
          // 上传视频界面
          <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
            <div className="mb-8 relative">
              <div className="w-24 h-24 bg-black flex items-center justify-center rotate-3 shadow-[6px_6px_0px_0px_rgba(139,92,246,1)]">
                <span className="text-white font-display font-bold text-5xl -rotate-3">A</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-display font-bold text-black mb-4 tracking-tight leading-none">
              开始创作
            </h2>
            <p className="text-gray-500 font-display max-w-md mb-10 text-lg">
              上传视频，开启 AI 智能处理工作流。
            </p>

            {/* 视频上传区域 */}
            <div className="w-full max-w-lg mb-8">
              {isUploading ? (
                <div className="border-4 border-dashed border-black p-10 text-center bg-white">
                  <Loader2 size={48} className="animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="font-display font-bold text-lg text-black">正在上传...</p>
                  <p className="text-sm text-gray-500 font-mono mt-2">PLEASE WAIT</p>
                </div>
              ) : (
                <FileUpload
                  onFileSelected={handleFileSelected}
                  onError={(err) => setUploadError(err)}
                  disabled={isLoading}
                />
              )}
            </div>

            {/* 上传错误提示 */}
            {uploadError && (
              <div className="w-full max-w-lg mb-6 p-4 bg-red-50 border-l-4 border-red-600 text-red-800 text-sm font-display font-bold flex items-center gap-2">
                <span className="text-red-600">ERROR:</span> {uploadError}
              </div>
            )}

            {/* 功能卡片 - 包豪斯网格 */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {[
                { title: '智能翻译', desc: '多语言视频本地化' },
                { title: '高光剪辑', desc: 'AI 自动精彩片段' },
                { title: '字幕擦除', desc: '无痕去除硬字幕' },
                { title: '深度理解', desc: '视频内容分析' },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="group p-4 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors duration-200 cursor-default"
                >
                  <div className="font-display font-bold text-sm uppercase tracking-wider mb-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-300 font-mono">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // 消息列表
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map(message => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {/* 加载指示器 */}
            {isLoading && (
              <div className="flex items-start gap-4 message-enter">
                <div className="w-10 h-10 bg-black flex items-center justify-center flex-shrink-0">
                  <Bot size={20} className="text-white" />
                </div>
                <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 输入区域 */}
      {hasVideo && (
        <div className="border-t-2 border-black bg-white p-4">
          <form onSubmit={handleSubmit} className="flex items-end gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入指令..."
                rows={1}
                className="w-full px-4 py-3 border-2 border-black resize-none focus:outline-none focus:ring-0 focus:border-purple-600 font-display text-sm bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all focus:shadow-[2px_2px_0px_0px_rgba(139,92,246,1)] focus:translate-x-[2px] focus:translate-y-[2px]"
                style={{ minHeight: '52px', maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-black text-white border-2 border-black hover:bg-purple-600 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(139,92,246,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <ArrowRight size={20} strokeWidth={3} />
              )}
            </button>
          </form>

          <div className="mt-3 text-[10px] text-gray-400 text-center font-mono uppercase tracking-widest max-w-4xl mx-auto">
            ENTER TO SEND • SINGLE TASK PER SESSION • NEW SESSION FOR NEW VIDEO
          </div>
        </div>
      )}
    </div>
  );
}
