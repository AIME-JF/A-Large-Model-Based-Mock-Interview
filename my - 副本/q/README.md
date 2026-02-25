# 多模态智能模拟面试评测系统

## 项目概述

本项目是一个基于AI的多模态智能模拟面试评测系统，旨在帮助大学生进行真实面试模拟，通过语音、视频、文本的智能分析，生成结构化反馈报告和学习建议，从而提升他们的面试能力与成功率。

## 核心功能

### ✅ 已实现功能

1. **星火API智能分析**
   - 集成讯飞星火大模型进行面试内容分析
   - 支持5个维度的能力评估
   - 自动生成个性化反馈报告

2. **多模态分析框架**
   - 视频分析：面部表情、眼神交流、自信程度、姿态分析
   - 语音分析：语速、语调、流畅度、音量稳定性
   - 文本分析：相关性、结构化程度、完整性、关键词密度

3. **静态数据分析**
   - 丰富的预设分析结果模板
   - 支持快速测试和演示
   - 智能化的结果生成算法

4. **多领域多岗位支持**
   - 人工智能：算法工程师、数据科学家、AI产品经理
   - 大数据：大数据工程师、数据分析师、数据架构师
   - 物联网：嵌入式工程师、IoT架构师、硬件工程师

### 🚧 待完善功能

1. **实时视频分析**
   - 需要集成摄像头实时分析
   - 面部表情识别优化
   - 微表情分析

2. **实时音频分析**
   - 语音识别集成
   - 实时语调分析
   - 情感识别

3. **AI面试官对话系统**
   - 智能问题生成
   - 动态难度调整
   - 多轮对话管理

## 技术架构

### 后端技术栈
- **FastAPI**: 高性能Web框架
- **星火API**: 讯飞大模型服务
- **OpenCV**: 视频分析
- **Librosa**: 音频分析
- **NumPy/SciPy**: 数据处理

### 前端技术栈
- **Vue.js**: 前端框架
- **Ant Design Vue**: UI组件库
- **ECharts**: 数据可视化
- **WebRTC**: 音视频采集

## 安装部署

### 环境要求
- Python 3.8+
- Node.js 16+
- 摄像头和麦克风设备

### 后端部署

1. **安装依赖**
```bash
cd q
pip install -r requirements.txt
```

2. **配置星火API**
编辑 `spark_analyzer.py` 文件，填入您的星火API配置：
```python
self.appid = "your_app_id"
self.api_secret = "your_api_secret"
self.api_key = "your_api_key"
```

3. **启动服务**
```bash
python main.py
```

服务将在 `http://localhost:8000` 启动

### 前端部署

1. **安装依赖**
```bash
cd realtime-quickstart-vue
npm install
```

2. **启动开发服务器**
```bash
npm run serve
```

## API接口文档

### 核心接口

#### 1. 获取可用领域
```
GET /domains
```

#### 2. 获取岗位列表
```
GET /roles/{domain}
```

#### 3. 获取面试问题
```
GET /questions/{domain}/{role}
```

#### 4. 分析面试记录
```
POST /analyze-interview
{
  "chatHistory": ["回答1", "回答2"],
  "domain": "人工智能",
  "role": "算法工程师",
  "useStaticData": false,
  "includeMultimodal": false
}
```

#### 5. 多模态分析
```
POST /analyze-multimodal
{
  "textContent": "面试回答内容",
  "domain": "人工智能",
  "role": "算法工程师",
  "videoData": "base64编码视频数据",
  "audioData": "base64编码音频数据"
}
```

## 使用说明

### 1. 基础分析
- 选择面试领域和岗位
- 输入或上传面试对话记录
- 系统自动分析并生成报告

### 2. 多模态分析
- 开启摄像头和麦克风
- 进行实时面试模拟
- 系统同时分析视频、音频、文本

### 3. 静态数据测试
- 设置 `useStaticData: true`
- 快速获得预设的分析结果
- 适合演示和测试

## 项目结构

```
q/
├── main.py                 # FastAPI主应用
├── spark_analyzer.py       # 星火API分析器
├── multimodal_analyzer.py  # 多模态分析器
├── static_analysis_data.py # 静态数据管理
├── requirements.txt        # Python依赖
└── README.md              # 项目说明

realtime-quickstart-vue/
├── src/
│   ├── components/        # Vue组件
│   ├── utils/            # 工具函数
│   └── main.ts           # 应用入口
├── package.json          # Node.js依赖
└── README.md            # 前端说明
```

## 开源工具列表

| 工具名称 | 用途 | 许可证 | 来源 |
|---------|------|--------|------|
| FastAPI | Web框架 | MIT | https://fastapi.tiangolo.com/ |
| OpenCV | 计算机视觉 | Apache 2.0 | https://opencv.org/ |
| Librosa | 音频分析 | ISC | https://librosa.org/ |
| Vue.js | 前端框架 | MIT | https://vuejs.org/ |
| Ant Design Vue | UI组件库 | MIT | https://antdv.com/ |
| ECharts | 数据可视化 | Apache 2.0 | https://echarts.apache.org/ |

## 开发计划

### 第一阶段（已完成）
- [x] 基础API框架搭建
- [x] 星火API集成
- [x] 静态数据分析
- [x] 多模态分析框架

### 第二阶段（进行中）
- [ ] 实时视频分析优化
- [ ] 实时音频分析集成
- [ ] AI面试官对话系统
- [ ] 前端界面完善

### 第三阶段（计划中）
- [ ] 性能优化
- [ ] 用户体验改进
- [ ] 更多领域支持
- [ ] 移动端适配

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

## 更新日志

### v1.0.0 (2024-01-XX)
- 初始版本发布
- 基础分析功能
- 多模态分析框架
- 静态数据支持 