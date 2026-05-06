<template>
  <div class="home-page">
    <!-- Welcome Banner -->
    <a-card class="home-welcome-card" :bordered="false">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2 class="welcome-title">欢迎使用 AI 模拟面试系统</h2>
          <p class="welcome-desc">助您提升面试能力，成就职业梦想！</p>
        </div>
        <div class="welcome-illustration">
          <RocketOutlined class="welcome-icon" />
        </div>
      </div>
    </a-card>

    <!-- Stats Row -->
    <a-row :gutter="[16, 16]" class="home-stats-row">
      <a-col :xs="12" :sm="6">
        <a-card class="home-stat-card" :bordered="false">
          <a-statistic title="总面试次数" :value="12">
            <template #prefix>
              <FileTextOutlined class="stat-icon stat-icon-blue" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card class="home-stat-card" :bordered="false">
          <a-statistic title="平均得分" :value="85" suffix="%">
            <template #prefix>
              <TrophyOutlined class="stat-icon stat-icon-gold" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card class="home-stat-card" :bordered="false">
          <a-statistic title="本周面试" :value="3">
            <template #prefix>
              <CalendarOutlined class="stat-icon stat-icon-green" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="6">
        <a-card class="home-stat-card" :bordered="false">
          <a-statistic title="能力提升" :value="12" suffix="%">
            <template #prefix>
              <RiseOutlined class="stat-icon stat-icon-purple" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- Main Content Grid -->
    <a-row :gutter="[16, 16]">
      <!-- Left column -->
      <a-col :xs="24" :lg="16">
        <!-- Quick Start -->
        <a-card title="快速开始面试" class="home-card" :bordered="false">
          <template #extra>
            <ThunderboltOutlined style="color: #1677ff" />
          </template>
          <p class="card-desc">选择您想要练习的面试类型，立即开始模拟面试</p>
          <a-space wrap>
            <a-button type="primary" size="large" @click="handleStartInterview('tech', '前端工程师')">
              <LaptopOutlined /> 技术面试
            </a-button>
            <a-button size="large" @click="handleStartInterview('hr', 'HR面试')">
              <TeamOutlined /> HR面试
            </a-button>
          </a-space>
        </a-card>

        <!-- Domain Selection -->
        <a-card title="选择面试领域与岗位" class="home-card" :bordered="false">
          <template #extra>
            <AppstoreOutlined style="color: #1677ff" />
          </template>
          <a-row :gutter="[16, 16]">
            <a-col
              v-for="domain in mockInterviewDomains"
              :key="domain.id"
              :xs="24"
              :sm="12"
            >
              <div class="domain-card">
                <div class="domain-header">
                  <div class="domain-icon-wrapper" :class="'domain-icon-' + domain.id">
                    <component :is="getDomainIcon(domain.id)" />
                  </div>
                  <span class="domain-name">{{ domain.name }}</span>
                </div>
                <div class="domain-roles">
                  <a-tag
                    v-for="role in domain.roles"
                    :key="role"
                    class="role-tag"
                    @click="handleStartInterview(domain.id, role)"
                  >
                    {{ role }}
                  </a-tag>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-card>

        <!-- Resume Analysis -->
        <a-card title="简历智能分析" class="home-card" :bordered="false">
          <template #extra>
            <FileSearchOutlined style="color: #1677ff" />
          </template>
          <p class="card-desc">上传您的简历，AI将为您提供专业的分析和建议</p>
          <a-upload-dragger
            v-if="!uploadedResume"
            :before-upload="handleBeforeUpload"
            :show-upload-list="false"
            accept=".pdf,.doc,.docx"
          >
            <p class="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p class="ant-upload-text">点击或拖拽上传简历</p>
            <p class="ant-upload-hint">支持 PDF、DOC、DOCX 格式</p>
          </a-upload-dragger>

          <div v-else class="uploaded-file-display">
            <a-card size="small" class="file-card">
              <div class="file-info-row">
                <FileTextOutlined class="file-type-icon" />
                <div class="file-details">
                  <span class="file-name">{{ uploadedResume.name }}</span>
                  <span class="file-size">{{ formatFileSize(uploadedResume.size) }}</span>
                </div>
                <a-button type="text" danger size="small" @click="removeFile">
                  <DeleteOutlined />
                </a-button>
              </div>
            </a-card>
            <a-button
              v-if="!isAnalyzing"
              type="primary"
              block
              size="large"
              style="margin-top: 12px"
              @click="analyzeResume"
            >
              <ScanOutlined /> 开始分析简历
            </a-button>
            <div v-if="isAnalyzing" style="text-align: center; padding: 16px">
              <a-spin tip="正在分析简历..." />
            </div>
          </div>

          <!-- Analysis Results -->
          <div v-if="resumeAnalysis" class="resume-results">
            <a-divider />
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="12">
                <div class="result-section">
                  <h4>综合评分</h4>
                  <a-progress
                    type="circle"
                    :percent="resumeAnalysis.overallScore"
                    :stroke-color="{ '0%': '#1677ff', '100%': '#52c41a' }"
                  />
                  <p class="score-label">{{ getScoreDescription(resumeAnalysis.overallScore) }}</p>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="result-section">
                  <h4>技能匹配度</h4>
                  <div v-for="skill in resumeAnalysis.skills" :key="skill.name" class="skill-row">
                    <span class="skill-name">{{ skill.name }}</span>
                    <a-progress :percent="skill.score" :size="6" :stroke-color="'#1677ff'" />
                  </div>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="result-section">
                  <h4><CheckCircleOutlined style="color: #52c41a" /> 优势亮点</h4>
                  <ul class="result-list">
                    <li v-for="h in resumeAnalysis.highlights" :key="h">{{ h }}</li>
                  </ul>
                </div>
              </a-col>
              <a-col :xs="24" :sm="12">
                <div class="result-section">
                  <h4><ToolOutlined style="color: #faad14" /> 改进建议</h4>
                  <ul class="result-list">
                    <li v-for="s in resumeAnalysis.suggestions" :key="s">{{ s }}</li>
                  </ul>
                </div>
              </a-col>
            </a-row>
          </div>
        </a-card>
      </a-col>

      <!-- Right column -->
      <a-col :xs="24" :lg="8">
        <!-- Recent Activity -->
        <a-card title="最近活动" class="home-card" :bordered="false">
          <template #extra>
            <ClockCircleOutlined style="color: #1677ff" />
          </template>
          <a-list :data-source="paginatedActivities" size="small">
            <template #renderItem="{ item }">
              <a-list-item class="activity-item">
                <a-list-item-meta :description="item.time">
                  <template #title>{{ item.text }}</template>
                  <template #avatar>
                    <a-avatar size="small" style="background: #e6f4ff; color: #1677ff">
                      <template #icon>
                        <component :is="activityIconMap[item.icon]" />
                      </template>
                    </a-avatar>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
          <Pagination
            v-if="activities.length > activitiesPageSize"
            :current-page="activitiesCurrentPage"
            :total-items="activities.length"
            :page-size="activitiesPageSize"
            @page-change="handleActivitiesPageChange"
            @page-size-change="handleActivitiesPageSizeChange"
          />
        </a-card>

        <!-- System Test -->
        <a-card title="系统测试功能" class="home-card" :bordered="false">
          <template #extra>
            <ExperimentOutlined style="color: #1677ff" />
          </template>
          <a-space direction="vertical" style="width: 100%" :size="12">
            <a-button block @click="$emit('test-analysis')">
              <BarChartOutlined /> 分析功能测试
            </a-button>
            <a-button block @click="$emit('fullscreen-camera-test')">
              <VideoCameraOutlined /> 摄像头测试
            </a-button>
            <a-button block @click="$emit('conversation-test')">
              <MessageOutlined /> 对话测试
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, markRaw } from 'vue';
import { mockInterviewDomains } from '../utils/mockData';
import Pagination from './Pagination.vue';
import {
  RocketOutlined,
  FileTextOutlined,
  TrophyOutlined,
  CalendarOutlined,
  RiseOutlined,
  ThunderboltOutlined,
  LaptopOutlined,
  TeamOutlined,
  AppstoreOutlined,
  FileSearchOutlined,
  InboxOutlined,
  DeleteOutlined,
  ScanOutlined,
  CheckCircleOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  ExperimentOutlined,
  BarChartOutlined,
  VideoCameraOutlined,
  MessageOutlined,
  CodeOutlined,
  SolutionOutlined,
  FundProjectionScreenOutlined,
  DollarOutlined,
  ShopOutlined,
  HighlightOutlined,
  ProjectOutlined,
  BulbOutlined,
  AimOutlined,
  SoundOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
  userId: String,
});

