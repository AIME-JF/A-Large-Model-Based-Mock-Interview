<template>
  <div class="test-analysis-container">
    <div class="main-content">
      <a-card class="content-card">
        <!-- 标题区域 -->
        <div class="title-section">
          <h1 class="main-title">测试分析功能</h1>
        </div>

        <!-- 模拟聊天记录 -->
        <a-card class="section-card">
          <h2 class="section-title">
            <MessageOutlined style="margin-right: 8px" />
            模拟聊天记录
          </h2>
          <div class="chat-history">
            <div v-for="(message, index) in testChatHistory" :key="index" class="message-item">
              <span class="message-number">{{ index + 1 }}:</span>
              <span class="message-text">{{ message }}</span>
            </div>
          </div>
        </a-card>

        <!-- 参数设置 -->
        <a-card class="section-card">
          <a-form layout="vertical">
            <div class="form-row">
              <a-form-item label="选择领域" class="form-group">
                <a-select v-model:value="selectedDomain">
                  <a-select-option value="人工智能">人工智能</a-select-option>
                  <a-select-option value="大数据">大数据</a-select-option>
                  <a-select-option value="物联网">物联网</a-select-option>
                </a-select>
              </a-form-item>

              <a-form-item label="选择岗位" class="form-group">
                <a-input v-model:value="selectedRole" placeholder="输入岗位名称" />
              </a-form-item>
            </div>
          </a-form>
        </a-card>

        <!-- 测试按钮 -->
        <div class="test-buttons-section">
          <a-button
            type="primary"
            size="large"
            @click="testSparkAnalysis"
            :disabled="isAnalyzing"
            :loading="isAnalyzing"
          >
            <template #icon><ThunderboltOutlined /></template>
            {{ isAnalyzing ? '分析中...' : '测试星火API分析' }}
          </a-button>

          <a-button
            type="primary"
            size="large"
            style="background: #52c41a; border-color: #52c41a"
            @click="testMockAnalysis"
            :disabled="isAnalyzing"
            :loading="isAnalyzing"
          >
            <template #icon><FileTextOutlined /></template>
            {{ isAnalyzing ? '分析中...' : '测试静态数据分析' }}
          </a-button>
        </div>

        <!-- 分析结果 -->
        <div v-if="analysisResult" class="results-section">
          <h3 class="results-title">分析结果</h3>

          <!-- 雷达图分数 -->
          <a-card class="result-card">
            <h4 class="result-subtitle">
              <RadarChartOutlined style="margin-right: 8px" />
              雷达图分数
            </h4>

            <!-- 可视化雷达图 -->
            <div class="radar-chart-section">
              <RadarChart
                :scores="analysisResult.radarChartScores"
                :labels="radarLabels"
                :size="320"
              />
            </div>

            <!-- 分数详情 -->
            <div class="scores-details">
              <div class="scores-grid">
                <div v-for="(score, index) in analysisResult.radarChartScores" :key="index" class="score-item">
                  <span class="score-label">{{ radarLabels[index] }}:</span>
                  <span class="score-value">{{ score }}</span>
                </div>
              </div>
            </div>
          </a-card>

          <!-- 关键问题定位 -->
          <a-card class="result-card issues-card">
            <h4 class="result-subtitle">
              <WarningOutlined style="margin-right: 8px; color: #ff4d4f" />
              关键问题定位
            </h4>
            <ul class="issues-list">
              <li v-for="(issue, index) in analysisResult.feedbackData.keyIssues" :key="index" class="issue-item">
                {{ issue }}
              </li>
            </ul>
          </a-card>

          <!-- 改进建议 -->
          <a-card class="result-card suggestions-card">
            <h4 class="result-subtitle">
              <BulbOutlined style="margin-right: 8px; color: #52c41a" />
              改进建议
            </h4>
            <ul class="suggestions-list">
              <li v-for="(suggestion, index) in analysisResult.feedbackData.improvementSuggestions" :key="index" class="suggestion-item">
                {{ suggestion }}
              </li>
            </ul>
          </a-card>

          <!-- 学习推荐 -->
          <a-card v-if="Object.keys(analysisResult.learningRecommendations).length > 0" class="result-card recommendations-card">
            <h4 class="result-subtitle">
              <BookOutlined style="margin-right: 8px; color: #1677ff" />
              学习推荐
            </h4>
            <div v-for="(items, category) in analysisResult.learningRecommendations" :key="category" class="recommendation-category">
              <h5 class="category-title">{{ category }}</h5>
              <ul class="recommendations-list">
                <li v-for="(item, index) in items" :key="index" class="recommendation-item">
                  <a :href="item.link" target="_blank" class="recommendation-link">
                    <LinkOutlined style="margin-right: 4px" />
                    {{ item.title }}
                  </a>
                </li>
              </ul>
            </div>
          </a-card>
        </div>

        <!-- 返回按钮 -->
        <div class="back-section">
          <a-button @click="$emit('go-back')">
            <template #icon><ArrowLeftOutlined /></template>
            返回
          </a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import {
  MessageOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  ArrowLeftOutlined,
  WarningOutlined,
  BulbOutlined,
  BookOutlined,
  LinkOutlined,
  RadarChartOutlined
} from '@ant-design/icons-vue';
import { analyzeInterview, mockAnalyzeInterview } from '../utils/apiService.js';
import RadarChart from './RadarChart.vue';

