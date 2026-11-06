import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, Conversation, Task } from '../types';
import { conversationApi, aideoApi, taskApi, uploadApi, wsClient } from '../utils/api';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsConnected = useRef(false);
  const tasksRef = useRef<Task[]>([]);
  const messagesRef = useRef<Message[]>([]);
  const currentConversationRef = useRef<Conversation | null>(null);

  // 保持 tasksRef 与 tasks 同步
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  // 保持 messagesRef 与 messages 同步
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // 保持 currentConversationRef 与 currentConversation 同步
  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);

  // 初始化 WebSocket 连接
  useEffect(() => {
    if (!wsConnected.current) {
      wsClient.connect();
      wsConnected.current = true;
    }

    // 监听任务更新
    const unsubscribeTaskUpdate = wsClient.on('task_update', (data: any) => {
      const { taskId, data: updateData } = data;
      if (updateData.event === 'task_status_changed') {
        const newStatus = updateData.status as Task['status'];
        
        setTasks(prev => {
          const updated = prev.map(t =>
            t.id === taskId ? { ...t, status: newStatus, result: updateData.result || t.result } : t
          );
          tasksRef.current = updated; // 同步更新 ref
          return updated;
        });

        // 如果任务完成，添加助手消息
        if (newStatus === 'completed') {
          const resultInfo = updateData.result;
          let resultContent = `✅ 任务已完成！\n\n任务ID: ${taskId}`;
          
          // 检查火山引擎返回的视频结果
          const artifacts = resultInfo?.ApiResponses?.[0]?.VCreative?.Artifacts;
          if (artifacts && artifacts.length > 0) {
            const vid = artifacts[0].Vid;
            if (vid) {
              resultContent += `\n\n🎬 处理完成！新视频 ID: ${vid}\n\n您可以在火山引擎控制台查看处理结果。`;
            }
          } else if (resultInfo?.OutputUrl || resultInfo?.output_url) {
            const videoUrl = resultInfo.OutputUrl || resultInfo.output_url;
            resultContent += `\n\n视频处理完成，结果链接：\n${videoUrl}`;
          }
          
          const assistantMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: resultContent,
            timestamp: new Date().toISOString(),
            taskId,
            status: 'completed',
          };
          setMessages(prev => [...prev, assistantMessage]);

          // 持久化：保存完成消息到数据库 + 更新原始任务消息状态
          const convId = currentConversationRef.current?.id;
          if (convId) {
            conversationApi.addMessage(convId, {
              role: 'assistant',
              content: resultContent,
              taskId,
              status: 'completed',
            }).catch(err => console.error('保存完成消息失败:', err));
            // 更新原始任务消息的状态为 completed
            setMessages(prev => {
              const taskMsg = prev.find(m => m.taskId === taskId && m.status !== 'completed' && m.status !== 'failed');
              if (taskMsg) {
                conversationApi.updateMessage(convId, taskMsg.id, { status: 'completed' })
                  .catch(err => console.error('更新任务消息状态失败:', err));
              }
              return prev.map(m =>
                m.taskId === taskId && m.status !== 'completed' && m.status !== 'failed'
                  ? { ...m, status: 'completed' as const }
                  : m
              );
            });
          }
        } else if (newStatus === 'failed') {
          // 确保错误信息是可读字符串
          const rawError = updateData.result?.error;
          const errorText = typeof rawError === 'object' 
            ? (rawError.Message || rawError.message || JSON.stringify(rawError))
            : (rawError || '未知错误');
          const assistantMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `❌ 任务失败\n\n任务ID: ${taskId}\n错误: ${errorText}`,
            timestamp: new Date().toISOString(),
            taskId,
            status: 'failed',
          };
          setMessages(prev => [...prev, assistantMessage]);

          // 持久化：保存失败消息到数据库 + 更新原始任务消息状态
          const convId = currentConversationRef.current?.id;
          if (convId) {
            conversationApi.addMessage(convId, {
              role: 'assistant',
              content: `❌ 任务失败\n\n任务ID: ${taskId}\n错误: ${errorText}`,
              taskId,
              status: 'failed',
            }).catch(err => console.error('保存失败消息失败:', err));
            setMessages(prev => {
              const taskMsg = prev.find(m => m.taskId === taskId && m.status !== 'completed' && m.status !== 'failed');
              if (taskMsg) {
                conversationApi.updateMessage(convId, taskMsg.id, { status: 'failed' })
                  .catch(err => console.error('更新任务消息状态失败:', err));
              }
              return prev.map(m =>
                m.taskId === taskId && m.status !== 'completed' && m.status !== 'failed'
                  ? { ...m, status: 'failed' as const }
                  : m
              );
            });
          }
        } else if (newStatus === 'processing') {
          // 更新处理中的消息状态
          setMessages(prev => prev.map(m => 
            m.taskId === taskId && m.status === 'pending' 
              ? { ...m, status: 'processing' } 
              : m
          ));
          // 持久化更新
          const convId = currentConversationRef.current?.id;
          if (convId) {
            const taskMsg = messagesRef.current.find(m => m.taskId === taskId && m.status === 'pending');
            if (taskMsg) {
              conversationApi.updateMessage(convId, taskMsg.id, { status: 'processing' })
                .catch(err => console.error('更新消息状态失败:', err));
            }
          }
        } else if (newStatus === 'waiting') {
          // 等待状态 - 更新任务状态但不添加新消息
          setMessages(prev => prev.map(m => 
            m.taskId === taskId && m.status === 'pending' 
              ? { ...m, content: m.content + '\n⏳ 排队等待中...' } 
              : m
          ));
        }
      }
    });

    // 监听 WebSocket 错误消息
    const unsubscribeError = wsClient.on('error', (data: any) => {
      console.error('WebSocket 服务端错误:', data.message);
      setError(data.message || 'WebSocket 连接异常');
    });

    return () => {
      unsubscribeTaskUpdate();
      unsubscribeError();
    };
  }, []);

  // 加载对话列表
  const loadConversations = useCallback(async () => {
    try {
      const data = await conversationApi.getAll();
      setConversations(data);
    } catch (err) {
      console.error('加载对话列表失败:', err);
    }
  }, []);

  // 加载任务列表
  const loadTasks = useCallback(async () => {
    try {
      const data = await taskApi.getAll();
      setTasks(data);
      tasksRef.current = data; // 同步更新 ref
    } catch (err) {
      console.error('加载任务列表失败:', err);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadConversations();
    loadTasks();
  }, [loadConversations, loadTasks]);

  // 查询任务状态（必须在轮询 useEffect 之前定义）
  const checkTaskStatus = useCallback(async (taskId: string) => {
    try {
      const localTask = tasksRef.current.find(t => t.id === taskId);
      if (localTask?.volcTaskId) {
        const result = await aideoApi.getResult(localTask.volcTaskId);
        return result;
      }
      return null;
    } catch (err) {
      console.error('查询任务状态失败:', err);
      return null;
    }
  }, []);

  // 前端自动轮询处理中的任务（作为后端轮询的补充）
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const currentTasks = tasksRef.current;
      const processingTasks = currentTasks.filter(t => t.status === 'pending' || t.status === 'processing');
      if (processingTasks.length === 0) return;

      for (const task of processingTasks) {
        try {
          const result = await checkTaskStatus(task.id);
          if (result && (result.status === 'completed' || result.status === 'failed')) {
            setTasks(prev => {
              const updated = prev.map(t =>
                t.id === task.id ? { ...t, status: result.status as any, result: result.result || t.result } : t
              );
              tasksRef.current = updated; // 同步更新 ref
              return updated;
            });
          }
        } catch (err) {
          // 静默处理轮询错误
        }
      }
    }, 15000);

    return () => clearInterval(pollInterval);
  }, [checkTaskStatus]);

  // 创建新对话（支持绑定视频）
  const createConversation = useCallback(async (title?: string, vid?: string, videoName?: string) => {
    try {
      const result = await conversationApi.create(title, vid, videoName);
      const newConv: Conversation = {
        id: result.id,
        title: result.title,
        vid: result.vid,
        videoName: result.videoName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setConversations(prev => [newConv, ...prev]);
      setCurrentConversation(newConv);
      setMessages([]);
      return newConv;
    } catch (err) {
      console.error('创建对话失败:', err);
      throw err;
    }
  }, []);

  // 切换对话
  const switchConversation = useCallback(async (conversation: Conversation) => {
    try {
      setCurrentConversation(conversation);
      const msgs = await conversationApi.getMessages(conversation.id);
      setMessages(msgs);

      // 检查是否有消息状态与任务状态不一致（页面刷新/重新加载场景）
      const currentTasks = tasksRef.current;
      for (const msg of msgs) {
        if (msg.taskId && (msg.status === 'pending' || msg.status === 'processing')) {
          const task = currentTasks.find(t => t.id === msg.taskId);
          if (task && (task.status === 'completed' || task.status === 'failed')) {
            // 任务已完成/失败但消息还是 pending → 更新消息状态
            conversationApi.updateMessage(conversation.id, msg.id, { status: task.status })
              .catch(err => console.error('同步消息状态失败:', err));
            // 同时检查是否缺少完成/失败消息
            const hasResultMsg = msgs.some(m => 
              m.role === 'assistant' && m.taskId === msg.taskId && 
              (m.status === 'completed' || m.status === 'failed') && m.id !== msg.id
            );
            if (!hasResultMsg) {
              // 补发完成/失败消息
              let content = '';
              if (task.status === 'completed') {
                content = `✅ 任务已完成！\n\n任务ID: ${task.id}`;
                const resultInfo = task.result;
                const artifacts = resultInfo?.ApiResponses?.[0]?.VCreative?.Artifacts;
                if (artifacts && artifacts.length > 0) {
                  content += `\n\n🎬 处理完成！新视频 ID: ${artifacts[0].Vid}\n\n您可以在火山引擎控制台查看处理结果。`;
                }
              } else {
                const rawError = task.result?.error;
                const errorText = typeof rawError === 'object'
                  ? (rawError.Message || rawError.message || JSON.stringify(rawError))
                  : (rawError || '未知错误');
                content = `❌ 任务失败\n\n任务ID: ${task.id}\n错误: ${errorText}`;
              }
              if (content) {
                conversationApi.addMessage(conversation.id, {
                  role: 'assistant',
                  content,
                  taskId: task.id,
                  status: task.status,
                }).catch(err => console.error('补发结果消息失败:', err));
              }
            }
          }
        }
      }

      // 重新加载消息以反映更新
      const updatedMsgs = await conversationApi.getMessages(conversation.id);
      setMessages(updatedMsgs);
    } catch (err) {
      console.error('加载消息失败:', err);
    }
  }, []);

  // 删除对话
  const deleteConversation = useCallback(async (id: string) => {
    try {
      await conversationApi.delete(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('删除对话失败:', err);
    }
  }, [currentConversation]);

  // 上传视频并创建/绑定对话
  const uploadVideoAndCreateConversation = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. 使用 uploadApi 上传视频（走 /api/aideo/upload/direct）
      const uploadResult = await uploadApi.uploadDirect(file);

      if (!uploadResult.success || !uploadResult.data?.vid) {
        throw new Error('上传失败，未获取到视频 ID');
      }

      const vid = uploadResult.data.vid;
      const videoName = file.name;
      const convTitle = `视频处理 - ${videoName}`;

      let targetConv: Conversation;

      // 2. 判断是否已有空对话（无 vid）→ 绑定视频到已有对话
      if (currentConversation && !currentConversation.vid) {
        await conversationApi.update(currentConversation.id, { vid, videoName });
        targetConv = {
          ...currentConversation,
          title: convTitle,
          vid,
          videoName,
        };
        setCurrentConversation(targetConv);
        setConversations(prev => prev.map(c =>
          c.id === targetConv.id ? targetConv : c
        ));
      } else {
        // 3. 没有对话或已有视频绑定 → 创建新对话
        targetConv = await createConversation(convTitle, vid, videoName);
      }

      // 4. 添加欢迎消息
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🎬 视频已上传成功！\n\n📹 视频名称: ${videoName}\n🆔 视频 ID: ${vid}\n\n现在您可以告诉我您想对这个视频做什么：\n\n📝 **翻译** - 将视频翻译成其他语言\n✂️ **高光剪辑** - 自动生成精彩片段\n🔤 **字幕擦除** - 自动去除视频硬字幕\n🔍 **视频理解** - AI 深度分析视频内容`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);

      // 5. 保存欢迎消息到数据库
      await conversationApi.addMessage(targetConv.id, {
        role: 'assistant',
        content: welcomeMessage.content,
      });

      return targetConv;
    } catch (err: any) {
      setError(err.message || '上传视频失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, createConversation]);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    // 防止重复提交
    if (isLoading) {
      console.warn('⚠️ 消息正在处理中，请稍候...');
      return;
    }

    let convId = currentConversation?.id || '';

    // 如果没有对话，先创建一个（普通对话，不绑定视频）
    if (!convId) {
      const newConv = await createConversation();
      convId = newConv.id;
    }

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // 保存用户消息到数据库
      await conversationApi.addMessage(convId, {
        role: 'user',
        content,
      });

      // 获取当前对话绑定的视频 VID
      const currentVid = currentConversation?.vid;

      // 检查当前对话是否已有任务（不限状态：同一对话只允许一个任务）
      const existingTask = tasksRef.current.find(
        t => t.conversationId === convId
      );

      // 如果有视频绑定，进入任务模式
      if (currentVid) {
        // ========== 任务模式 ==========

        // 如果当前对话已有任务，不再创建新任务
        if (existingTask) {
          const statusText = existingTask.status === 'processing' || existingTask.status === 'pending'
            ? '正在处理中'
            : existingTask.status === 'completed' ? '已完成' : '已失败';
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `📋 当前对话已有一个任务（${statusText}）\n\n同一对话仅支持一个任务。如需处理其他视频，请创建新对话并上传视频。`,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          await conversationApi.addMessage(convId, {
            role: 'assistant',
            content: assistantMessage.content,
          });
          setIsLoading(false);
          return;
        }

        // 提交任务
        const result = await aideoApi.submit({
          vid: currentVid,
          prompt: content,
          conversationId: convId,
        });

        // 添加任务消息
        const taskMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `🎯 任务已提交！\n\n任务ID: ${result.taskId}\n火山引擎任务ID: ${result.volcTaskId}\n\n正在处理中，请稍候...`,
          timestamp: new Date().toISOString(),
          taskId: result.taskId,
          status: 'pending',
        };
        setMessages(prev => [...prev, taskMessage]);

        // 保存助手消息到数据库
        await conversationApi.addMessage(convId, {
          role: 'assistant',
          content: taskMessage.content,
          taskId: result.taskId,
          status: 'pending',
        });

        // 订阅任务更新（通过 WebSocket）
        wsClient.subscribe(result.taskId);

        // 添加到任务列表（包含 conversationId 用于检查活跃任务）
        const newTask: Task = {
          id: result.taskId,
          volcTaskId: result.volcTaskId,
          title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
          description: content,
          status: 'processing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          conversationId: convId,
        };
        setTasks(prev => [newTask, ...prev]);
        // 同步更新 tasksRef，避免竞态条件导致重复任务检测失效
        tasksRef.current = [newTask, ...tasksRef.current];

      } else {
        // ========== 普通对话模式（无视频绑定） ==========
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `👋 您好！我是 Aideo Agent，一个 AI 视频处理助手。\n\n我可以帮您处理以下任务：\n\n🎬 **视频翻译** - 将视频翻译成其他语言\n✂️ **高光剪辑** - 自动生成精彩片段\n📝 **字幕擦除** - 自动去除视频硬字幕\n🔍 **视频理解** - AI 深度分析视频内容\n\n请先上传视频，然后告诉我您想做什么。`,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMessage]);

        // 保存助手消息到数据库
        await conversationApi.addMessage(convId, {
          role: 'assistant',
          content: assistantMessage.content,
        });
      }

      // 更新对话标题（如果是新对话且第一条消息，且没有绑定视频）
      if (messages.length === 0 && currentConversation && !currentConversation.vid) {
        const newTitle = content.substring(0, 20) + (content.length > 20 ? '...' : '');
        await conversationApi.update(convId, { title: newTitle });
        setCurrentConversation(prev => prev ? { ...prev, title: newTitle } : null);
        setConversations(prev => prev.map(c =>
          c.id === convId ? { ...c, title: newTitle } : c
        ));
      }

    } catch (err: any) {
      setError(err.message || '发送消息失败');
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ 发送失败: ${err.message}`,
        timestamp: new Date().toISOString(),
        status: 'failed',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, messages, createConversation, isLoading]);

  // 删除任务
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await taskApi.delete(taskId);
      setTasks(prev => {
        const updated = prev.filter(t => t.id !== taskId);
        tasksRef.current = updated; // 同步更新 ref
        return updated;
      });
    } catch (err) {
      console.error('删除任务失败:', err);
    }
  }, []);

  return {
    conversations,
    currentConversation,
    messages,
    tasks,
    isLoading,
    error,
    createConversation,
    switchConversation,
    deleteConversation,
    sendMessage,
    uploadVideoAndCreateConversation,
    checkTaskStatus,
    deleteTask,
    loadConversations,
    loadTasks,
  };
}
