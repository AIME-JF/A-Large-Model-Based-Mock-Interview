<template>
  <div class="mobile-home">
    <!-- 移动端欢迎区域 -->
    <div class="mobile-welcome">
      <div class="welcome-content">
        <h1 class="welcome-title">AI 模拟面试</h1>
        <p class="welcome-subtitle">提升面试技能，成就职业梦想</p>
      </div>
      <div class="welcome-stats">
        <div class="stat-item">
          <div class="stat-number">12</div>
          <div class="stat-label">面试次数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">85%</div>
          <div class="stat-label">平均得分</div>
        </div>
      </div>
    </div>

    <!-- 快速操作卡片 -->
    <div class="quick-actions">
      <h2 class="section-title"><RocketOutlined class="section-icon" /> 快速开始</h2>
      <div class="action-cards">
        <a-card class="action-card tech-card" hoverable @click="handleStartInterview('tech', '前端工程师')">
          <div class="card-icon"><LaptopOutlined /></div>
          <div class="card-title">技术面试</div>
          <div class="card-desc">算法、编程、技术问答</div>
        </a-card>

        <a-card class="action-card hr-card" hoverable @click="handleStartInterview('hr', 'HR面试')">
          <div class="card-icon"><TeamOutlined /></div>
          <div class="card-title">HR面试</div>
          <div class="card-desc">行为面试、软技能评估</div>
        </a-card>
      </div>
    </div>

    <!-- 面试领域选择 -->
    <div class="interview-domains">
      <h2 class="section-title"><AimOutlined class="section-icon" /> 选择面试领域</h2>
      <a-card class="domains-card">
        <div
          v-for="domain in mockInterviewDomains"
          :key="domain.id"
          class="domain-item"
          @click="toggleDomain(domain.id)"
        >
          <div class="domain-header">
            <span class="domain-icon"><component :is="getDomainIconComponent(domain.id)" /></span>
            <span class="domain-name">{{ domain.name }}</span>
            <DownOutlined class="expand-icon" :class="{ 'expanded': expandedDomain === domain.id }" />
          </div>

          <div class="roles-container" v-show="expandedDomain === domain.id">
            <div class="roles-grid">
              <a-button
                v-for="role in domain.roles"
                :key="role"
                @click.stop="handleStartInterview(domain.id, role)"
                class="role-btn"
              >
                {{ role }}
              </a-button>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 功能工具 -->
    <div class="feature-tools">
      <h2 class="section-title"><ToolOutlined class="section-icon" /> 实用工具</h2>
      <div class="tools-grid">
        <a-card class="tool-card" hoverable @click="$emit('navigate-to-page', 'interview-records')">
          <div class="tool-icon"><BarChartOutlined /></div>
          <div class="tool-title">面试记录</div>
        </a-card>

        <a-card class="tool-card" hoverable @click="$emit('navigate-to-page', 'ability-analysis')">
          <div class="tool-icon"><LineChartOutlined /></div>
          <div class="tool-title">能力分析</div>
        </a-card>

        <a-card class="tool-card" hoverable @click="$emit('test-analysis')">
          <div class="tool-icon"><ExperimentOutlined /></div>
          <div class="tool-title">分析测试</div>
        </a-card>

        <a-card class="tool-card" hoverable @click="$emit('camera-test')">
          <div class="tool-icon"><CameraOutlined /></div>
          <div class="tool-title">摄像头测试</div>
        </a-card>

        <a-card class="tool-card" hoverable @click="$emit('conversation-test')">
          <div class="tool-icon"><MessageOutlined /></div>
          <div class="tool-title">对话测试</div>
        </a-card>

        <a-card class="tool-card resume-tool" hoverable @click="showResumeUpload = true">
          <div class="tool-icon"><FileTextOutlined /></div>
          <div class="tool-title">简历分析</div>
        </a-card>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="recent-activity">
      <h2 class="section-title"><ClockCircleOutlined class="section-icon" /> 最近活动</h2>
      <a-card class="activity-card">
        <div
          v-for="activity in paginatedActivities"
          :key="activity.id"
          class="activity-item"
        >
          <span class="activity-icon"><component :is="activityIconMap[activity.icon]" v-if="activityIconMap[activity.icon]" /><span v-else>{{ activity.icon }}</span></span>
          <div class="activity-content">
            <div class="activity-text">{{ activity.text }}</div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </a-card>

      <!-- 简化的分页 -->
      <div v-if="activities.length > activitiesPageSize" class="pagination-simple">
        <a-button
          @click="handleActivitiesPageChange(activitiesCurrentPage - 1)"
          :disabled="activitiesCurrentPage === 1"
          size="small"
        >
          <LeftOutlined /> 上一页
        </a-button>
        <span class="page-info">
          {{ activitiesCurrentPage }} / {{ Math.ceil(activities.length / activitiesPageSize) }}
        </span>
        <a-button
          @click="handleActivitiesPageChange(activitiesCurrentPage + 1)"
          :disabled="activitiesCurrentPage >= Math.ceil(activities.length / activitiesPageSize)"
          size="small"
        >
          下一页 <RightOutlined />
        </a-button>
      </div>
    </div>

    <!-- 简历上传弹窗 -->
    <div v-if="showResumeUpload" class="resume-modal">
      <div class="modal-overlay" @click="showResumeUpload = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3><FileTextOutlined /> 简历智能分析</h3>
          <a-button type="text" shape="circle" @click="showResumeUpload = false">
            <template #icon><CloseOutlined /></template>
          </a-button>
        </div>

        <div class="upload-area" @click="triggerFileUpload" @dragover.prevent @drop.prevent="handleFileDrop">
          <div v-if="!uploadedResume" class="upload-placeholder">
            <div class="upload-icon"><InboxOutlined /></div>
            <div class="upload-text">点击或拖拽上传简历</div>
            <div class="upload-hint">支持 PDF、DOC、DOCX 格式</div>
          </div>
          <div v-else class="uploaded-file">
            <div class="file-icon"><FileTextOutlined /></div>
            <div class="file-info">
              <div class="file-name">{{ uploadedResume.name }}</div>
              <div class="file-size">{{ formatFileSize(uploadedResume.size) }}</div>
            </div>
            <a-button type="text" danger shape="circle" size="small" @click.stop="removeFile">
              <template #icon><DeleteOutlined /></template>
            </a-button>
          </div>
        </div>

        <input ref="fileInput" type="file" accept=".pdf,.doc,.docx" @change="handleFileUpload" style="display: none;">

        <div class="modal-actions">
          <a-button v-if="uploadedResume && !isAnalyzing" type="primary" block size="large" @click="analyzeResume">
            开始分析简历
          </a-button>
          <div v-if="isAnalyzing" class="analyzing-status">
            <a-spin size="small" />
            <span>正在分析简历...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { message } from 'ant-design-vue';