const emits = defineEmits([
  'start-interview',
  'test-analysis',
  'camera-test',
  'fullscreen-camera-test',
  'conversation-test',
  'navigate-to-page'
]);

// Resume upload
const uploadedResume = ref(null);
const isAnalyzing = ref(false);
const resumeAnalysis = ref(null);

// Activity data and pagination
const activities = ref([
  { id: 1, icon: 'LaptopOutlined', text: '完成了前端工程师面试', time: '2小时前' },
  { id: 2, icon: 'FileTextOutlined', text: '查看了面试报告', time: '1天前' },
  { id: 3, icon: 'AimOutlined', text: '开始了算法工程师面试', time: '2天前' },
  { id: 4, icon: 'BarChartOutlined', text: '分析了简历内容', time: '3天前' },
  { id: 5, icon: 'BulbOutlined', text: '查看了学习推荐', time: '4天前' },
  { id: 6, icon: 'ToolOutlined', text: '测试了摄像头功能', time: '5天前' },
  { id: 7, icon: 'RiseOutlined', text: '完成了产品经理面试', time: '1周前' },
  { id: 8, icon: 'HighlightOutlined', text: '参与了UI设计师面试', time: '1周前' },
  { id: 9, icon: 'DollarOutlined', text: '完成了财务分析师面试', time: '2周前' },
  { id: 10, icon: 'SoundOutlined', text: '参与了市场营销面试', time: '2周前' },
  { id: 11, icon: 'RocketOutlined', text: '开始了项目管理面试', time: '3周前' },
  { id: 12, icon: 'TeamOutlined', text: '完成了HR面试', time: '3周前' }
]);

