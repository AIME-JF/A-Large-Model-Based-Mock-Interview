<template>
  <div class="camera-container">
    <!-- 摄像头视频显示区域 -->
    <div class="video-container" v-if="isCameraEnabled">
      <video
        ref="videoElement"
        autoplay
        playsinline
        muted
        class="camera-video"
      ></video>
      <div class="camera-overlay">
        <a-tag color="success" class="camera-status-tag">
          <template #icon><CheckCircleOutlined /></template>
          摄像头已开启
        </a-tag>
      </div>
    </div>

    <!-- 摄像头关闭时的占位区域 -->
    <div class="camera-placeholder" v-else>
      <div class="placeholder-content">
        <VideoCameraOutlined class="camera-icon" />
        <p class="placeholder-text">摄像头已关闭</p>
      </div>
    </div>

    <!-- 摄像头控制按钮 -->
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

      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-indicator">
        <a-spin size="small" />
        <span>正在{{ isCameraEnabled ? '关闭' : '开启' }}摄像头...</span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      <CloseCircleOutlined class="error-icon" />
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  VideoCameraOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue';

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
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      },
      audio: false
    });

    stream.value = mediaStream;

    // 将视频流绑定到video元素
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream;
    }

    isCameraEnabled.value = true;
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
.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;
}

.video-container {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  background: #1677ff;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.camera-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
}

.camera-status-tag {
  backdrop-filter: blur(4px);
}

.camera-placeholder {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #666;
}

.camera-icon {
  font-size: 48px;
  color: #999;
}

.placeholder-text {
  font-size: 14px;
  margin: 0;
  color: #999;
}

.camera-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.camera-toggle-btn {
  min-width: 160px;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #cf1322;
  font-size: 12px;
  max-width: 100%;
}

.error-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .camera-container {
    max-width: 100%;
  }

  .video-container,
  .camera-placeholder {
    height: 250px;
  }

  .camera-toggle-btn {
    min-width: 140px;
  }
}
</style>