import {
  RocketOutlined,
  LaptopOutlined,
  TeamOutlined,
  AimOutlined,
  DownOutlined,
  ToolOutlined,
  BarChartOutlined,
  LineChartOutlined,
  ExperimentOutlined,
  CameraOutlined,
  MessageOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
  InboxOutlined,
  DeleteOutlined,
  MobileOutlined,
  HighlightOutlined,
  RiseOutlined,
  DollarOutlined,
  AppstoreOutlined,
  TrophyOutlined,
  BulbOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue';

const activityIconMap = {
  LaptopOutlined,
  BarChartOutlined,
  AimOutlined,
  RiseOutlined,
  TrophyOutlined,
  FileTextOutlined,
  BulbOutlined,
  SearchOutlined,
};
import { mockInterviewDomains } from '../utils/mockData';

const props = defineProps({
  userId: String,
  activities: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(['start-interview', 'test-analysis', 'camera-test', 'conversation-test', 'navigate-to-page']);

// 响应式数据
const expandedDomain = ref(null);
const showResumeUpload = ref(false);
const uploadedResume = ref(null);
const isAnalyzing = ref(false);
const activitiesCurrentPage = ref(1);
const activitiesPageSize = ref(5);

// 计算属性
const paginatedActivities = computed(() => {
  const start = (activitiesCurrentPage.value - 1) * activitiesPageSize.value;
  const end = start + activitiesPageSize.value;
  return props.activities.slice(start, end);
});

// 方法
const getDomainIconComponent = (domainId) => {
  const icons = {
    'tech': LaptopOutlined,
    'product': MobileOutlined,
    'design': HighlightOutlined,
    'marketing': RiseOutlined,
    'hr': TeamOutlined,
    'finance': DollarOutlined
  };
  return icons[domainId] || AppstoreOutlined;
};

const toggleDomain = (domainId) => {
  expandedDomain.value = expandedDomain.value === domainId ? null : domainId;
};

const handleStartInterview = (domainId, role) => {
  emits('start-interview', domainId, role);
};

const handleActivitiesPageChange = (page) => {
  if (page >= 1 && page <= Math.ceil(props.activities.length / activitiesPageSize.value)) {
    activitiesCurrentPage.value = page;
  }
};

const triggerFileUpload = () => {
  document.querySelector('input[type="file"]').click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadedResume.value = file;
  }
};

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) {
    uploadedResume.value = file;
  }
};

