<template>
  <div class="settings-container">
    <!-- 页面头部 -->
    <a-card class="page-header-card">
      <div class="page-header">
        <div class="header-left">
          <a-button @click="$emit('go-back')" style="margin-bottom: 16px;">
            <template #icon><ArrowLeftOutlined /></template>
            返回首页
          </a-button>
          <h1 class="page-title"><SettingOutlined /> 系统设置</h1>
          <div class="breadcrumb">首页 / 设置</div>
        </div>
        <div class="header-right">
          <a-button type="primary" @click="saveAllSettings" :disabled="!hasUnsavedChanges">
            <template #icon><SaveOutlined /></template>
            保存所有设置
          </a-button>
        </div>
      </div>
    </a-card>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 个人信息设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title"><UserOutlined /> 个人信息</h2>
          <div class="section-description">管理您的个人资料和基本信息</div>
        </div>

        <a-card class="settings-card">
          <div class="profile-section">
            <div class="avatar-section">
              <div class="avatar-container">
                <a-avatar
                  :src="userProfile.avatar || '/default-avatar.png'"
                  :size="120"
                  @error="handleAvatarError"
                >
                  <template #icon><UserOutlined /></template>
                </a-avatar>
                <a-button
                  type="primary"
                  shape="circle"
                  class="avatar-upload-btn"
                  @click="triggerAvatarUpload"
                >
                  <template #icon><CameraOutlined /></template>
                </a-button>
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  @change="handleAvatarUpload"
                  style="display: none;"
                >
              </div>
            </div>

            <div class="profile-form">
              <a-form layout="vertical">
                <a-form-item label="姓名">
                  <a-input
                    v-model:value="userProfile.name"
                    placeholder="请输入您的姓名"
                    @input="markAsChanged"
                  />
                </a-form-item>

                <a-form-item label="邮箱">
                  <a-input
                    v-model:value="userProfile.email"
                    placeholder="请输入您的邮箱"
                    @input="markAsChanged"
                  />
                </a-form-item>

                <a-form-item label="职位">
                  <a-input
                    v-model:value="userProfile.position"
                    placeholder="请输入您的职位"
                    @input="markAsChanged"
                  />
                </a-form-item>

                <a-form-item label="公司">
                  <a-input
                    v-model:value="userProfile.company"
                    placeholder="请输入您的公司"
                    @input="markAsChanged"
                  />
                </a-form-item>

                <a-form-item label="个人简介">
                  <a-textarea
                    v-model:value="userProfile.bio"
                    placeholder="请输入个人简介"
                    :rows="3"
                    @input="markAsChanged"
                  />
                </a-form-item>
              </a-form>
            </div>
          </div>
        </a-card>
      </div>

      <a-divider />

      <!-- 面试设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title"><AimOutlined /> 面试设置</h2>
          <div class="section-description">配置面试相关的参数和偏好</div>
        </div>

        <a-card class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">默认面试时长</h3>
              <div class="setting-description">设置每次面试的默认时长</div>
            </div>
            <div class="setting-control">
              <a-select v-model:value="interviewSettings.defaultDuration" @change="markAsChanged" style="width: 140px;">
                <a-select-option :value="15">15分钟</a-select-option>
                <a-select-option :value="30">30分钟</a-select-option>
                <a-select-option :value="45">45分钟</a-select-option>
                <a-select-option :value="60">60分钟</a-select-option>
              </a-select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">面试难度</h3>
              <div class="setting-description">选择面试题目的默认难度级别</div>
            </div>
            <div class="setting-control">
              <a-radio-group v-model:value="interviewSettings.difficulty" @change="markAsChanged">
                <a-radio value="easy">简单</a-radio>
                <a-radio value="medium">中等</a-radio>
                <a-radio value="hard">困难</a-radio>
              </a-radio-group>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">自动录音</h3>
              <div class="setting-description">面试过程中自动录制音频</div>
            </div>
            <div class="setting-control">
              <a-switch
                v-model:checked="interviewSettings.autoRecord"
                @change="markAsChanged"
              />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">实时反馈</h3>
              <div class="setting-description">面试过程中显示实时评分和建议</div>
            </div>
            <div class="setting-control">
              <a-switch
                v-model:checked="interviewSettings.realtimeFeedback"
                @change="markAsChanged"
              />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">面试提醒</h3>
              <div class="setting-description">在面试开始前发送提醒通知</div>
            </div>
            <div class="setting-control">
              <a-select v-model:value="interviewSettings.reminderTime" @change="markAsChanged" style="width: 140px;">
                <a-select-option :value="0">不提醒</a-select-option>
                <a-select-option :value="5">5分钟前</a-select-option>
                <a-select-option :value="10">10分钟前</a-select-option>
                <a-select-option :value="15">15分钟前</a-select-option>
                <a-select-option :value="30">30分钟前</a-select-option>
              </a-select>
            </div>
          </div>
        </a-card>
      </div>

      <a-divider />

      <!-- 系统偏好设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title"><BgColorsOutlined /> 系统偏好</h2>
          <div class="section-description">个性化您的使用体验</div>
        </div>

        <a-card class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">主题模式</h3>
              <div class="setting-description">选择您喜欢的界面主题</div>
            </div>
            <div class="setting-control">
              <div class="theme-selector">
                <a-button
                  v-for="theme in themes"
                  :key="theme.value"
                  :type="systemSettings.theme === theme.value ? 'primary' : 'default'"
                  @click="selectTheme(theme.value)"
                >
                  <template #icon><component :is="theme.iconComponent" /></template>
                  {{ theme.name }}
                </a-button>
              </div>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">语言设置</h3>
              <div class="setting-description">选择界面显示语言</div>
            </div>
            <div class="setting-control">
              <a-select v-model:value="systemSettings.language" @change="markAsChanged" style="width: 140px;">
                <a-select-option value="zh-CN">简体中文</a-select-option>
                <a-select-option value="zh-TW">繁體中文</a-select-option>
                <a-select-option value="en-US">English</a-select-option>
                <a-select-option value="ja-JP">日本語</a-select-option>
              </a-select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">音效设置</h3>
              <div class="setting-description">启用或关闭系统音效</div>
            </div>
            <div class="setting-control">
              <a-switch
                v-model:checked="systemSettings.soundEnabled"
                @change="markAsChanged"
              />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">动画效果</h3>
              <div class="setting-description">启用或关闭界面动画效果</div>
            </div>
            <div class="setting-control">
              <a-switch
                v-model:checked="systemSettings.animationEnabled"
                @change="markAsChanged"
              />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">自动保存</h3>
              <div class="setting-description">自动保存面试记录和设置</div>
            </div>
            <div class="setting-control">
              <a-switch
                v-model:checked="systemSettings.autoSave"
                @change="markAsChanged"
              />
            </div>
          </div>
        </a-card>
      </div>

      <a-divider />

      <!-- 隐私与安全 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title"><LockOutlined /> 隐私与安全</h2>
          <div class="section-description">管理您的隐私和数据安全设置</div>
        </div>

        <a-card class="settings-card">
          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">数据收集</h3>
              <div class="setting-description">允许收集匿名使用数据以改进服务</div>
            </div>
            <div class="setting-control">
              <a-switch
                v-model:checked="privacySettings.dataCollection"
                @change="markAsChanged"
              />
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">面试录音保存</h3>
              <div class="setting-description">设置面试录音的保存时长</div>
            </div>
            <div class="setting-control">
              <a-select v-model:value="privacySettings.recordingRetention" @change="markAsChanged" style="width: 140px;">
                <a-select-option :value="7">7天</a-select-option>
                <a-select-option :value="30">30天</a-select-option>
                <a-select-option :value="90">90天</a-select-option>
                <a-select-option :value="365">1年</a-select-option>
                <a-select-option :value="-1">永久保存</a-select-option>
              </a-select>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3 class="setting-name">密码保护</h3>
              <div class="setting-description">启用密码保护以增强安全性</div>
            </div>
            <div class="setting-control">
              <a-switch
                v-model:checked="privacySettings.passwordProtection"
                @change="markAsChanged"
              />
            </div>
          </div>

          <div class="setting-item danger-item">
            <div class="setting-info">
              <h3 class="setting-name">清除所有数据</h3>
              <div class="setting-description">删除所有面试记录和个人数据（不可恢复）</div>
            </div>
            <div class="setting-control">
              <a-button danger @click="showClearDataDialog">
                <template #icon><DeleteOutlined /></template>
                清除数据
              </a-button>
            </div>
          </div>
        </a-card>
      </div>

      <a-divider />

      <!-- 关于信息 -->
      <div class="settings-section">
        <div class="section-header">
          <h2 class="section-title"><InfoCircleOutlined /> 关于</h2>
          <div class="section-description">应用信息和帮助</div>
        </div>

        <a-card class="settings-card">
          <div class="about-content">
            <div class="app-info">
              <div class="app-icon-wrap">
                <RobotOutlined class="app-icon" />
              </div>
              <div class="app-details">
                <h3 class="app-name">AI面试助手</h3>
                <div class="app-version">版本 {{ appInfo.version }}</div>
                <div class="app-description">{{ appInfo.description }}</div>
              </div>
            </div>

            <div class="about-links">
              <a href="#" class="about-link" @click.prevent="openHelp">
                <BookOutlined /> 使用帮助
              </a>
              <a href="#" class="about-link" @click.prevent="openPrivacyPolicy">
                <LockOutlined /> 隐私政策
              </a>
              <a href="#" class="about-link" @click.prevent="openTerms">
                <FileTextOutlined /> 服务条款
              </a>
              <a href="#" class="about-link" @click.prevent="checkUpdates">
                <SyncOutlined /> 检查更新
              </a>
            </div>
          </div>
        </a-card>
      </div>
    </div>

    <!-- 确认对话框 -->
    <div v-if="showDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3 class="dialog-title">{{ dialogTitle }}</h3>
          <a-button type="text" @click="closeDialog" size="small">
            <template #icon><CloseOutlined /></template>
          </a-button>
        </div>
        <div class="dialog-body">
          <p>{{ dialogMessage }}</p>
        </div>
        <div class="dialog-footer">
          <a-button @click="closeDialog">
            取消
          </a-button>
          <a-button danger type="primary" @click="confirmDialog">
            确认
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, markRaw } from 'vue';
import {
  SettingOutlined,
  UserOutlined,
  CameraOutlined,
  AimOutlined,
  BgColorsOutlined,
  LockOutlined,
  InfoCircleOutlined,
  RobotOutlined,
  BookOutlined,
  SyncOutlined,
  DeleteOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  FileTextOutlined
} from '@ant-design/icons-vue';

