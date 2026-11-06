# 项目概述

## 项目名称
Aideo Agent - 基于火山引擎的 AI 视频处理助手

## 项目类型
Web 应用（前后端分离）

## 项目简介
Aideo Agent 是一个集成火山引擎 Aideo Agent API 的 Web 应用，提供类似 ChatGPT 的对话界面，让用户可以通过自然语言与 AI 交互，完成视频翻译、高光剪辑、字幕擦除、视频理解等视频处理任务。

## 核心功能
1. **视频上传** - 支持拖拽上传视频文件到火山引擎 VOD 空间
2. **对话交互** - 类似 ChatGPT 的对话界面，支持自然语言指令
3. **Aideo 任务** - 提交和查询 Aideo Agent 任务（翻译、高光、擦除、理解）
4. **任务管理** - 查看任务状态、历史记录
5. **会话管理** - 创建、切换、删除对话会话

## 技术栈

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **图标**: Lucide React
- **状态管理**: React Hooks (useState, useEffect, useRef)

### 后端
- **运行时**: Node.js
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: SQLite (sql.js)
- **实时通信**: WebSocket (ws)
- **文件上传**: Multer

### 第三方服务
- **火山引擎 VOD**: 视频点播服务
- **火山引擎 Aideo Agent**: AI 视频处理服务
- **@volcengine/openapi**: 火山引擎官方 SDK

## 项目环境

- **Node.js 版本**: >= 18.x
- **包管理器**: npm
- **启动命令**: `npm run dev` (同时启动前端和后端)
- **构建命令**: `npm run build`
- **后端启动**: `npm run dev:server`
- **前端启动**: `npm run dev:client`

## 重要环境变量

```env
# 火山引擎凭证
VOLC_ACCESS_KEY_ID=your_access_key_id
VOLC_SECRET_ACCESS_KEY=your_secret_access_key

# VOD 空间配置
VOD_SPACE_NAME=your_space_name
VOD_BASE_URL=https://vod.volcengineapi.com
```

## 项目结构

```
aideo-agent/
├── src/
│   ├── client/                # 前端代码
│   │   ├── components/        # React 组件
│   │   │   ├── ChatArea.tsx   # 主聊天区域
│   │   │   ├── FileUpload.tsx # 文件上传组件
│   │   │   ├── MessageBubble.tsx # 消息气泡
│   │   │   └── Sidebar.tsx    # 侧边栏
│   │   ├── hooks/             # 自定义 Hooks
│   │   │   └── useChat.ts     # 聊天逻辑 Hook
│   │   ├── types/             # TypeScript 类型
│   │   │   └── index.ts       # 类型定义
│   │   ├── utils/             # 工具函数
│   │   │   └── api.ts         # API 客户端
│   │   ├── App.tsx            # 主应用组件
│   │   ├── main.tsx           # 入口文件
│   │   └── index.css          # 全局样式
│   └── server/                # 后端代码
│       ├── routes/            # API 路由
│       │   ├── aideo.ts       # Aideo Agent 路由
│       │   ├── conversations.ts # 会话路由
│       │   └── tasks.ts       # 任务路由
│       ├── utils/             # 工具函数
│       │   ├── database.ts    # SQLite 数据库
│       │   ├── signature.ts   # 签名工具
│       │   └── websocket.ts   # WebSocket 服务
│       └── index.ts           # 服务器入口
├── docs/                      # 项目文档
├── data/                      # 数据文件
│   └── aideo.db              # SQLite 数据库
├── .env                       # 环境变量
├── package.json               # 项目配置
├── tsconfig.json              # TypeScript 配置
├── tsconfig.server.json       # 服务器 TypeScript 配置
├── vite.config.ts             # Vite 配置
├── tailwind.config.js         # Tailwind CSS 配置
└── postcss.config.js          # PostCSS 配置
```

## 当前完成度评估

### 已完成 ✅
1. 项目基础架构搭建
2. 前端 UI 组件（ChatArea, FileUpload, MessageBubble, Sidebar）
3. 后端 API 路由框架
4. 火山引擎 SDK 集成
5. 视频上传功能 (UploadMedia)
6. Aideo 任务提交 (SubmitAideoTaskAsync)
7. Aideo 任务查询 (GetAideoTaskResult)
8. 视频信息查询 (GetMediaInfos)
9. SQLite 数据库集成
10. WebSocket 实时通信

### 进行中 🔄
1. 前端与后端完整联调
2. 任务状态轮询和更新
3. 错误处理完善

### 待完成 ❌
1. 用户认证和授权
2. 任务历史记录展示
3. 视频预览和播放
4. 任务进度实时更新
5. 多语言支持
6. 响应式设计优化
7. 生产环境部署配置
8. 单元测试和集成测试
9. 性能优化
10. 安全加固

## 下一步计划
1. 完善前端与后端的完整联调
2. 实现任务状态轮询和实时更新
3. 添加任务历史记录功能
4. 优化错误处理和用户体验
5. 准备生产环境部署