const emits = defineEmits(['go-back']);

const testChatHistory = ref([
  "我有三年的机器学习开发经验，主要专注于深度学习模型的训练和优化。",
  "在之前的项目中，我使用了TensorFlow和PyTorch来构建神经网络模型。",
  "我熟悉卷积神经网络和循环神经网络的原理和应用。",
  "在数据预处理方面，我有丰富的经验，包括数据清洗、特征工程和数据增强。",
  "我曾经参与过一个计算机视觉项目，使用CNN进行图像分类，准确率达到了95%。"
]);

const selectedDomain = ref('人工智能');
const selectedRole = ref('算法工程师');
const isAnalyzing = ref(false);
const analysisResult = ref(null);

const radarLabels = ['专业知识', '岗位技能', '语言表达', '逻辑思维', '抗压应变'];

const testSparkAnalysis = async () => {
  try {
    isAnalyzing.value = true;

    const params = {
      chatHistory: testChatHistory.value,
      domain: selectedDomain.value,
      role: selectedRole.value,
      useStaticData: false,  // 使用星火API
      includeMultimodal: false
    };

    const result = await analyzeInterview(params);
    analysisResult.value = result;

  } catch (error) {
    alert('星火API测试失败: ' + error.message);
  } finally {
    isAnalyzing.value = false;
  }
};

const testMockAnalysis = async () => {
  try {
    isAnalyzing.value = true;

    const params = {
      chatHistory: testChatHistory.value,
      domain: selectedDomain.value,
      role: selectedRole.value,
      useStaticData: true,  // 使用静态数据
      includeMultimodal: false
    };

    const result = await analyzeInterview(params);
    analysisResult.value = result;

  } catch (error) {
    alert('静态数据分析测试失败: ' + error.message);
  } finally {
    isAnalyzing.value = false;
  }
};
</script>

<style scoped>
/* 容器样式 */
.test-analysis-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f5f5;
}

/* 主要内容 */
.main-content {
  width: 100%;
  max-width: 1000px;
}

/* 内容卡片 */
.content-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 24px;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1677ff;
  margin: 0;
}

/* 区域样式 */
.section-card {
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

/* 聊天记录 */
.chat-history {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
}

.message-item {
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.message-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.message-number {
  font-weight: 600;
  color: #1677ff;
  margin-right: 8px;
}

.message-text {
  color: #1a1a1a;
  line-height: 1.5;
}

/* 表单样式 */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* 测试按钮 */
.test-buttons-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
}

/* 结果区域 */
.results-section {
  margin-top: 24px;
}

.results-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 24px;
}

.result-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.result-subtitle {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

/* 雷达图部分 */
.radar-chart-section {
  display: flex;
  justify-content: center;
  margin: 24px 0;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 12px;
}

/* 分数详情 */
.scores-details {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

/* 分数网格 */
.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f5f5;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.score-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #ffffff;
}

.score-label {
  font-weight: 600;
  color: #1a1a1a;
}

.score-value {
  font-weight: 700;
  color: #1677ff;
  font-size: 1.1em;
}

/* 列表样式 */
.issues-list,
.suggestions-list,
.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.issue-item,
.suggestion-item,
.recommendation-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding-left: 20px;
  color: #1a1a1a;
}

.issue-item:before,
.suggestion-item:before,
.recommendation-item:before {
  content: "\2022";
  position: absolute;
  left: 0;
  color: #1677ff;
  font-weight: bold;
}

.issue-item:last-child,
.suggestion-item:last-child,
.recommendation-item:last-child {
  border-bottom: none;
}

.issues-card {
  border-left: 4px solid #ff4d4f;
}

.suggestions-card {
  border-left: 4px solid #52c41a;
}

.recommendations-card {
  border-left: 4px solid #1677ff;
}

.recommendation-category {
  margin-bottom: 20px;
}

.recommendation-category:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1677ff;
  margin-bottom: 12px;
}

.recommendation-link {
  color: #1677ff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.recommendation-link:hover {
  color: #4096ff;
  text-decoration: underline;
}

/* 返回按钮 */
.back-section {
  text-align: center;
  margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-analysis-container {
    padding: 16px;
  }

  .main-title {
    font-size: 2rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .test-buttons-section {
    flex-direction: column;
    align-items: center;
  }

  .scores-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 1.75rem;
  }

  .results-title {
    font-size: 1.5rem;
  }
}
</style>
