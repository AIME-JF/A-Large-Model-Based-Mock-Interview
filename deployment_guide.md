# 语音交互系统部署指南

本指南提供语音交互系统的完整部署说明，包括依赖环境配置、数据准备和部署步骤。

## 1. 系统架构

本系统由以下四个核心服务组成：

- **RTC服务器** (Node.js/Koa) - 端口: 8080
- **RTC前端** (React/TypeScript) - 端口: 3000  
- **后端API服务** (Python/FastAPI) - 端口: 8000
- **面试应用** (Vue.js/TypeScript) - 端口: 5173

## 2. 依赖环境

### 2.1 操作系统要求

- **推荐**: Windows 10/11 (64位)
- **支持**: macOS, Linux (部分功能可能需要调整)

### 2.2 编程语言与运行时

#### Python 环境
- **版本**: Python 3.8+ (推荐 3.9-3.11)
- **包管理器**: pip
- **虚拟环境**: 推荐使用 venv 或 conda

#### Node.js 环境
- **版本**: Node.js 16+ (推荐 LTS 版本)
- **包管理器**: Yarn (推荐) 或 npm
- **全局工具**: 
  ```bash
  npm install -g yarn
  npm install -g @vue/cli
  ```

### 2.3 系统依赖

#### Windows 系统
- **Visual Studio Build Tools** (用于编译原生模块)
- **Windows SDK** (音频处理相关)

#### 音频处理依赖
- **PyAudio**: 需要 PortAudio 库
- **OpenCV**: 图像处理库
- **LibROSA**: 音频分析库

### 2.4 端口要求

确保以下端口未被占用：
- `8080` - RTC服务器
- `3000` - RTC前端
- `8000` - 后端API服务
- `5173` - 面试应用

## 3. 核心依赖详情

### 3.1 Python 后端依赖 (requirements.txt)

```txt
# 核心Web框架
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0

# 星火API相关
websocket-client==1.6.4

# 多模态分析相关
opencv-python==4.8.1.78
librosa==0.10.1
numpy==1.24.3
scipy==1.11.4

# 数据处理
pandas==2.1.4

# 图像处理
Pillow==10.1.0

# 音频处理
soundfile==0.12.1
pyaudio==0.2.11

# 机器学习相关
scikit-learn==1.3.2

# 开发工具
python-multipart==0.0.6
aiofiles==23.2.1
```

### 3.2 Node.js 项目依赖

#### RTC前端 (React)
- `@volcengine/rtc`: 火山引擎RTC SDK
- `@arco-design/web-react`: UI组件库
- `react`: 前端框架
- `@reduxjs/toolkit`: 状态管理

#### RTC服务器 (Koa)
- `@volcengine/openapi`: 火山引擎API SDK
- `koa`: Web框架
- `koa-bodyparser`: 请求解析
- `koa2-cors`: 跨域处理

#### 面试应用 (Vue)
- `@coze/api`: Coze API SDK
- `@coze/realtime-api`: 实时API
- `@volcengine/rtc`: RTC SDK
- `ant-design-vue`: UI组件库
- `vue`: 前端框架

## 4. 数据配置

### 4.1 火山引擎配置

**重要**: RTC功能需要有效的火山引擎配置

创建配置文件 `config/rtc-config.json`:
```json
{
  "appId": "your_app_id",
  "appKey": "your_app_key",
  "secretKey": "your_secret_key",
  "region": "cn-north-1"
}
```

### 4.2 API密钥配置

在相应的配置文件中设置：
- **星火API**: 科大讯飞星火认知大模型API密钥
- **Coze API**: 字节跳动Coze平台API密钥

### 4.3 数据库配置

- **SQLite**: 默认使用，无需额外配置
- **其他数据库**: 根据需要修改连接配置

## 5. 部署步骤

### 5.1 环境准备

1. **克隆项目**
   ```bash
   git clone <repository_url>
   cd 语音交互
   ```

