# Short Video Factory - 短视频工厂 Code Wiki

> 版本：v1.2.2 | 最后更新：2026-05-28

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈与依赖](#2-技术栈与依赖)
3. [项目架构](#3-项目架构)
4. [目录结构](#4-目录结构)
5. [核心模块详解](#5-核心模块详解)
6. [关键类与函数说明](#6-关键类与函数说明)
7. [数据流与通信机制](#7-数据流与通信机制)
8. [依赖关系图](#8-依赖关系图)
9. [构建与运行](#9-构建与运行)
10. [国际化支持](#10-国际化支持)
11. [CI/CD 流程](#11-cicd-流程)
12. [开发规范](#12-开发规范)

---

## 1. 项目概述

**短视频工厂** 是一个基于 Electron 的跨平台桌面应用，通过 AI 技术简化短视频制作流程。用户可以通过提示词文本和视频分镜素材，快速自动生成高质量的产品营销和泛内容短视频。

### 核心功能

| 功能 | 描述 |
|------|------|
| 🤖 AI文案生成 | 基于提示词生成高质量短视频文案，兼容 OpenAI 接口格式 |
| 🎙️ TTS语音合成 | 使用 EdgeTTS 将文案转换为自然流畅的语音 |
| 🎥 视频混剪 | 自动从素材库随机选取分镜片段进行混剪 |
| 🎬 字幕生成 | 基于 TTS 时间戳自动生成 SRT 字幕 |
| 🎵 背景音乐 | 支持添加背景音乐，自动音量均衡 |
| 📦 批量处理 | 支持自动批量合成多个视频 |
| 🌐 多语言 | 支持中文、英文界面切换 |

### 项目信息

- **作者**：YILS
- **许可证**：AGPL-3.0
- **仓库**：https://github.com/YILS-LIN/short-video-factory
- **官网**：https://short-video-factory.yils.blog

---

## 2. 技术栈与依赖

### 核心框架

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 桌面框架 | Electron | ^22.3.27 | 跨平台桌面应用 |
| 前端框架 | Vue 3 | ^3.5.17 | UI 渲染 |
| 构建工具 | Vite | ^7.0.3 | 开发服务器与构建 |
| 类型系统 | TypeScript | 5.6.2 | 类型安全 |
| 包管理器 | pnpm | >=10.12.4 | 依赖管理 |
| Node.js | Node.js | >=22.17.0 | 运行时 |

### UI 相关

| 库 | 用途 |
|------|------|
| Vuetify 3 | Material Design UI 组件库 |
| UnoCSS | 原子化 CSS 引擎 |
| @mdi/font | Material Design Icons |
| vue-toastification | Toast 通知组件 |

### 状态管理与路由

| 库 | 用途 |
|------|------|
| Pinia | Vue 状态管理 |
| pinia-plugin-persistedstate | 状态持久化 |
| Vue Router 4 | 路由管理 |

### 核心功能库

| 库 | 用途 |
|------|------|
| @ai-sdk/openai | Vercel AI SDK - OpenAI 兼容接口 |
| ai | Vercel AI SDK - 文本生成 |
| ffmpeg-static | FFmpeg 视频处理 |
| better-sqlite3 | SQLite 数据库 |
| edge-tts (自实现) | Edge TTS 语音合成 |
| music-metadata | 音频元数据解析 |
| subtitle | SRT 字幕生成 |

### 工具库

| 库 | 用途 |
|------|------|
| axios | HTTP 请求 |
| ws | WebSocket 客户端 |
| i18next | 国际化框架 |
| random | 随机数生成 |
| mitt | 事件总线 |

---

## 3. 项目架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Electron 应用                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    渲染进程 (Renderer)                        │   │
│  │                                                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │   │
│  │  │   Vue 3  │ │ Vuetify  │ │  Pinia   │ │  Router  │      │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │   │
│  │                                                             │   │
│  │  ┌──────────────────────────────────────────────────────┐  │   │
│  │  │                    业务组件层                          │  │   │
│  │  │  TextGenerate │ VideoManage │ TtsControl │ VideoRender│  │   │
│  │  └──────────────────────────────────────────────────────┘  │   │
│  │                                                             │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
│                              │ IPC (contextBridge)                  │
│  ┌──────────────────────────┴──────────────────────────────────┐   │
│  │                    主进程 (Main)                              │   │
│  │                                                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │   │
│  │  │   IPC    │ │  SQLite  │ │  FFmpeg  │ │  EdgeTTS │      │   │
│  │  │ Handler  │ │ Database │ │ Renderer │ │ Synthesizer│     │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │   │
│  │                                                             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐                   │   │
│  │  │   i18n   │ │  Stat    │ │  Tools   │                   │   │
│  │  │ Manager  │ │ Reporter │ │  Utils   │                   │   │
│  │  └──────────┘ └──────────┘ └──────────┘                   │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 进程通信架构

```
┌─────────────────┐         IPC Bridge         ┌─────────────────┐
│                 │    (contextBridge.expose)   │                 │
│   渲染进程       │ ◄─────────────────────────► │   主进程         │
│   (Vue App)     │                             │   (Electron)    │
│                 │    window.electron.*        │                 │
│                 │    window.sqlite.*          │                 │
│                 │    window.i18n.*            │                 │
└─────────────────┘                             └─────────────────┘
```

---

## 4. 目录结构

```
short-video-factory/
├── .github/
│   └── workflows/
│       └── build.yml              # CI/CD 构建配置
├── .vscode/                       # VSCode 配置
│   ├── extensions.json
│   ├── settings.json
│   ├── unocss.json
│   └── vue3.code-snippets
├── electron/                      # Electron 主进程代码
│   ├── ffmpeg/                    # FFmpeg 视频处理模块
│   │   ├── index.ts              # 视频渲染核心逻辑
│   │   └── types.ts              # 类型定义
│   ├── i18n/                     # 国际化配置
│   │   ├── common-options.ts     # i18n 通用配置
│   │   └── index.ts              # i18n 初始化
│   ├── lib/                      # 工具库
│   │   ├── cookie-allow-cross-site.ts  # 跨域 Cookie 处理
│   │   ├── edge-tts.ts           # EdgeTTS 实现
│   │   ├── is-dev.ts             # 开发环境判断
│   │   ├── request.ts            # HTTP 请求封装
│   │   ├── stat.ts               # 匿名统计上报
│   │   └── tools.ts              # 通用工具函数
│   ├── sqlite/                   # SQLite 数据库模块
│   │   ├── index.ts              # 数据库操作封装
│   │   └── types.ts              # 类型定义
│   ├── tts/                      # TTS 语音合成模块
│   │   ├── index.ts              # TTS 功能封装
│   │   └── types.ts              # 类型定义
│   ├── electron-env.d.ts         # Electron 类型声明
│   ├── ipc.ts                    # IPC 通信处理
│   ├── main.ts                   # 主进程入口
│   ├── preload.ts                # 预加载脚本
│   └── types.ts                  # 通用类型定义
├── images/                        # 项目截图
├── locales/                       # 国际化资源
│   ├── en/
│   │   └── common.json           # 英文翻译
│   └── zh-CN/
│       └── common.json           # 中文翻译
├── native/                        # 原生模块
│   └── better-sqlite3/           # SQLite 原生二进制
├── public/                        # 静态资源
│   └── icon.png                  # 应用图标
├── scripts/                       # 构建脚本
│   ├── before-pack.js            # 打包前脚本
│   ├── lipo-ffmpeg.js            # macOS FFmpeg 通用二进制
│   └── post-install.js           # 安装后脚本
├── src/                           # Vue 渲染进程代码
│   ├── assets/                   # 静态资源
│   │   └── base.scss             # 基础样式
│   ├── components/               # 公共组件
│   │   └── ActionToastEmbed.vue  # 错误提示组件
│   ├── layout/                   # 布局组件
│   │   └── default.vue           # 默认布局
│   ├── lib/                      # 工具库
│   │   ├── error-copy.ts         # 错误信息格式化
│   │   └── i18n.ts               # 前端 i18n 初始化
│   ├── router/                   # 路由配置
│   │   └── index.ts
│   ├── store/                    # 状态管理
│   │   ├── app.ts                # 应用状态
│   │   └── index.ts              # Store 入口
│   ├── views/                    # 页面组件
│   │   └── Home/
│   │       ├── index.vue         # 主页面
│   │       └── components/       # 业务组件
│   │           ├── TextGenerate.vue    # AI 文案生成
│   │           ├── VideoManage.vue     # 视频素材管理
│   │           ├── TtsControl.vue      # TTS 控制
│   │           ├── VideoRender.vue     # 视频渲染
│   │           └── VideoAutoPreview.vue # 视频预览
│   ├── App.vue                   # 根组件
│   └── main.ts                   # 前端入口
├── .gitignore
├── .npmrc
├── .nvmdrc                       # Node 版本配置
├── .prettierrc.json              # Prettier 配置
├── CHANGELOG.md                  # 更新日志
├── LICENSE                       # 许可证
├── README.md                     # 项目说明
├── electron-builder.json5        # Electron Builder 配置
├── index.html                    # HTML 入口
├── package.json                  # 项目配置
├── pnpm-lock.yaml                # 依赖锁定
├── stylelint.config.js           # Stylelint 配置
├── tsconfig.json                 # TypeScript 配置
├── tsconfig.node.json            # Node TypeScript 配置
├── uno.config.ts                 # UnoCSS 配置
└── vite.config.ts                # Vite 配置
```

---

## 5. 核心模块详解

### 5.1 Electron 主进程 (`electron/`)

#### 5.1.1 主进程入口 (`electron/main.ts`)

主进程负责：
- 创建和管理 BrowserWindow
- 初始化 SQLite 数据库
- 初始化国际化
- 注册 IPC 处理器
- 构建应用菜单
- 配置跨域策略

**关键代码流程**：
```typescript
app.whenReady().then(() => {
  initSqlite()      // 初始化数据库
  initI18n()        // 初始化国际化
  initIPC()         // 注册 IPC 处理器
  createWindow()    // 创建窗口
  buildMenu()       // 构建菜单
  useCookieAllowCrossSite()  // 配置跨域
})
```

#### 5.1.2 预加载脚本 (`electron/preload.ts`)

通过 `contextBridge` 暴露安全的 API 到渲染进程：

| API 对象 | 方法 | 用途 |
|----------|------|------|
| `window.electron` | `isWinMaxed`, `winMin`, `winMax`, `winClose` | 窗口控制 |
| | `openExternal` | 打开外部链接 |
| | `selectFolder` | 选择文件夹 |
| | `listFilesFromFolder` | 列出文件夹内容 |
| | `edgeTtsGetVoiceList` | 获取 TTS 语音列表 |
| | `edgeTtsSynthesizeToBase64` | TTS 合成为 Base64 |
| | `edgeTtsSynthesizeToFile` | TTS 合成为文件 |
| | `renderVideo` | 渲染视频 |
| | `statTrack` | 统计上报 |
| `window.sqlite` | `query`, `insert`, `update`, `delete`, `bulkInsertOrUpdate` | 数据库操作 |
| `window.i18n` | `getLocalesPath`, `getLanguage`, `changeLanguage` | 国际化 |

#### 5.1.3 IPC 处理器 (`electron/ipc.ts`)

注册所有 IPC 通信处理器，处理渲染进程的请求：

```typescript
export default function initIPC() {
  // SQLite 操作
  ipcMain.handle('sqlite-query', (_event, params) => sqQuery(params))
  ipcMain.handle('sqlite-insert', (_event, params) => sqInsert(params))
  // ... 其他数据库操作

  // 窗口控制
  ipcMain.handle('is-win-maxed', (event) => { ... })
  ipcMain.on('win-min', (event) => { ... })
  ipcMain.on('win-max', (event) => { ... })
  ipcMain.on('win-close', (event) => { ... })

  // 文件操作
  ipcMain.handle('select-folder', async (event, params) => { ... })
  ipcMain.handle('list-files-from-folder', async (_event, params) => { ... })

  // TTS 操作
  ipcMain.handle('edge-tts-get-voice-list', () => edgeTtsGetVoiceList())
  ipcMain.handle('edge-tts-synthesize-to-base64', (_event, params) => { ... })
  ipcMain.handle('edge-tts-synthesize-to-file', (_event, params) => { ... })

  // 视频渲染
  ipcMain.handle('render-video', (_event, params) => { ... })
}
```

### 5.2 FFmpeg 视频处理 (`electron/ffmpeg/`)

#### 核心功能

**`renderVideo()`** 函数负责视频合成，主要流程：

1. **视频输入处理**：添加所有视频文件作为输入
2. **音频输入处理**：添加语音和背景音乐
3. **构建滤镜链**：
   - 视频裁剪 (trim)
   - 缩放 (scale)
   - 填充 (pad)
   - 帧率转换 (fps)
   - 视频拼接 (concat)
   - 字幕叠加 (subtitles)
   - 音频响度归一化 (loudnorm)
   - 音频混合 (amix)
4. **编码输出**：H.264 + AAC

**关键参数**：
```typescript
interface RenderVideoParams {
  videoFiles: string[]           // 视频文件路径
  timeRanges: [string, string][] // 每个视频的时间范围
  audioFiles?: { voice?: string; bgm?: string }  // 音频文件
  subtitleFile?: string          // 字幕文件路径
  outputSize: { width: number; height: number }   // 输出尺寸
  outputPath: string             // 输出路径
  outputDuration?: string        // 输出时长
}
```

**FFmpeg 滤镜链示例**：
```
[0:v]trim=start=0:end=5,setpts=PTS-STARTPTS,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p,setsar=1[v0]
[v0][v1]concat=n=2:v=1:a=0[vconcat]
[vconcat]fps=30,format=yuv420p,setpts=PTS-STARTPTS[vout]
[vout]subtitles=subtitle.srt[with_subs]
[1:a]loudnorm=I=-16:TP=-1.5:LRA=11[voice_normalized]
[voice_normalized][bgm_normalized]amix=inputs=2:duration=first:dropout_transition=0[final_audio]
```

### 5.3 EdgeTTS 语音合成 (`electron/lib/edge-tts.ts`)

#### EdgeTTS 类

自实现的 EdgeTTS 客户端，通过 WebSocket 连接 Microsoft Edge 的 TTS 服务。

**主要方法**：

| 方法 | 用途 |
|------|------|
| `getVoices()` | 获取所有可用语音列表 |
| `synthesize(text, voice, options)` | 合成语音，返回 SynthesisResult |

**SynthesisResult 接口**：
```typescript
interface SynthesisResult {
  toBase64(): string           // 转换为 Base64
  toFile(outputPath: string): Promise<void>  // 保存到文件
  getBuffer(): Buffer          // 获取音频 Buffer
  getFormat(): string          // 获取音频格式
  getMetadata(): AudioMetadata // 获取音频元数据
  getSize(): number            // 获取音频大小
  getCaptionSrtString(): string // 获取 SRT 字幕
}
```

**DRM 保护**：
- 实现了 `Sec-MS-GEC` Token 生成
- 支持时钟偏移调整

**文本分片**：
- 长文本自动分片（每片最大 4096 字节）
- 支持 Unicode 安全分割

### 5.4 SQLite 数据库 (`electron/sqlite/`)

#### Database 类

封装了 `better-sqlite3` 的操作：

```typescript
class Database {
  query(param: QueryParams): Promise<any[]>      // 查询
  insert(param: InsertParams): Promise<number>    // 插入，返回 lastInsertRowid
  update(param: UpdateParams): Promise<number>    // 更新，返回 changes
  delete(param: DeleteParams): Promise<void>      // 删除
  bulkInsertOrUpdate(param: BulkInsertOrUpdateParams): Promise<void>  // 批量插入或更新
}
```

**数据库位置**：`app.getPath('userData')/data.db`

**类型定义**：
```typescript
interface QueryParams { sql: string; params?: any[] }
interface InsertParams { table: string; data: { [key: string]: any } }
interface UpdateParams { table: string; data: { [key: string]: any }; condition: string }
interface DeleteParams { table: string; condition: string }
interface BulkInsertOrUpdateParams { table: string; data: any[] }
```

### 5.5 国际化 (`electron/i18n/`)

使用 `i18next` 实现国际化：

**支持语言**：
- English (en)
- 简体中文 (zh-CN)

**配置**：
```typescript
const i18nCommonOptions: InitOptions = {
  fallbackLng: 'en',
  supportedLngs: ['en', 'zh-CN'],
  load: 'currentOnly',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
}
```

---

## 6. 关键类与函数说明

### 6.1 前端组件

#### TextGenerate 组件

**职责**：AI 文案生成

**关键方法**：
```typescript
// 生成文案
handleGenerate(options?: { noToast?: boolean }): Promise<string>

// 停止生成
handleStopGenerate(): void

// 获取当前输出文案
getCurrentOutputText(): string

// 清空输出文案
clearOutputText(): void
```

**AI SDK 使用**：
```typescript
const openai = createOpenAI({
  baseURL: appStore.llmConfig.apiUrl,
  apiKey: appStore.llmConfig.apiKey,
})

const result = streamText({
  model: openai.chat(appStore.llmConfig.modelName),
  prompt: appStore.prompt,
  abortSignal: abortController.value.signal,
})
```

#### VideoManage 组件

**职责**：视频素材管理与分镜选取

**关键方法**：
```typescript
// 获取视频分镜片段
getVideoSegments(options: { duration: number }): Promise<{
  videoFiles: string[]
  timeRanges: [string, string][]
}>
```

**分镜选取算法**：
1. 从素材库随机选择视频
2. 读取视频时长（带缓存）
3. 随机生成片段时长（2-15秒）
4. 随机选取片段起始位置
5. 累积直到满足目标时长

#### TtsControl 组件

**职责**：TTS 语音合成控制

**关键方法**：
```typescript
// 合成语音到文件
synthesizedSpeechToFile(option: {
  text: string
  withCaption?: boolean
}): Promise<{ duration: number }>
```

#### VideoRender 组件

**职责**：视频渲染与合成控制

**状态管理**：
```typescript
enum RenderStatus {
  None,              // 空闲
  GenerateText,      // 生成文案中
  SynthesizedSpeech, // 合成语音中
  SegmentVideo,      // 处理分镜中
  Rendering,         // 渲染视频中
  Completed,         // 完成
  Failed             // 失败
}
```

### 6.2 状态管理

#### useAppStore

**职责**：全局应用状态管理

**状态字段**：
```typescript
{
  // 国际化
  locale: string

  // AI 文案配置
  prompt: string
  llmConfig: { modelName: string; apiUrl: string; apiKey: string }

  // 视频素材
  videoAssetsFolder: string
  videoExportFolder: string

  // TTS 配置
  originalVoicesList: EdgeTTSVoice[]
  language: string
  gender: string
  voice: EdgeTTSVoice | null
  speed: number
  tryListeningText: string

  // 渲染配置
  renderConfig: {
    bgmPath: string
    outputSize: { width: number; height: number }
    outputPath: string
    outputFileName: string
    outputFileExt: string
  }
  autoBatch: boolean
  renderStatus: RenderStatus
}
```

**持久化**：使用 `pinia-plugin-persistedstate` 自动持久化到 localStorage

### 6.3 工具函数

#### `generateUniqueFileName(filePath: string): string`

生成有序的唯一文件名，处理文件已存在的情况。

#### `getAppTempPath(): string`

获取软件的临时文件存储路径。

#### `formatErrorForCopy(message: string, detail: string): string`

格式化错误信息为 JSON 格式，便于复制。

---

## 7. 数据流与通信机制

### 7.1 视频合成流程

```
┌──────────────────────────────────────────────────────────────────────┐
│                        视频合成完整流程                                │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  1. 生成文案  │ ──► │ 2. 合成语音  │ ──► │ 3. 处理分镜  │ ──► │ 4. 渲染视频  │
│   (TextGenerate)  │   (TtsControl)   │   (VideoManage)  │   (VideoRender)  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  AI SDK 流式生成     EdgeTTS WebSocket    随机选取素材片段    FFmpeg 滤镜合成
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
  outputText          MP3 + SRT 文件      videoFiles[]       MP4 输出文件
                      + duration           timeRanges[]
```

### 7.2 IPC 通信流程

```
渲染进程                              主进程
    │                                    │
    │  window.electron.renderVideo()     │
    │ ──────────────────────────────────►│
    │                                    │
    │                                    │  renderVideo(params)
    │                                    │  ├── 构建 FFmpeg 参数
    │                                    │  ├── 执行 FFmpeg 子进程
    │                                    │  └── 监听进度输出
    │                                    │
    │  render-video-progress (事件)       │
    │ ◄──────────────────────────────────│
    │                                    │
    │  返回 ExecuteFFmpegResult           │
    │ ◄──────────────────────────────────│
    │                                    │
```

### 7.3 TTS 合成流程

```
渲染进程                              主进程
    │                                    │
    │  window.electron.edgeTtsSynthesizeToFile()
    │ ──────────────────────────────────►│
    │                                    │
    │                                    │  edgeTtsSynthesizeToFile()
    │                                    │  ├── EdgeTTS.synthesize()
    │                                    │  │   ├── WebSocket 连接
    │                                    │  │   ├── 发送 SSML
    │                                    │  │   ├── 接收音频数据
    │                                    │  │   └── 生成字幕
    │                                    │  ├── 保存 MP3 文件
    │                                    │  ├── 保存 SRT 文件
    │                                    │  └── 解析音频时长
    │                                    │
    │  返回 { duration }                  │
    │ ◄──────────────────────────────────│
    │                                    │
```

---

## 8. 依赖关系图

### 8.1 模块依赖

```
┌─────────────────────────────────────────────────────────────────┐
│                         src/ (渲染进程)                          │
│                                                                 │
│  main.ts ──► App.vue ──► Router ──► Layout ──► Home/index.vue  │
│                                                        │        │
│              ┌─────────────┬─────────────┬─────────────┤        │
│              ▼             ▼             ▼             ▼        │
│         TextGenerate  VideoManage   TtsControl   VideoRender   │
│              │             │             │             │        │
│              └─────────────┴─────────────┴─────────────┘        │
│                                    │                            │
│                              window.electron.*                  │
│                              window.sqlite.*                    │
│                              window.i18n.*                      │
└─────────────────────────────────────────────────────────────────┘
                                    │
                              IPC Bridge
                                    │
┌─────────────────────────────────────────────────────────────────┐
│                         electron/ (主进程)                        │
│                                                                 │
│  main.ts ──► ipc.ts ──┬──► sqlite/index.ts                     │
│                        ├──► tts/index.ts ──► lib/edge-tts.ts   │
│                        ├──► ffmpeg/index.ts                     │
│                        └──► i18n/index.ts                       │
│                                                                 │
│  lib/                                                           │
│  ├── tools.ts                                                   │
│  ├── stat.ts                                                    │
│  ├── request.ts                                                 │
│  └── cookie-allow-cross-site.ts                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.2 外部依赖关系

```
项目
├── @ai-sdk/openai ──► OpenAI 兼容 API
├── ffmpeg-static ──► FFmpeg 二进制
├── better-sqlite3 ──► SQLite 原生模块
├── edge-tts (自实现) ──► Microsoft Edge TTS
│   ├── ws ──► WebSocket
│   ├── axios ──► HTTP
│   └── subtitle ──► SRT 生成
├── music-metadata ──► 音频元数据解析
└── i18next ──► 国际化
    ├── i18next-fs-backend (主进程)
    └── i18next-http-backend (渲染进程)
```

---

## 9. 构建与运行

### 9.1 环境要求

- **Node.js**: >=22.17.0
- **pnpm**: >=10.12.4
- **操作系统**: Windows / macOS / Linux

### 9.2 安装依赖

```bash
# 安装 pnpm (如果未安装)
npm install -g pnpm@10.12.4

# 安装项目依赖
pnpm install
```

### 9.3 开发模式

```bash
pnpm run dev
```

启动 Vite 开发服务器和 Electron 窗口。

### 9.4 构建打包

```bash
pnpm run build
```

构建流程：
1. `vue-tsc` - TypeScript 类型检查
2. `vite build` - 构建前端资源
3. `electron-builder` - 打包 Electron 应用

### 9.5 构建产物

| 平台 | 产物格式 | 位置 |
|------|----------|------|
| Windows | `.exe` (NSIS) | `release/{version}/` |
| macOS | `.dmg` (Universal) | `release/{version}/` |
| Linux | `.AppImage` | `release/{version}/` |

### 9.6 其他命令

```bash
pnpm run preview    # 预览构建产物
pnpm run format     # 代码格式化
```

### 9.7 macOS FFmpeg 通用二进制

```bash
pnpm run lipo-ffmpeg
```

将 x64 和 arm64 架构的 FFmpeg 合并为 Universal 二进制。

---

## 10. 国际化支持

### 10.1 翻译文件结构

```
locales/
├── en/
│   └── common.json
└── zh-CN/
    └── common.json
```

### 10.2 翻译键结构

```json
{
  "app": { "name": "..." },
  "menu": { ... },
  "common": { "buttons": { ... }, "states": { ... }, "messages": { ... } },
  "emptyStates": { ... },
  "dialogs": { ... },
  "footer": { ... },
  "features": {
    "llm": { "config": { ... }, "errors": { ... }, "success": { ... } },
    "tts": { "config": { ... }, "errors": { ... }, "info": { ... } },
    "assets": { "config": { ... }, "errors": { ... }, "success": { ... } },
    "render": { "config": { ... }, "status": { ... }, "errors": { ... }, "success": { ... }, "info": { ... } }
  }
}
```

### 10.3 使用方式

**渲染进程**：
```vue
<script setup>
import { useTranslation } from 'i18next-vue'
const { t } = useTranslation()
</script>

<template>
  <v-btn>{{ t('common.buttons.generate') }}</v-btn>
</template>
```

**主进程**：
```typescript
import i18next from 'i18next'
const label = i18next.t('menu.app.about')
```

---

## 11. CI/CD 流程

### 11.1 GitHub Actions 配置

**触发条件**：推送 `v*` 标签

**构建矩阵**：
- `macos-latest`
- `windows-latest`
- `ubuntu-latest`

**构建流程**：
```yaml
1. Checkout 代码
2. 安装 Node.js 22.17.0
3. 安装 pnpm 和依赖
4. 平台特定构建
   - macOS: lipo-ffmpeg + build (Universal)
   - Windows: build
   - Linux: 安装依赖 + build
5. 读取版本号和更新日志
6. 发布 GitHub Release
```

### 11.2 发布流程

1. 更新 `CHANGELOG.md`
2. 更新 `package.json` 版本号
3. 提交代码
4. 创建标签：`git tag v1.x.x`
5. 推送标签：`git push origin v1.x.x`
6. GitHub Actions 自动构建并发布

---

## 12. 开发规范

### 12.1 代码风格

**Prettier 配置**：
```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

**TypeScript 配置**：
- 严格模式启用
- 禁止未使用的局部变量和参数
- 路径别名：`@/*` → `./src/*`

### 12.2 组件规范

- 使用 Vue 3 Composition API
- 使用 `<script lang="ts" setup>` 语法
- 使用 Vuetify 组件库
- 使用 UnoCSS 原子化样式

### 12.3 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `TextGenerate.vue` |
| 文件夹 | kebab-case | `video-manage/` |
| 函数 | camelCase | `handleGenerate` |
| 常量 | UPPER_SNAKE_CASE | `RENDER_STATUS` |
| 接口 | PascalCase | `RenderVideoParams` |

### 12.4 Git 提交规范

```
类型(范围): 描述

类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 样式
- refactor: 重构
- test: 测试
- chore: 构建/工具

示例：
feat(tts): 添加语音试听功能
fix(ffmpeg): 修复视频合成进度问题
```

---

## 附录

### A. 常见问题

**Q: FFmpeg 找不到？**
A: 确保 `ffmpeg-static` 正确安装，运行 `pnpm run postinstall`。

**Q: SQLite 模块加载失败？**
A: 检查 `native/better-sqlite3/` 目录下是否有对应平台的 `.node` 文件。

**Q: EdgeTTS 连接失败？**
A: 检查网络连接，EdgeTTS 需要访问 Microsoft 服务。

### B. 相关链接

- [官方文档](https://short-video-factory.yils.blog)
- [GitHub Issues](https://github.com/YILS-LIN/short-video-factory/issues)
- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)
- [Electron 文档](https://www.electronjs.org/docs)
- [Vuetify 文档](https://vuetifyjs.com/)

---

*本文档由 AI 自动生成，基于项目源代码分析。如有疑问，请参考项目 README 或提交 Issue。*