const removeFile = () => {
  uploadedResume.value = null;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const analyzeResume = async () => {
  isAnalyzing.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 3000));
    message.success('简历分析完成！');
    showResumeUpload.value = false;
    uploadedResume.value = null;
  } catch (error) {
    message.error('简历分析失败，请重试');
  } finally {
    isAnalyzing.value = false;
  }
};
</script>

<style scoped>
.mobile-home {
  padding: 80px 16px 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

/* 移动端欢迎区域 */
.mobile-welcome {
  background: #1677ff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  color: white;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.welcome-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0 0 20px 0;
}

.welcome-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 4px;
}

/* 章节标题 */
.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  padding-left: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  color: #1677ff;
  font-size: 1.1rem;
}

/* 快速操作卡片 */
.quick-actions {
  margin-bottom: 24px;
}

.action-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.action-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:deep(.ant-card-body) {
  padding: 20px;
}

.action-card:active {
  transform: scale(0.95);
}

.tech-card {
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 12px;
}

.tech-card:deep(.ant-card-body) {
  color: white;
}

.hr-card {
  background: #722ed1;
  color: white;
  border: none;
  border-radius: 12px;
}

.hr-card:deep(.ant-card-body) {
  color: white;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-desc {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 面试领域 */
.interview-domains {
  margin-bottom: 24px;
}

.domains-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.domains-card:deep(.ant-card-body) {
  padding: 0;
}

.domain-item {
  border-bottom: 1px solid #f0f0f0;
}

.domain-item:last-child {
  border-bottom: none;
}

.domain-header {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.domain-header:hover {
  background: #fafafa;
}

.domain-icon {
  font-size: 1.2rem;
  margin-right: 12px;
  color: #1677ff;
}

.domain-name {
  flex: 1;
  font-weight: 500;
  color: #1a1a1a;
}

.expand-icon {
  transition: transform 0.3s ease;
  color: #999;
  font-size: 12px;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.roles-container {
  padding: 0 16px 16px;
}

.roles-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.role-btn {
  border-radius: 8px;
  font-size: 0.9rem;
  color: #666;
}

.role-btn:hover {
  color: #1677ff;
  border-color: #1677ff;
}

/* 功能工具 */
.feature-tools {
  margin-bottom: 24px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.tool-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.tool-card:deep(.ant-card-body) {
  padding: 20px;
}

.tool-card:active {
  transform: scale(0.95);
}

.tool-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  color: #1677ff;
}

.tool-title {
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
}

.resume-tool {
  background: #f0f5ff;
}

/* 最近活动 */
.recent-activity {
  margin-bottom: 24px;
}

.activity-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.activity-card:deep(.ant-card-body) {
  padding: 0;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.5rem;
  margin-right: 12px;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.95rem;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.activity-time {
  font-size: 0.8rem;
  color: #999;
}

/* 简化分页 */
.pagination-simple {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
}

.page-info {
  font-size: 0.9rem;
  color: #666;
}

/* 简历上传弹窗 */
.resume-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.upload-area {
  margin: 20px;
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #1677ff;
  background: #f0f5ff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-icon {
  font-size: 3rem;
  color: #1677ff;
}

.upload-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.upload-hint {
  font-size: 0.9rem;
  color: #999;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fafafa;
  padding: 12px;
  border-radius: 8px;
}

.file-icon {
  font-size: 2rem;
  color: #1677ff;
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.file-size {
  font-size: 0.9rem;
  color: #999;
}

.modal-actions {
  padding: 20px;
}

.analyzing-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: #fafafa;
  border-radius: 12px;
  color: #666;
}

/* 响应式调整 */
@media (max-width: 480px) {
  .action-cards {
    grid-template-columns: 1fr;
  }

  .tools-grid {
    grid-template-columns: 1fr;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }

  .welcome-stats {
    gap: 20px;
  }
}
</style>