2. **Python环境设置**
   ```bash
   # 创建虚拟环境
   python -m venv venv
   
   # 激活虚拟环境
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   
   # 安装依赖
   cd "my - 副本/q"
   pip install -r requirements.txt
   ```

3. **Node.js依赖安装**
   ```bash
   # RTC服务器
   cd rtc-aigc-demo-main/Server
   yarn install
   
   # RTC前端
   cd ../
   yarn install
   
   # 面试应用
   cd "my - 副本/realtime-quickstart-vue"
   yarn install
   ```

### 5.2 配置文件设置

1. **火山引擎配置**
   - 在 `rtc-aigc-demo-main/src/config/` 目录下配置RTC参数
   - 设置AppID、AppKey等认证信息

2. **API密钥配置**
   - 配置星火API密钥
   - 配置Coze API密钥

### 5.3 一键启动 (推荐)

使用提供的启动脚本：
```bash
python start_all_services.py
```

脚本功能：
- 自动检测包管理器 (Yarn/NPM)
- 检查端口占用情况
- 按序启动所有服务
- 实时监控服务状态
- 支持优雅关闭 (Ctrl+C)

### 5.4 手动启动

如需单独启动服务：

#### 1. 启动RTC服务器
```bash
cd rtc-aigc-demo-main/Server
yarn start
# 访问: http://localhost:8080
```

#### 2. 启动RTC前端
```bash
cd rtc-aigc-demo-main
yarn dev
# 访问: http://localhost:3000
```

#### 3. 启动后端API服务
```bash
cd "my - 副本/q"
python main.py
# 访问: http://localhost:8000
```

#### 4. 启动面试应用
```bash
cd "my - 副本/realtime-quickstart-vue"
yarn start
# 访问: http://localhost:5173
```

## 6. 验证部署

### 6.1 服务状态检查

访问以下URL验证服务状态：
- RTC服务器: http://localhost:8080/health
- RTC前端: http://localhost:3000
- 后端API: http://localhost:8000/docs (FastAPI文档)
- 面试应用: http://localhost:5173

### 6.2 功能测试

1. **RTC连接测试**: 验证音视频通话功能
2. **API接口测试**: 测试后端API响应
3. **语音识别测试**: 验证语音转文字功能
4. **多模态分析测试**: 测试图像和音频分析功能

## 7. 常见问题

### 7.1 依赖安装问题

**PyAudio安装失败**:
```bash
# Windows
pip install pipwin
pipwin install pyaudio

# 或使用预编译包
pip install PyAudio-0.2.11-cp39-cp39-win_amd64.whl
```

**Node.js模块编译失败**:
```bash
# 清理缓存重新安装
yarn cache clean
rm -rf node_modules
yarn install
```

### 7.2 端口占用问题

```bash
# Windows查看端口占用
netstat -ano | findstr :8000

# 结束占用进程
taskkill /PID <进程ID> /F
```

### 7.3 权限问题

- 确保有音频设备访问权限
- 检查防火墙设置
- 验证摄像头权限 (如需要)

## 8. 性能优化

### 8.1 生产环境配置

- 使用 `yarn build` 构建生产版本
- 配置反向代理 (Nginx)
- 启用HTTPS
- 配置CDN加速

### 8.2 监控和日志

- 配置日志轮转
- 设置性能监控
- 配置错误报告

## 9. 安全注意事项

- 不要在代码中硬编码API密钥
- 使用环境变量管理敏感配置
- 定期更新依赖包版本
- 配置适当的CORS策略

## 10. 技术支持

如遇到部署问题，请检查：
1. 系统环境是否满足要求
2. 依赖是否正确安装
3. 配置文件是否正确设置
4. 端口是否被占用
5. 防火墙和权限设置

---

**注意**: 本系统依赖火山引擎RTC服务，请确保已获得相应的API访问权限和配额。