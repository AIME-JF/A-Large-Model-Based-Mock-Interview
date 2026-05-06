<template>
  <div class="mobile-nav" :class="{ 'nav-open': isNavOpen }">
    <!-- 移动端顶部导航栏 -->
    <div class="mobile-header">
      <div class="header-content">
        <div class="logo-section">
          <AimOutlined class="logo-icon" />
          <h2 class="logo-text">AI面试官</h2>
        </div>

        <button class="menu-toggle" @click="toggleNav">
          <span class="hamburger" :class="{ 'active': isNavOpen }"></span>
        </button>
      </div>
    </div>

    <!-- 移动端侧边栏 -->
    <div class="mobile-sidebar" :class="{ 'sidebar-open': isNavOpen }">
      <div class="sidebar-overlay" @click="closeNav"></div>
      <div class="sidebar-content">
        <div class="user-info">
          <div class="user-avatar"><UserOutlined /></div>
          <div class="user-details">
            <div class="username">{{ currentUser?.username || '用户' }}</div>
            <div class="user-status">{{ currentUser?.isGuest ? '游客模式' : '已登录' }}</div>
          </div>
        </div>

        <nav class="mobile-nav-menu">
          <ul>
            <li :class="{ 'active': currentPage === 'home' }">
              <a @click="navigateTo('home')">
                <HomeOutlined class="nav-icon" />
                <span class="nav-text">首页</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('interview-history')">
                <BarChartOutlined class="nav-icon" />
                <span class="nav-text">面试记录</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('analysis')">
                <LineChartOutlined class="nav-icon" />
                <span class="nav-text">能力分析</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('settings')">
                <SettingOutlined class="nav-icon" />
                <span class="nav-text">设置</span>
              </a>
            </li>
          </ul>
        </nav>

        <div class="sidebar-footer">
          <a-button class="logout-btn" block @click="handleLogout">
            <template #icon><LogoutOutlined /></template>
            退出登录
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import {
  AimOutlined,
  UserOutlined,
  HomeOutlined,
  BarChartOutlined,
  LineChartOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
  currentUser: Object,
  currentPage: String
});

const emits = defineEmits(['navigate', 'logout']);

const isNavOpen = ref(false);

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value;
};

const closeNav = () => {
  isNavOpen.value = false;
};

const navigateTo = (page) => {
  emits('navigate', page);
  closeNav();
};

const handleLogout = () => {
  emits('logout');
  closeNav();
};
</script>

<style scoped>
/* 移动端导航基础样式 */
.mobile-nav {
  position: relative;
  z-index: 1000;
}

/* 移动端顶部导航栏 */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #1677ff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1001;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 1.5rem;
  color: white;
}

.logo-text {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

/* 汉堡菜单按钮 */
.menu-toggle {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger {
  position: relative;
  width: 24px;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger.active {
  background: transparent;
}

.hamburger.active::before {
  top: 0;
  transform: rotate(45deg);
}

.hamburger.active::after {
  bottom: 0;
  transform: rotate(-45deg);
}

/* 移动端侧边栏 */
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  visibility: hidden;
  transition: visibility 0.3s ease;
}

.mobile-sidebar.sidebar-open {
  visibility: visible;
}

.sidebar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-open .sidebar-overlay {
  opacity: 1;
}

.sidebar-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: #ffffff;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  box-shadow: -2px 0 8px rgba(0,0,0,0.06);
}

.sidebar-open .sidebar-content {
  transform: translateX(0);
}

/* 用户信息区域 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: #e6f4ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #1677ff;
}

.user-details {
  flex: 1;
}

.username {
  color: #1a1a1a;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.user-status {
  color: #999;
  font-size: 0.9rem;
}

/* 导航菜单 */
.mobile-nav-menu {
  flex: 1;
  padding: 16px 0;
}

.mobile-nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav-menu li {
  margin-bottom: 4px;
}

.mobile-nav-menu a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.mobile-nav-menu li.active a,
.mobile-nav-menu a:hover {
  background: #e6f4ff;
  color: #1677ff;
}

.nav-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-weight: 500;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  border-radius: 8px;
  color: #666;
  font-size: 1rem;
}

.logout-btn:hover {
  color: #1677ff;
  border-color: #1677ff;
}

/* 响应式设计 */
@media (min-width: 769px) {
  .mobile-nav {
    display: none;
  }
}

@media (max-width: 480px) {
  .sidebar-content {
    width: 100%;
  }
}
</style>