defineEmits(['go-back']);

// 响应式数据
const hasUnsavedChanges = ref(false);
const showDialog = ref(false);
const dialogTitle = ref('');
const dialogMessage = ref('');
const dialogAction = ref(null);

// 用户资料
const userProfile = ref({
  name: '张三',
  email: 'zhangsan@example.com',
  position: '前端工程师',
  company: '科技有限公司',
  bio: '热爱技术，专注于前端开发和用户体验设计。',
  avatar: ''
});

// 面试设置
const interviewSettings = ref({
  defaultDuration: 30,
  difficulty: 'medium',
  autoRecord: true,
  realtimeFeedback: true,
  reminderTime: 10
});

// 系统设置
const systemSettings = ref({
  theme: 'light',
  language: 'zh-CN',
  soundEnabled: true,
  animationEnabled: true,
  autoSave: true
});

// 隐私设置
const privacySettings = ref({
  dataCollection: true,
  recordingRetention: 30,
  passwordProtection: false
});

// 应用信息
const appInfo = ref({
  version: '1.0.0',
  description: '基于AI技术的智能面试练习平台，帮助您提升面试技能和表现。'
});

// 主题选项
const themes = ref([
  { value: 'light', name: '浅色', iconComponent: markRaw(SettingOutlined) },
  { value: 'dark', name: '深色', iconComponent: markRaw(SettingOutlined) },
  { value: 'auto', name: '自动', iconComponent: markRaw(SyncOutlined) }
]);

