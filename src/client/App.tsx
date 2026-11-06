import React, { useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { TranslationPage } from './components/TranslationPage';
import { ToastContainer } from './components/Toast';
import { useChat } from './hooks/useChat';
import { useToast } from './hooks/useToast';

function App() {
  const {
    conversations,
    currentConversation,
    messages,
    tasks,
    isLoading,
    createConversation,
    switchConversation,
    sendMessage,
    uploadVideoAndCreateConversation,
    deleteConversation,
    deleteTask,
  } = useChat();

  const toast = useToast();

  // 包装 switchConversation 以匹配 Sidebar 的签名
  const handleSwitchConversation = useCallback((id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      switchConversation(conv);
    }
  }, [conversations, switchConversation]);

  // 包装 sendMessage（不再需要 vid 参数，从当前对话获取）
  const handleSendMessage = useCallback(async (content: string) => {
    try {
      await sendMessage(content);
      toast.success('任务已提交');
    } catch (err: any) {
      toast.error(err.message || '发送失败');
    }
  }, [sendMessage, toast]);

  // 包装上传视频并创建对话
  const handleUploadVideo = useCallback(async (file: File) => {
    try {
      await uploadVideoAndCreateConversation(file);
      toast.success('视频上传成功，对话已创建');
    } catch (err: any) {
      toast.error(err.message || '上传失败');
      throw err; // 重新抛出让 ChatArea 处理
    }
  }, [uploadVideoAndCreateConversation, toast]);

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Toast 通知 */}
        <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />

        {/* 侧边栏 */}
        <Sidebar
          conversations={conversations}
          tasks={tasks}
          currentConversationId={currentConversation?.id}
          onCreateConversation={createConversation}
          onSwitchConversation={handleSwitchConversation}
          onDeleteConversation={deleteConversation}
          onDeleteTask={deleteTask}
        />

        {/* 主聊天区域 */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route
              path="/"
              element={
                <ChatArea
                  conversation={currentConversation}
                  messages={messages}
                  isLoading={isLoading}
                  onSendMessage={handleSendMessage}
                  onUploadVideo={handleUploadVideo}
                />
              }
            />
            <Route path="/translation" element={<TranslationPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
