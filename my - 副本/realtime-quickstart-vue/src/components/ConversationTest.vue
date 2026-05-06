<template>
  <div class="conversation-test-container">
    <div class="main-content">
      <a-card class="content-card">
        <div class="title-section">
          <h1 class="main-title">对话显示测试</h1>
          <p class="subtitle">测试语音转文字对话显示功能</p>
        </div>

        <!-- 测试控制区域 -->
        <a-card class="control-section">
          <h3 class="section-title">测试控制</h3>
          <div class="control-buttons">
            <a-button type="primary" @click="addAIMessage">
              <template #icon><RobotOutlined /></template>
              添加AI消息
            </a-button>
            <a-button type="primary" style="background: #52c41a; border-color: #52c41a" @click="addUserMessage">
              <template #icon><UserOutlined /></template>
              添加用户消息
            </a-button>
            <a-button danger @click="clearMessages">
              <template #icon><DeleteOutlined /></template>
              清空消息
            </a-button>
            <a-button type="primary" ghost @click="toggleConnection">
              <template #icon><ApiOutlined /></template>
              {{ isConnected ? '断开连接' : '模拟连接' }}
            </a-button>
          </div>
        </a-card>

        <!-- 对话显示区域 -->
        <div class="conversation-display">
          <div class="conversation-container">
            <div class="conversation-header">
              <h3 class="conversation-title">
                <MessageOutlined class="conversation-icon" />
                实时对话记录
              </h3>
              <div class="conversation-stats">
                <span class="stat-item">
                  <span class="stat-label">消息数:</span>
                  <span class="stat-value">{{ messageList.length }}</span>
                </span>
                <span class="stat-item">
                  <span class="stat-label">状态:</span>
                  <span class="stat-value" :class="{ 'active': isConnected }">
                    {{ isConnected ? '对话中' : '等待连接' }}
                  </span>
                </span>
              </div>
            </div>

            <div class="conversation-content">
              <div class="messages-list">
                <div v-if="messageList.length === 0" class="empty-message">
                  <MessageOutlined class="empty-icon" />
                  <p>等待开始对话...</p>
                  <small>点击按钮添加测试消息</small>
                </div>

                <div v-else>
                  <div
                    v-for="(message, index) in paginatedMessageList"
                    :key="index + (currentPage - 1) * pageSize"
                    class="message-item"
                    :class="{ 'ai-message': message.type === 'ai', 'user-message': message.type === 'user' }"
                  >
                    <div class="message-avatar">
                      <RobotOutlined v-if="message.type === 'ai'" class="ai-avatar" />
                      <UserOutlined v-else class="user-avatar" />
                    </div>
                    <div class="message-content">
                      <div class="message-sender">
                        {{ message.type === 'ai' ? 'AI面试官' : '您' }}
                      </div>
                      <div class="message-text">
                        {{ message.text }}
                      </div>
                      <div class="message-time">
                        {{ message.time }}
                      </div>
                    </div>
                  </div>

                  <!-- 消息分页组件 -->
                  <Pagination
                    v-if="messageList.length > pageSize"
                    :current-page="currentPage"
                    :total-items="messageList.length"
                    :page-size="pageSize"
                    @page-change="handlePageChange"
                    @page-size-change="handlePageSizeChange"
                  />
                </div>
              </div>
            </div>

            <!-- 实时状态指示器 -->
            <div v-if="isConnected" class="realtime-indicator">
              <div class="indicator-dot"></div>
              <span>实时语音转文字中...</span>
            </div>
          </div>
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
import { ref, defineEmits, computed } from 'vue';
import {
  RobotOutlined,
  UserOutlined,
  DeleteOutlined,
  ApiOutlined,
  MessageOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons-vue';
import Pagination from './Pagination.vue';

const emits = defineEmits(['go-back']);

const messageList = ref([]);
const isConnected = ref(false);

// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(8);

// 计算属性：分页后的消息列表
const paginatedMessageList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return messageList.value.slice(start, end);
});

// 分页处理函数
const handlePageChange = (page) => {
  currentPage.value = page;
};

const handlePageSizeChange = (newPageSize) => {
  pageSize.value = newPageSize;
  currentPage.value = 1; // 重置到第一页
};