// 头像输入引用
const avatarInput = ref(null);

// 方法
const markAsChanged = () => {
  hasUnsavedChanges.value = true;
};

const saveAllSettings = () => {
  hasUnsavedChanges.value = false;
  showSuccessMessage('设置已保存');
};

const selectTheme = (theme) => {
  systemSettings.value.theme = theme;
  markAsChanged();
  applyTheme(theme);
};

const applyTheme = (theme) => {
};

const triggerAvatarUpload = () => {
  avatarInput.value?.click();
};

const handleAvatarUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      userProfile.value.avatar = e.target.result;
      markAsChanged();
    };
    reader.readAsDataURL(file);
  }
};

const handleAvatarError = () => {
  userProfile.value.avatar = '';
};

const showClearDataDialog = () => {
  dialogTitle.value = '清除所有数据';
  dialogMessage.value = '此操作将永久删除所有面试记录和个人数据，且无法恢复。您确定要继续吗？';
  dialogAction.value = clearAllData;
  showDialog.value = true;
};

const clearAllData = () => {
  showSuccessMessage('数据已清除');
};

const closeDialog = () => {
  showDialog.value = false;
  dialogAction.value = null;
};

const confirmDialog = () => {
  if (dialogAction.value) {
    dialogAction.value();
  }
  closeDialog();
};

