# 🎯 基于大模型的模拟面试平台

<p align="center">
  <b>A Large Model Based Mock Interview Platform</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vuedotjs" alt="Vue.js">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/Node.js-16+-339933?logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Python-3.8+-3776AB?logo=python" alt="Python">
</p>

---

## 📖 项目简介

本项目是一个**基于大语言模型的智能模拟面试平台**，旨在为求职者提供沉浸式的 AI 模拟面试体验。平台集成了**科大讯飞星火认知大模型**和**字节跳动 Coze 平台**，结合**火山引擎 RTC 实时音视频通信**技术，实现了语音对话、实时字幕、智能面试分析等核心功能。

用户可以选择不同的面试领域和岗位，与 AI 面试官进行实时语音对话，系统会自动记录面试过程并生成包含**能力雷达图**和**详细评估报告**的面试分析结果，帮助求职者发现自身不足，有针对性地提升面试能力。

---

## ✨ 核心功能

### 🎤 实时语音面试
- 基于**火山引擎 RTC SDK** 的高质量实时音视频通信
- 支持 AI 语音对话，模拟真实面试场景
- 实时语音转文字，同步显示对话字幕
- 全屏摄像头模式，沉浸式面试体验

### 🤖 AI 智能面试官
- 集成**扣子（Coze）平台**，打造专业 AI 面试官
- 支持多领域多岗位的面试问题生成
- 根据面试领域和岗位智能调整提问策略
- 模拟真实面试对话流程

### 📊 面试能力分析
- 接入**科大讯飞星火认知大模型** API，对面试记录进行深度分析
- 自动生成**多维度能力雷达图**（技术深度、沟通表达、逻辑思维、项目经验、学习能力等）
- 输出详细的面试评估报告和改进建议
- 支持多模态分析（文本 + 音频 + 视频）

### 🏠 完善的用户系统
- 用户登录注册（集成 Firebase Authentication）
- 面试记录历史查看与管理
- 个人设置与偏好配置
- 响应式设计，支持桌面端和移动端

---

## 🏗️ 系统架构

本系统采用**前后端分离 + 微服务**架构，由以下四个核心服务组成：

```
┌─────────────────────────────────────────────────────────────┐
│                     用户浏览器 (Browser)                      │
├────────────────────────┬────────────────────────────────────┤
│   面试应用 (Vue.js)     │     RTC 前端 (React)               │
│   Port: 5173           │     Port: 3000                     │
│   实时语音面试界面       │     RTC 功能演示                    │
├────────────────────────┴────────────────────────────────────┤
│                        API 请求                              │
├──────────────────────────┬──────────────────────────────────┤
│   后端 API (FastAPI)     │     RTC 服务器 (Node.js/Koa)      │
│   Port: 8000            │     Port: 8080                    │
│   面试分析 & 数据处理     │     RTC 信令 & Token 管理          │
├──────────────────────────┴──────────────────────────────────┤
│                      外部服务                                │
├─────────┬──────────┬───────────┬────────────────────────────┤
│ 星火大模型 │ Coze 平台 │ 火山引擎RTC │ Firebase                   │
└─────────┴──────────┴───────────┴────────────────────────────┘
```

| 服务 | 技术栈 | 端口 | 说明 |
|------|--------|------|------|
| **面试应用** | Vue 3 + TypeScript + Ant Design Vue | 5173 | 核心面试界面，包含语音面试、分析报告等 |
| **RTC 前端** | React 18 + TypeScript + Arco Design | 3000 | 火山引擎 RTC 演示应用 |
| **RTC 服务器** | Node.js + Koa | 8080 | RTC 信令服务与 Token 生成 |
| **后端 API** | Python + FastAPI | 8000 | 面试分析、问题生成、多模态处理 |

---

## 📁 项目结构

```
基于大模型的模拟面试平台的设计与实现/
├── my - 副本/
│   ├── realtime-quickstart-vue/          # 📱 面试应用 (Vue.js)
│   │   ├── src/
│   │   │   ├── components/               # 核心组件
│   │   │   │   ├── Home.vue              # 首页
│   │   │   │   ├── Login.vue             # 登录页
│   │   │   │   ├── RealtimeInterview.vue  # 实时面试核心组件
│   │   │   │   ├── VirtualInterviewer.vue # 虚拟面试官
│   │   │   │   ├── DomainSelector.vue    # 领域/岗位选择
│   │   │   │   ├── AbilityAnalysis.vue   # 能力分析报告
│   │   │   │   ├── RadarChart.vue        # 雷达图组件
│   │   │   │   ├── InterviewRecords.vue  # 面试记录
│   │   │   │   ├── Settings.vue          # 设置页面
│   │   │   │   ├── FullscreenCamera.vue  # 全屏摄像头
│   │   │   │   └── ...                   # 其他组件
│   │   │   ├── hooks/                    # 组合式函数
│   │   │   ├── utils/                    # 工具函数
│   │   │   └── App.vue                   # 应用入口
│   │   └── package.json
│   │
│   └── q/                                # 🐍 后端 API 服务 (Python)
│       ├── main.py                       # FastAPI 主入口
│       ├── spark_analyzer.py             # 星火大模型分析器
│       ├── multimodal_analyzer.py        # 多模态分析模块
│       ├── static_analysis_data.py       # 静态分析数据
│       ├── requirements.txt              # Python 依赖
│       └── ...
│
├── rtc-aigc-demo-main/                   # 🔊 RTC 音视频模块
│   ├── Server/                           # RTC 服务器 (Node.js/Koa)
│   ├── src/                              # RTC 前端 (React)
│   │   ├── pages/                        # 页面组件
│   │   ├── components/                   # 通用组件
│   │   └── store/                        # Redux 状态管理
│   └── package.json
│
├── deployment_guide.md                   # 📋 部署指南
├── readme.md                             # 📄 项目说明
└── .gitignore
```

