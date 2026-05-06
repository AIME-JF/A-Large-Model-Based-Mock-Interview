<template>
  <div class="fullscreen-camera-container">
    <!-- 全屏摄像头背景 -->
    <div class="camera-background" v-if="isCameraEnabled">
      <video
        ref="videoElement"
        autoplay
        playsinline
        muted
        class="camera-video"
      ></video>
    </div>

    <!-- 摄像头关闭时的背景 -->
    <div class="camera-placeholder" v-if="!isCameraEnabled">
      <div class="placeholder-content">
        <VideoCameraOutlined class="camera-icon" />
        <p class="placeholder-text">摄像头已关闭</p>
      </div>
    </div>

    <!-- AI面试官头像 - 右上角 -->
    <div class="ai-interviewer-avatar">
      <div class="avatar-container">
        <div class="avatar-image">
          <UserOutlined class="avatar-icon" />
        </div>
        <div class="avatar-status">
          <span class="status-dot"></span>
        </div>
        <div class="avatar-info">
          <span class="ai-name">AI面试官</span>
          <span class="ai-status">在线</span>
        </div>
      </div>
    </div>

    <!-- 摄像头控制按钮 - 右下角 -->
    <div class="camera-controls">
      <a-button
        :type="isCameraEnabled ? 'primary' : 'primary'"
        :danger="isCameraEnabled"
        shape="round"
        size="large"
        @click="toggleCamera"
        :disabled="isLoading"
        class="camera-toggle-btn"
        :style="!isCameraEnabled ? { background: '#52c41a', borderColor: '#52c41a' } : {}"
      >
        <template #icon>
          <VideoCameraOutlined v-if="!isCameraEnabled" />
          <CloseOutlined v-else />
        </template>
        {{ isCameraEnabled ? '关闭摄像头' : '开启摄像头' }}
      </a-button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <a-spin size="large" />
        <span class="loading-text">正在{{ isCameraEnabled ? '关闭' : '开启' }}摄像头...</span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-overlay">
      <div class="error-content">
        <CloseCircleOutlined class="error-icon" />
        <span>{{ errorMessage }}</span>
        <a-button type="text" size="small" @click="errorMessage = ''" class="error-close-btn">
          <template #icon><CloseOutlined /></template>
        </a-button>
      </div>
    </div>

    <!-- 内容插槽 - 用于放置聊天界面等 -->
    <div class="content-overlay">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  VideoCameraOutlined,
  UserOutlined,
  CloseOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue';

// 定义事件
const emit = defineEmits(['camera-status-changed']);

// 响应式数据
const videoElement = ref(null);
const isCameraEnabled = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const stream = ref(null);

// 检查浏览器是否支持摄像头
const checkCameraSupport = () => {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
};

// 开启摄像头
const enableCamera = async () => {
  if (!checkCameraSupport()) {
    errorMessage.value = '您的浏览器不支持摄像头功能';
    return false;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';

    // 获取摄像头权限和视频流
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: 'user'
      },
      audio: false
    });

    stream.value = mediaStream;

    // 先设置状态为true，让video元素渲染
    isCameraEnabled.value = true;

    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100));

    // 将视频流绑定到video元素
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream;
    }

    // 简单等待一下让视频开始加载
    await new Promise(resolve => setTimeout(resolve, 500));

    emit('camera-status-changed', true);
    return true;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      errorMessage.value = '摄像头权限被拒绝，请在浏览器设置中允许摄像头访问';
    } else if (error.name === 'NotFoundError') {
      errorMessage.value = '未找到摄像头设备';
    } else if (error.name === 'NotReadableError') {
      errorMessage.value = '摄像头被其他应用程序占用';
    } else {
      errorMessage.value = '开启摄像头失败: ' + error.message;
    }

    return false;
  } finally {
    isLoading.value = false;
  }
};

// 关闭摄像头
const disableCamera = () => {
  try {
    if (stream.value) {
      stream.value.getTracks().forEach(track => {
        track.stop();
      });
      stream.value = null;
    }

    if (videoElement.value) {
      videoElement.value.srcObject = null;
    }

    isCameraEnabled.value = false;
    emit('camera-status-changed', false);
    errorMessage.value = '';
  } catch (error) {
    errorMessage.value = '关闭摄像头失败: ' + error.message;
  }
};

// 切换摄像头状态
const toggleCamera = async () => {
  if (isLoading.value) return;

  if (isCameraEnabled.value) {
    disableCamera();
  } else {
    await enableCamera();
  }
};

// 组件挂载时自动开启摄像头（可选）
onMounted(() => {
  // 如果需要自动开启摄像头，取消下面的注释
  // enableCamera();
});

// 组件卸载时关闭摄像头
onUnmounted(() => {
  disableCamera();
});

// 暴露方法给父组件
defineExpose({
  enableCamera,
  disableCamera,
  toggleCamera,
  isCameraEnabled: () => isCameraEnabled.value
});
</script>

<style scoped>
.fullscreen-camera-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 100;
  background: linear-gradient(135deg, #1677ff 0%, #4096ff 100%);
}

.camera-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.camera-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8) contrast(1.1);
}

.camera-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1677ff 0%, #4096ff 100%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
}

.camera-icon {
  font-size: 80px;
  color: rgba(255, 255, 255, 0.7);
}

.placeholder-text {
  font-size: 18px;
  margin: 0;
  font-weight: 500;
}

/* AI面试官头像 - 右上角 */
.ai-interviewer-avatar {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-image {
  width: 48px;
  height: 48px;
  background: #1677ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.avatar-icon {
  font-size: 24px;
}

.avatar-status {
  position: relative;
}

.status-dot {
  width: 12px;
  height: 12px;
  background: #52c41a;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.avatar-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ai-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.ai-status {
  font-size: 12px;
  color: #52c41a;
  font-weight: 500;
}

/* 摄像头控制按钮 - 右下角 */
.camera-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.camera-toggle-btn {
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 24px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.loading-text {
  color: #1a1a1a;
  font-size: 14px;
}

/* 错误提示 */
.error-overlay {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 242, 240, 0.95);
  border: 1px solid rgba(255, 204, 199, 0.8);
  border-radius: 12px;
  color: #cf1322;
  font-size: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.error-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.error-close-btn {
  color: #cf1322;
}

/* 内容插槽 */
.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
}

.content-overlay > * {
  pointer-events: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-interviewer-avatar {
    top: 10px;
    right: 10px;
    padding: 8px;
  }

  .avatar-container {
    gap: 8px;
  }

  .avatar-image {
    width: 40px;
    height: 40px;
  }

  .avatar-icon {
    font-size: 20px;
  }

  .ai-name {
    font-size: 12px;
  }

  .ai-status {
    font-size: 10px;
  }

  .camera-controls {
    bottom: 10px;
    right: 10px;
  }
}
</style>