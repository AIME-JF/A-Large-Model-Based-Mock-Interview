<template>
  <div class="camera-test-container">
    <!-- 主要内容 -->
    <div class="main-content">
      <a-card class="content-card">
        <!-- 标题区域 -->
        <div class="title-section">
          <h1 class="main-title">
            <VideoCameraOutlined class="title-icon" />
            摄像头功能测试
          </h1>
          <p class="subtitle">测试独立摄像头组件的功能</p>
        </div>

        <!-- 摄像头组件区域 -->
        <div class="camera-section">
          <SimpleCamera ref="cameraRef" />
        </div>

        <!-- 控制按钮 -->
        <div class="controls-section">
          <h3 class="section-title">摄像头控制</h3>
          <div class="control-buttons">
            <a-button
              type="primary"
              @click="enableCamera"
              class="control-button"
              style="background: #52c41a; border-color: #52c41a;"
            >
              <template #icon><PlayCircleOutlined /></template>
              开启摄像头
            </a-button>
            <a-button
              danger
              @click="disableCamera"
              class="control-button"
            >
              <template #icon><PauseCircleOutlined /></template>
              关闭摄像头
            </a-button>
            <a-button
              type="primary"
              @click="toggleCamera"
              class="control-button"
            >
              <template #icon><SwapOutlined /></template>
              切换摄像头
            </a-button>
          </div>
        </div>

        <!-- 状态信息 -->
        <div class="status-section">
          <h3 class="section-title">摄像头状态</h3>
          <div class="status-grid">
            <div class="status-item">
              <span class="status-label">是否开启:</span>
              <a-tag :color="isCameraEnabled ? 'success' : 'default'">
                <template #icon>
                  <CheckCircleOutlined v-if="isCameraEnabled" />
                  <CloseCircleOutlined v-else />
                </template>
                {{ isCameraEnabled ? '是' : '否' }}
              </a-tag>
            </div>
            <div class="status-item">
              <span class="status-label">浏览器支持:</span>
              <a-tag :color="browserSupport ? 'success' : 'error'">
                <template #icon>
                  <CheckCircleOutlined v-if="browserSupport" />
                  <CloseCircleOutlined v-else />
                </template>
                {{ browserSupport ? '是' : '否' }}
              </a-tag>
            </div>
            <div class="status-item">
              <span class="status-label">权限状态:</span>
              <a-tag color="processing">{{ permissionStatus }}</a-tag>
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
import { ref, onMounted } from 'vue';
import SimpleCamera from './SimpleCamera.vue';
import {
  VideoCameraOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
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
/* 容器样式 */
.camera-test-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f5f5f5;
}

/* 主要内容 */
.main-content {
  position: relative;
  width: 100%;
  max-width: 1000px;
}

/* 内容卡片 */
.content-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.content-card :deep(.ant-card-body) {
  padding: 40px;
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1677ff;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 2.5rem;
}

.subtitle {
  font-size: 1.25rem;
  color: #666;
  font-weight: 500;
  margin: 0;
}

/* 摄像头区域 */
.camera-section {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

/* 控制区域 */
.controls-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 24px;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.control-button {
  height: 44px;
  padding: 0 24px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* 状态区域 */
.status-section {
  margin-bottom: 40px;
}

.status-grid {
  background: #f5f5f5;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #f0f0f0;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1rem;
}

/* 返回按钮 */
.back-section {
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .camera-test-container {
    padding: 16px;
  }

  .content-card :deep(.ant-card-body) {
    padding: 24px;
  }

  .main-title {
    font-size: 2rem;
  }

  .control-buttons {
    flex-direction: column;
    align-items: center;
  }

  .control-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .content-card :deep(.ant-card-body) {
    padding: 20px;
  }

  .main-title {
    font-size: 1.75rem;
  }

  .title-icon {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>