const activitiesCurrentPage = ref(1);
const activitiesPageSize = ref(5);

const paginatedActivities = computed(() => {
  const start = (activitiesCurrentPage.value - 1) * activitiesPageSize.value;
  const end = start + activitiesPageSize.value;
  return activities.value.slice(start, end);
});

const handleActivitiesPageChange = (page) => {
  activitiesCurrentPage.value = page;
};

const handleActivitiesPageSizeChange = (size) => {
  activitiesPageSize.value = size;
  activitiesCurrentPage.value = 1;
};

const handleStartInterview = (domainId, role) => {
  emits('start-interview', domainId, role);
};

// Domain icon mapping
const getDomainIcon = (domainId) => {
  const iconMap = {
    'tech': CodeOutlined,
    'hr': TeamOutlined,
    'management': ProjectOutlined,
    'sales': ShopOutlined,
    'design': HighlightOutlined,
    'finance': DollarOutlined,
    'marketing': BulbOutlined,
    'product': RocketOutlined,
  };
  return iconMap[domainId] || FileTextOutlined;
};

// Activity icon mapping
const activityIconMap = {
  'LaptopOutlined': LaptopOutlined,
  'FileTextOutlined': FileTextOutlined,
  'AimOutlined': AimOutlined,
  'BarChartOutlined': BarChartOutlined,
  'BulbOutlined': BulbOutlined,
  'ToolOutlined': ToolOutlined,
  'RiseOutlined': RiseOutlined,
  'HighlightOutlined': HighlightOutlined,
  'DollarOutlined': DollarOutlined,
  'SoundOutlined': SoundOutlined,
  'RocketOutlined': RocketOutlined,
  'TeamOutlined': TeamOutlined,
};

// Resume upload functions
const handleBeforeUpload = (file) => {
  uploadedResume.value = file;
  resumeAnalysis.value = null;
  return false; // prevent auto upload
};

const removeFile = () => {
  uploadedResume.value = null;
  resumeAnalysis.value = null;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const analyzeResume = async () => {
  if (!uploadedResume.value) return;
  isAnalyzing.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
    resumeAnalysis.value = {
      overallScore: Math.floor(Math.random() * 20) + 80,
      skills: [
        { name: 'JavaScript', score: Math.floor(Math.random() * 30) + 70 },
        { name: 'Vue.js', score: Math.floor(Math.random() * 30) + 70 },
        { name: 'React', score: Math.floor(Math.random() * 40) + 60 },
        { name: '项目管理', score: Math.floor(Math.random() * 25) + 75 },
        { name: '团队协作', score: Math.floor(Math.random() * 20) + 80 }
      ],
      highlights: [
        '具有丰富的前端开发经验',
        '熟练掌握现代JavaScript框架',
        '有良好的项目管理能力',
        '具备优秀的团队协作精神',
        '持续学习新技术的能力强'
      ],
      suggestions: [
        '建议增加更多具体的项目成果描述',
        '可以添加一些量化的工作成就',
        '建议补充相关的技术认证',
        '可以增加一些开源项目经验',
        '建议优化简历的整体排版和结构'
      ]
    };
  } catch (error) {
    // error handled silently
  } finally {
    isAnalyzing.value = false;
  }
};

