import React, { useState } from 'react';
import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, ListTodo, BarChart3, Video, Languages } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Conversation, Task } from '../types';
import { TaskHistory } from './TaskHistory';
import { TaskStats } from './TaskStats';
import clsx from 'clsx';

interface SidebarProps {
  conversations: Conversation[];
  tasks: Task[];
  currentConversationId?: string;
  onCreateConversation: () => void;
  onSwitchConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onDeleteTask?: (taskId: string) => void;
}

export function Sidebar({
  conversations,
  tasks,
  currentConversationId,
  onCreateConversation,
  onSwitchConversation,
  onDeleteConversation,
  onDeleteTask,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'conversations' | 'tasks'>('conversations');
  const [showStats, setShowStats] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'sidebar-transition flex flex-col h-full border-r-2 border-black bg-[#FAFAFA]',
        isCollapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b-2 border-black bg-white h-16">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <span className="text-white font-bold text-sm font-display">A</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">AIDEO</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={clsx(
            "p-2 hover:bg-gray-100 transition-colors",
            isCollapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* 新建对话按钮 */}
      <div className="p-3 space-y-2">
        <button
          onClick={onCreateConversation}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-3 font-display font-bold text-sm transition-all duration-100',
            'bg-black text-white hover:bg-gray-800 active:translate-y-0.5',
            isCollapsed ? 'px-0' : 'px-4'
          )}
        >
          <Plus size={18} strokeWidth={3} />
          {!isCollapsed && <span>新建对话</span>}
        </button>

        {/* 翻译页面入口 */}
        <Link
          to="/translation"
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-3 font-display font-bold text-sm transition-all duration-100 border-2',
            location.pathname === '/translation'
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-black border-black hover:bg-gray-100',
            isCollapsed ? 'px-0' : 'px-4'
          )}
        >
          <Languages size={18} strokeWidth={3} />
          {!isCollapsed && <span>AI视频翻译</span>}
        </Link>
      </div>

      {/* 标签切换 */}
      <div className="flex border-b-2 border-black">
        <button
          onClick={() => setActiveTab('conversations')}
          className={clsx(
            'flex-1 flex items-center justify-center gap-1 py-3 font-display font-bold text-xs uppercase tracking-widest transition-colors',
            activeTab === 'conversations'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-100'
          )}
        >
          {isCollapsed ? <MessageSquare size={16} /> : '对话'}
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={clsx(
            'flex-1 flex items-center justify-center gap-1 py-3 font-display font-bold text-xs uppercase tracking-widest transition-colors border-l-2 border-black',
            activeTab === 'tasks'
              ? 'bg-black text-white'
              : 'bg-white text-black hover:bg-gray-100'
          )}
        >
          {isCollapsed ? <ListTodo size={16} /> : '任务'}
          {!isCollapsed && tasks.filter(t => t.status === 'processing' || t.status === 'pending').length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-purple-600 text-white font-mono">
              {tasks.filter(t => t.status === 'processing' || t.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {activeTab === 'conversations' ? (
          // 对话列表
          <>
            {conversations.map(conversation => (
              <div
                key={conversation.id}
                className={clsx(
                  'group flex items-center gap-3 px-3 py-3 cursor-pointer transition-all duration-100 border-2 border-transparent',
                  conversation.id === currentConversationId
                    ? 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'hover:bg-white hover:border-gray-200'
                )}
                onClick={() => onSwitchConversation(conversation.id)}
              >
                {conversation.vid ? (
                  <Video size={16} className={clsx(
                    "flex-shrink-0",
                    conversation.id === currentConversationId ? "text-purple-600" : "text-gray-400"
                  )} />
                ) : (
                  <MessageSquare size={16} className={clsx(
                    "flex-shrink-0",
                    conversation.id === currentConversationId ? "text-purple-600" : "text-gray-400"
                  )} />
                )}
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="truncate text-sm font-display font-bold leading-tight">
                        {conversation.title || '新对话'}
                      </div>
                      {conversation.vid && conversation.videoName && (
                        <div className="truncate text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-mono">
                          {conversation.videoName}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 text-red-500 transition-all border border-transparent hover:border-red-500"
                    >
                      <Trash2 size={14} strokeWidth={3} />
                    </button>
                  </>
                )}
              </div>
            ))}

            {conversations.length === 0 && !isCollapsed && (
              <div className="text-center text-gray-500 py-8 text-sm font-display">
                暂无对话
              </div>
            )}
          </>
        ) : (
          // 任务历史
          <div className="px-1 space-y-2">
            {/* 统计按钮 */}
            <button
              onClick={() => setShowStats(!showStats)}
              className={clsx(
                'w-full flex items-center justify-center gap-1 py-2 text-xs font-display font-bold uppercase tracking-widest transition-colors border-2',
                showStats
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-200 hover:border-black'
              )}
            >
              <BarChart3 size={12} strokeWidth={3} />
              {showStats ? '隐藏统计' : '查看统计'}
            </button>

            {/* 统计面板 */}
            {showStats && <TaskStats />}

            {/* 任务列表 */}
            <TaskHistory tasks={tasks} onDeleteTask={onDeleteTask} />
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <div className="p-4 border-t-2 border-black bg-white">
        {!isCollapsed ? (
          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-mono text-center">
            AIDEO AGENT v1.0
          </div>
        ) : (
          <div className="text-center text-[10px] text-gray-400 font-mono">V1</div>
        )}
      </div>
    </aside>
  );
}
