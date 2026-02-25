# 语音交互系统部署说明

## 系统架构

本系统包含四个主要服务：
- **RTC服务器** (端口3001) - 火山引擎RTC服务代理
- **RTC前端** (端口3002) - 火山引擎RTC演示应用
- **后端API** (端口8000) - Python FastAPI分析服务
- **面试应用** (端口3000) - Vue.js实时面试应用

## 启动步骤

### 1. 启动RTC服务器
```bash
cd rtc-aigc-demo-main/Server
yarn dev
```

### 2. 启动RTC前端
```bash
cd rtc-aigc-demo-main
yarn dev
```

### 3. 启动后端API服务
```bash
cd my - 副本/q
python -m uvicorn main:app --reload --port 8000
```

### 4. 启动面试应用
```bash
cd my - 副本/realtime-quickstart-vue
yarn start
```

## 访问地址

- **RTC服务器**: http://localhost:3001
- **RTC前端**: http://localhost:3002
- **后端API**: http://localhost:8000
- **面试应用**: http://localhost:3000

## 功能说明

- **RTC演示**: 火山引擎RTC功能演示和测试
- **实时语音面试**: 支持AI语音对话和实时字幕
- **面试分析**: 自动生成能力评估报告和雷达图
- **RTC通话**: 基于火山引擎的实时音视频通信

## 注意事项

1. 确保所有端口未被占用
2. 需要安装Node.js、Python和yarn
3. 首次运行需要安装依赖包
4. RTC功能需要有效的火山引擎配置 