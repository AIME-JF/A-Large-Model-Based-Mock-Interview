<template>
  <FullscreenCamera ref="cameraRef">
    <!-- 测试控制面板 -->
    <div class="test-controls">
      <a-card class="control-panel" size="small">
        <h1 class="test-title">
          <VideoCameraOutlined />
          全屏摄像头测试
        </h1>
        <p class="test-subtitle">测试微信风格的全屏摄像头背景</p>

        <div class="control-buttons">
          <a-button
            type="primary"
            block
            @click="enableCamera"
            style="background: #52c41a; border-color: #52c41a;"
          >
            <template #icon><PlayCircleOutlined /></template>
            开启摄像头
          </a-button>
          <a-button
            danger
            block
            @click="disableCamera"
          >
            <template #icon><PauseCircleOutlined /></template>
            关闭摄像头
          </a-button>
          <a-button
            type="primary"
            block
            @click="toggleCamera"
          >
            <template #icon><SwapOutlined /></template>
            切换摄像头
          </a-button>
        </div>

        <div class="status-info">
          <div class="status-item">
            <span class="status-label">摄像头状态:</span>
            <a-tag :color="isCameraEnabled ? 'success' : 'default'" size="small">
              {{ isCameraEnabled ? '已开启' : '已关闭' }}
            </a-tag>
          </div>
          <div class="status-item">
            <span class="status-label">浏览器支持:</span>
            <a-tag :color="browserSupport ? 'success' : 'error'" size="small">
              {{ browserSupport ? '支持' : '不支持' }}
            </a-tag>
          </div>
          <div class="status-item">
            <span class="status-label">权限状态:</span>
            <a-tag color="processing" size="small">{{ permissionStatus }}</a-tag>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 返回按钮 -->
    <a-button
      @click="$emit('go-back')"
      class="back-button"
      shape="round"
    >
      <template #icon><ArrowLeftOutlined /></template>
      返回
    </a-button>
  </FullscreenCamera>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FullscreenCamera from './FullscreenCamera.vue';
import {
  VideoCameraOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SwapOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons-vue';

const emits = defineEmits(['go-back']);

const cameraRef = ref(null);
const isCameraEnabled = ref(false);
const browserSupport = ref(false);
const permissionStatus = ref('未知');

// 检查浏览器支持
const checkBrowserSupport = () => {
  browserSupport.value = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// 检查权限状态
const checkPermissionStatus = async () => {
  try {
    if (!browserSupport.value) {
      permissionStatus.value = '浏览器不支持';
      return;
    }

    const result = await navigator.permissions.query({ name: 'camera' });
    permissionStatus.value = result.state;
  } catch (error) {
    permissionStatus.value = '无法检查权限';
  }
};

// 开启摄像头
const enableCamera = async () => {
  if (cameraRef.value) {
    const success = await cameraRef.value.enableCamera();
    if (success) {
      isCameraEnabled.value = true;
    }
  }
};

// 关闭摄像头
const disableCamera = () => {
  if (cameraRef.value) {
    cameraRef.value.disableCamera();
    isCameraEnabled.value = false;
  }
};

// 切换摄像头
const toggleCamera = () => {
  if (cameraRef.value) {
    cameraRef.value.toggleCamera();
    // 更新状态
    setTimeout(() => {
      isCameraEnabled.value = cameraRef.value.isCameraEnabled();
    }, 100);
  }
};

onMounted(() => {
  checkBrowserSupport();
  checkPermissionStatus();
});
</script>

<style scoped>
/* 测试控制面板样式 */
.test-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  max-width: 400px;
}

.control-panel {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.test-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.test-title :deep(.anticon) {
  color: #1677ff;
}

.test-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  text-align: center;
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.status-info {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 返回按钮样式 */
.back-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-size: 14px;
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-controls {
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
  }

  .test-title {
    font-size: 20px;
  }

  .back-button {
    bottom: 10px;
    left: 10px;
    font-size: 12px;
  }
}
</style>