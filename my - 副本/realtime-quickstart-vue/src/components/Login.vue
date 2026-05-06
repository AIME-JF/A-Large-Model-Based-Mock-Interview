<template>
  <div class="login-page">
    <!-- Background decoration -->
    <div class="login-bg">
      <div class="login-bg-circle login-bg-circle-1"></div>
      <div class="login-bg-circle login-bg-circle-2"></div>
      <div class="login-bg-circle login-bg-circle-3"></div>
    </div>

    <div class="login-card">
      <!-- Logo area -->
      <div class="login-logo">
        <div class="login-logo-icon">
          <RobotOutlined style="font-size: 32px; color: #fff" />
        </div>
        <h1 class="login-title">AI 面试官</h1>
        <p class="login-subtitle">智能模拟面试平台</p>
      </div>

      <!-- Form -->
      <a-form
        :model="formData"
        @finish="handleSubmit"
        layout="vertical"
        class="login-form"
      >
        <a-form-item
          name="username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input
            v-model:value="formData.username"
            placeholder="用户名"
            size="large"
            :prefix="h(UserOutlined)"
          />
        </a-form-item>

        <a-form-item
          name="password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="formData.password"
            placeholder="密码"
            size="large"
            :prefix="h(LockOutlined)"
          />
        </a-form-item>

        <a-form-item
          v-if="isRegisterMode"
          name="confirmPassword"
          :rules="[{ required: true, message: '请确认密码' }]"
        >
          <a-input-password
            v-model:value="formData.confirmPassword"
            placeholder="确认密码"
            size="large"
            :prefix="h(LockOutlined)"
          />
        </a-form-item>

        <a-form-item
          v-if="isRegisterMode"
          name="email"
          :rules="[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱格式' }]"
        >
          <a-input
            v-model:value="formData.email"
            placeholder="邮箱地址"
            size="large"
            :prefix="h(MailOutlined)"
          />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="isLoading"
            block
            size="large"
            class="login-submit-btn"
          >
            {{ isRegisterMode ? '注册' : '登录' }}
          </a-button>
        </a-form-item>
      </a-form>

      <!-- Switch mode -->
      <div class="login-switch">
        <span class="login-switch-text">{{ isRegisterMode ? '已有账户？' : '还没有账户？' }}</span>
        <a class="login-switch-link" @click="toggleMode">
          {{ isRegisterMode ? '立即登录' : '立即注册' }}
        </a>
      </div>

      <!-- Divider -->
      <a-divider class="login-divider">
        <span class="login-divider-text">或</span>
      </a-divider>

      <!-- Guest login -->
      <a-button
        block
        size="large"
        :loading="isLoading"
        class="login-guest-btn"
        @click="handleGuestLogin"
      >
        <TeamOutlined />
        游客体验
      </a-button>

      <!-- Copyright -->
      <p class="login-copyright">
        &copy; 2024 AI面试官系统. All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, h } from 'vue';
import { message } from 'ant-design-vue';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  RobotOutlined,
  TeamOutlined,
} from '@ant-design/icons-vue';

const emits = defineEmits(['login-success']);

const isRegisterMode = ref(false);
const isLoading = ref(false);

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
});

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  };
};

const handleSubmit = async () => {
  if (isLoading.value) return;

  if (!formData.value.username || !formData.value.password) {
    message.error('请填写用户名和密码');
    return;
  }

  if (isRegisterMode.value) {
    if (formData.value.password !== formData.value.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    if (!formData.value.email) {
      message.error('请填写邮箱地址');
      return;
    }
  }

  isLoading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isRegisterMode.value) {
      message.success('注册成功！请登录');
      toggleMode();
    } else {
      const userData = {
        username: formData.value.username,
        userId: 'user_' + Date.now(),
        loginTime: new Date().toISOString()
      };

      message.success('登录成功！');
      emits('login-success', userData);
    }
  } catch (error) {
    message.error(isRegisterMode.value ? '注册失败，请重试' : '登录失败，请检查用户名和密码');
  } finally {
    isLoading.value = false;
  }
};

const handleGuestLogin = async () => {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const guestData = {
      username: '游客用户',
      userId: 'guest_' + Date.now(),
      loginTime: new Date().toISOString(),
      isGuest: true
    };

    message.success('游客登录成功！');
    emits('login-success', guestData);
  } catch (error) {
    message.error('游客登录失败，请重试');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

/* Background circles */
.login-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.login-bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.login-bg-circle-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -100px;
}

.login-bg-circle-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -80px;
}

.login-bg-circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.03);
}

/* Card */
.login-card {
  position: relative;
  width: 420px;
  padding: 40px 36px 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

/* Logo */
.login-logo {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #1677ff, #69b1ff);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(22, 119, 255, 0.3);
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f1f1f;
  margin: 0 0 4px;
}

.login-subtitle {
  font-size: 14px;
  color: #8c8c8c;
  margin: 0;
}

/* Form */
.login-form {
  margin-bottom: 0;
}

.login-form :deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
  padding: 8px 12px;
}

.login-form :deep(.ant-form-item) {
  margin-bottom: 20px;
}

.login-submit-btn {
  height: 44px !important;
  border-radius: 8px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}

/* Switch mode */
.login-switch {
  text-align: center;
  margin-bottom: 16px;
}

.login-switch-text {
  color: #8c8c8c;
  font-size: 14px;
}

.login-switch-link {
  color: #1677ff;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
}

.login-switch-link:hover {
  color: #4096ff;
}

/* Divider */
.login-divider {
  margin: 16px 0 !important;
}

.login-divider-text {
  color: #bfbfbf;
  font-size: 12px;
}

/* Guest btn */
.login-guest-btn {
  height: 44px !important;
  border-radius: 8px !important;
  font-size: 14px !important;
  color: #595959 !important;
  border-color: #d9d9d9 !important;
}

.login-guest-btn:hover {
  color: #1677ff !important;
  border-color: #1677ff !important;
}

/* Copyright */
.login-copyright {
  text-align: center;
  margin: 24px 0 0;
  font-size: 12px;
  color: #bfbfbf;
}

/* Responsive */
@media (max-width: 480px) {
  .login-card {
    width: 92%;
    padding: 32px 24px 24px;
  }

  .login-title {
    font-size: 20px;
  }
}
</style>