---

## 🛠️ 技术栈

### 前端
| 技术 | 版本 | 用途 |
|------|------|------|
| Vue.js | 3.x | 面试应用前端框架 |
| React | 18.x | RTC 演示前端框架 |
| TypeScript | 5.x | 类型安全 |
| Ant Design Vue | 4.x | 面试应用 UI 组件库 |
| Arco Design React | 2.x | RTC 前端 UI 组件库 |
| Three.js | 0.178 | 3D 虚拟面试官渲染 |
| Firebase | 10.x | 用户认证与数据存储 |
| Coze Realtime API | latest | AI 实时语音对话 |
| 火山引擎 RTC SDK | 4.62+ | 实时音视频通信 |

### 后端
| 技术 | 版本 | 用途 |
|------|------|------|
| Python | 3.8+ | 后端开发语言 |
| FastAPI | 0.104 | Web API 框架 |
| 讯飞星火 API | X1 | 大模型面试分析 |
| OpenCV | 4.8 | 视频/图像处理 |
| LibROSA | 0.10 | 音频特征分析 |
| scikit-learn | 1.3 | 机器学习辅助分析 |
| Node.js | 16+ | RTC 服务器运行时 |
| Koa | 2.x | RTC 服务端框架 |

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 16.x（推荐 LTS 版本）
- **Python** >= 3.8（推荐 3.9 - 3.11）
- **Yarn** 包管理器
- **Git**

### 1. 克隆项目

```bash
git clone https://github.com/AIME-JF/A-Large-Model-Based-Mock-Interview.git
cd A-Large-Model-Based-Mock-Interview
```

### 2. 安装依赖

#### Python 后端依赖
```bash
cd "my - 副本/q"
pip install -r requirements.txt
```

#### Node.js 依赖
```bash
# RTC 服务器
cd rtc-aigc-demo-main/Server
yarn install

# RTC 前端
cd ../
yarn install

# 面试应用
cd "../my - 副本/realtime-quickstart-vue"
yarn install
```

### 3. 启动服务

请按照以下顺序启动四个服务（每个服务使用单独的终端窗口）：

```bash
# 终端 1：启动 RTC 服务器
cd rtc-aigc-demo-main/Server
yarn start
# ✅ 服务地址: http://localhost:8080

# 终端 2：启动 RTC 前端
cd rtc-aigc-demo-main
yarn dev
# ✅ 服务地址: http://localhost:3000

# 终端 3：启动后端 API 服务
cd "my - 副本/q"
python main.py
# ✅ 服务地址: http://localhost:8000
# ✅ API 文档: http://localhost:8000/docs

# 终端 4：启动面试应用
cd "my - 副本/realtime-quickstart-vue"
yarn start
# ✅ 服务地址: http://localhost:5173
```

### 4. 验证服务

所有服务启动后，访问以下地址验证：

| 服务 | 地址 | 状态 |
|------|------|------|
| RTC 服务器 | http://localhost:8080 | 查看健康状态 |
| RTC 前端 | http://localhost:3000 | 查看 RTC 演示页面 |
| 后端 API | http://localhost:8000/docs | 查看 API 文档 |
| **面试应用（主入口）** | **http://localhost:5173** | **开始模拟面试** |

---

## 📡 API 接口

后端 API 基于 FastAPI 构建，提供以下核心接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/` | 服务状态与可用接口列表 |
| `GET` | `/api/domains` | 获取可用的面试领域列表 |
| `GET` | `/api/domains/{domain}/roles` | 获取指定领域下的岗位列表 |
| `GET` | `/api/questions/{domain}/{role}` | 获取面试问题 |
| `POST` | `/api/analyze` | 分析面试记录（支持星火 API / 静态数据模式） |
| `POST` | `/api/analyze/multimodal` | 多模态面试分析（文本 + 音频 + 视频） |
| `GET` | `/health` | 健康检查 |

> 💡 启动后端服务后，访问 http://localhost:8000/docs 可查看完整的交互式 API 文档。

---

## 🎮 使用流程

1. **登录系统** — 通过首页进入登录页面，完成用户认证
2. **选择面试类型** — 选择面试领域（如前端开发、Java 后端等）和目标岗位
3. **开始面试** — 与 AI 面试官进行实时语音对话
4. **查看分析** — 面试结束后，系统自动生成能力雷达图和评估报告
5. **查看记录** — 在面试记录页面回顾历史面试和分析结果

---

## ⚠️ 注意事项

1. **API 密钥配置**：使用前需配置科大讯飞星火 API 和字节跳动 Coze 平台的 API 密钥
2. **火山引擎 RTC**：RTC 功能需要有效的火山引擎 AppID 和密钥
3. **Firebase**：用户认证功能依赖 Firebase 配置
4. **端口占用**：确保 5173、3000、8080、8000 端口未被占用
5. **浏览器权限**：面试功能需要授权麦克风和摄像头访问权限
6. **网络环境**：语音识别和大模型分析需要网络连接

---

## 📄 License

BSD-3-Clause License