const getScoreDescription = (score) => {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 70) return '中等';
  if (score >= 60) return '及格';
  return '需要改进';
};
</script>

<style scoped>
.home-page {
  width: 100%;
}

/* Welcome Card */
.home-welcome-card {
  background: linear-gradient(135deg, #1677ff 0%, #4096ff 100%) !important;
  border-radius: 12px !important;
  margin-bottom: 16px;
}

.home-welcome-card :deep(.ant-card-body) {
  padding: 24px 32px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
}

.welcome-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.welcome-icon {
  font-size: 48px;
  color: rgba(255, 255, 255, 0.3);
}

/* Stats */
.home-stats-row {
  margin-bottom: 16px;
}

.home-stat-card {
  border-radius: 12px !important;
}

.home-stat-card :deep(.ant-statistic-title) {
  font-size: 13px;
  color: #8c8c8c;
}

.home-stat-card :deep(.ant-statistic-content-value) {
  font-size: 24px;
  font-weight: 700;
}

.stat-icon {
  font-size: 20px;
  margin-right: 4px;
}

.stat-icon-blue { color: #1677ff; }
.stat-icon-gold { color: #faad14; }
.stat-icon-green { color: #52c41a; }
.stat-icon-purple { color: #722ed1; }

/* Cards */
.home-card {
  border-radius: 12px !important;
  margin-bottom: 16px;
}

.home-card :deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
  min-height: 48px;
}

.home-card :deep(.ant-card-head-title) {
  font-weight: 600;
  font-size: 15px;
}

.card-desc {
  color: #8c8c8c;
  margin: 0 0 16px;
  font-size: 14px;
}

/* Domain Cards */
.domain-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s ease;
  cursor: default;
}

.domain-card:hover {
  border-color: #1677ff;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.08);
}

.domain-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.domain-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #fff;
}

.domain-icon-tech { background: linear-gradient(135deg, #1677ff, #4096ff); }
.domain-icon-hr { background: linear-gradient(135deg, #52c41a, #73d13d); }
.domain-icon-management { background: linear-gradient(135deg, #722ed1, #9254de); }
.domain-icon-sales { background: linear-gradient(135deg, #fa8c16, #ffa940); }
.domain-icon-design { background: linear-gradient(135deg, #eb2f96, #f759ab); }
.domain-icon-finance { background: linear-gradient(135deg, #faad14, #ffc53d); }
.domain-icon-marketing { background: linear-gradient(135deg, #13c2c2, #36cfc9); }
.domain-icon-product { background: linear-gradient(135deg, #1677ff, #69b1ff); }

.domain-name {
  font-weight: 600;
  font-size: 15px;
  color: #1f1f1f;
}

.domain-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.role-tag {
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  padding: 2px 10px;
  font-size: 13px;
}

.role-tag:hover {
  color: #1677ff;
  border-color: #1677ff;
  background: #e6f4ff;
}

/* Uploaded file */
.uploaded-file-display {
  margin-top: 8px;
}

.file-card {
  border-radius: 8px !important;
}

.file-info-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-type-icon {
  font-size: 24px;
  color: #1677ff;
}

.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 600;
  font-size: 14px;
  color: #1f1f1f;
}

.file-size {
  font-size: 12px;
  color: #8c8c8c;
}

/* Resume results */
.resume-results {
  margin-top: 16px;
}

.result-section {
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  height: 100%;
}

.result-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #1f1f1f;
}

.score-label {
  margin-top: 8px;
  text-align: center;
  color: #8c8c8c;
  font-size: 14px;
}

.skill-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.skill-row .skill-name {
  width: 72px;
  font-size: 13px;
  color: #595959;
  flex-shrink: 0;
}

.skill-row :deep(.ant-progress) {
  flex: 1;
}

.result-list {
  margin: 0;
  padding-left: 18px;
  list-style: disc;
}

.result-list li {
  font-size: 13px;
  color: #595959;
  margin-bottom: 6px;
  line-height: 1.6;
}

/* Activity */
.activity-item :deep(.ant-list-item-meta-title) {
  font-size: 13px;
  margin-bottom: 0 !important;
}

.activity-item :deep(.ant-list-item-meta-description) {
  font-size: 12px;
}
</style>