const openHelp = () => {
};

const openPrivacyPolicy = () => {
};

const openTerms = () => {
};

const checkUpdates = () => {
  showSuccessMessage('当前已是最新版本');
};

const showSuccessMessage = (message) => {
};
</script>

<style scoped>
.settings-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

/* 页面头部 */
.page-header-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.breadcrumb {
  color: #999;
  font-size: 0.9rem;
}

.header-right {
  display: flex;
  align-items: center;
}

/* 设置内容 */
.settings-content {
  max-width: 800px;
  margin: 0 auto;
}

.settings-section {
  margin-bottom: 16px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.section-description {
  color: #666;
  font-size: 0.9rem;
}

.settings-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

/* 个人资料 */
.profile-section {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 24px;
  align-items: start;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-container {
  position: relative;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  border: 2px solid #ffffff;
}

.profile-form {
  display: flex;
  flex-direction: column;
}

/* 设置项 */
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  flex: 1;
  margin-right: 24px;
}

.setting-name {
  font-size: 1rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.setting-description {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.setting-control {
  flex-shrink: 0;
}

/* 主题选择器 */
.theme-selector {
  display: flex;
  gap: 8px;
}

/* 危险操作 */
.danger-item {
  background: #fff2f0;
  border-radius: 12px;
  padding: 16px 24px;
  margin: 16px 0;
}

/* 关于信息 */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-icon-wrap {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6f4ff;
  border-radius: 16px;
}

.app-icon {
  font-size: 2.5rem;
  color: #1677ff;
}

.app-details {
  flex: 1;
}

.app-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.app-version {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.app-description {
  color: #1a1a1a;
  line-height: 1.5;
}

.about-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.about-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f5f5f5;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  color: #1a1a1a;
  text-decoration: none;
  transition: all 0.3s ease;
}

.about-link:hover {
  background: #e6f4ff;
  color: #1677ff;
  border-color: #1677ff;
}

/* 对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background: #ffffff;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0;
}

.dialog-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.dialog-body {
  padding: 16px 24px;
}

.dialog-body p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px;
  justify-content: flex-end;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .profile-section {
    grid-template-columns: 1fr;
    gap: 16px;
    text-align: center;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .setting-info {
    margin-right: 0;
  }

  .theme-selector {
    width: 100%;
    justify-content: space-between;
  }

  .about-links {
    grid-template-columns: 1fr;
  }
}
</style>