// 模拟AI消息
const aiMessages = [
  "您好！我是AI面试官，很高兴见到您。请简单介绍一下您的工作经验。",
  "您提到有机器学习开发经验，能具体说说您使用过哪些技术栈吗？",
  "在您的项目中，您是如何处理数据预处理的？",
  "您认为在深度学习项目中，最重要的环节是什么？",
  "您对当前的AI发展趋势有什么看法？"
];

// 模拟用户消息
const userMessages = [
  "您好！我有三年的机器学习开发经验，主要专注于深度学习模型的训练和优化。",
  "我主要使用TensorFlow和PyTorch来构建神经网络模型，也熟悉一些传统的机器学习算法。",
  "在数据预处理方面，我通常会进行数据清洗、特征工程和数据增强，确保数据质量。",
  "我认为最重要的环节是数据质量和模型调优，好的数据是成功的基础。",
  "我认为AI正在向更高效、更可解释的方向发展，大模型技术也在不断进步。"
];

// 添加AI消息
const addAIMessage = () => {
  const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
  const time = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  messageList.value.push({
    type: 'ai',
    text: randomMessage,
    time: time
  });
};

// 添加用户消息
const addUserMessage = () => {
  const randomMessage = userMessages[Math.floor(Math.random() * userMessages.length)];
  const time = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  messageList.value.push({
    type: 'user',
    text: randomMessage,
    time: time
  });
};

// 清空消息
const clearMessages = () => {
  messageList.value = [];
};

// 切换连接状态
const toggleConnection = () => {
  isConnected.value = !isConnected.value;
};
</script>

<style scoped>
/* 容器样式 */
.conversation-test-container {
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
  max-width: 1200px;
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

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 16px 0 0 0;
}

/* 测试控制区域 */
.control-section {
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  text-align: center;
}

.control-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

/* 对话显示区域样式 */
.conversation-display {
  margin-bottom: 24px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.conversation-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.conversation-header {
  background: #1677ff;
  color: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conversation-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.conversation-icon {
  font-size: 18px;
}

.conversation-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.stat-label {
  opacity: 0.8;
}

.stat-value {
  font-weight: 600;
}

.stat-value.active {
  color: #95de64;
}

.conversation-content {
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty-message {
  text-align: center;
  padding: 40px 24px;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #999;
}

.empty-message p {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #666;
}

.empty-message small {
  font-size: 12px;
  color: #999;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.message-item.ai-message {
  background: rgba(22, 119, 255, 0.06);
  border: 1px solid rgba(22, 119, 255, 0.15);
}

.message-item.user-message {
  background: rgba(82, 196, 26, 0.06);
  border: 1px solid rgba(82, 196, 26, 0.15);
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.ai-avatar {
  font-size: 18px;
  color: #1677ff;
}

.user-avatar {
  font-size: 18px;
  color: #52c41a;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-sender {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #666;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  color: #1a1a1a;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.realtime-indicator {
  background: rgba(82, 196, 26, 0.08);
  border-top: 1px solid rgba(82, 196, 26, 0.15);
  padding: 8px 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #52c41a;
  font-weight: 500;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 返回按钮 */
.back-section {
  text-align: center;
}

/* 滚动条样式 */
.conversation-content::-webkit-scrollbar {
  width: 6px;
}

.conversation-content::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 3px;
}

.conversation-content::-webkit-scrollbar-thumb {
  background: rgba(22, 119, 255, 0.3);
  border-radius: 3px;
}

.conversation-content::-webkit-scrollbar-thumb:hover {
  background: rgba(22, 119, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .conversation-test-container {
    padding: 16px;
  }

  .main-title {
    font-size: 2rem;
  }

  .control-buttons {
    gap: 8px;
  }

  .conversation-header {
    padding: 12px 16px;
  }

  .conversation-title {
    font-size: 14px;
  }

  .conversation-stats {
    gap: 12px;
  }

  .stat-item {
    font-size: 11px;
  }

  .conversation-content {
    padding: 16px;
    max-height: 300px;
  }

  .messages-list {
    gap: 12px;
  }

  .message-item {
    padding: 10px;
  }

  .message-avatar {
    width: 28px;
    height: 28px;
  }

  .ai-avatar, .user-avatar {
    font-size: 14px;
  }

  .message-text {
    font-size: 13px;
  }

  .message-sender {
    font-size: 11px;
  }

  .message-time {
    font-size: 10px;
  }
}
</style>
