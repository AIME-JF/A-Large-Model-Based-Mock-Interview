<template>
  <div class="app-root">
    <!-- Login page (no sidebar) -->
    <Login v-if="!isLoggedIn" @login-success="handleLoginSuccess" />

    <!-- Main app with sidebar layout -->
    <a-layout v-else class="app-layout">
      <!-- Mobile navigation -->
      <MobileNavigation
        v-if="isMobile && isLoggedIn"
        :current-user="currentUser"
        :current-page="currentPage"
        @navigate="handleMobileNavigate"
        @logout="handleMobileLogout"
      />

      <!-- Desktop Sidebar (hidden during fullscreen interview) -->
      <a-layout-sider
        v-if="!isMobile && currentPage !== 'interview'"
        v-model:collapsed="sidebarCollapsed"
        :trigger="null"
        collapsible
        :width="240"
        :collapsed-width="72"
        class="app-sidebar"
        theme="light"
      >
        <!-- Logo -->
        <div class="sidebar-logo" @click="handleGoHome">
          <div class="sidebar-logo-icon">
            <RobotOutlined />
          </div>
          <transition name="fade">
            <span v-if="!sidebarCollapsed" class="sidebar-logo-text">AI 面试官</span>
          </transition>
        </div>

        <!-- Navigation Menu -->
        <a-menu
          v-model:selectedKeys="selectedMenuKeys"
          mode="inline"
          class="sidebar-menu"
          @click="handleMenuClick"
        >
          <a-menu-item key="home">
            <template #icon><HomeOutlined /></template>
            <span>首页</span>
          </a-menu-item>
          <a-menu-item key="interview-records">
            <template #icon><FileTextOutlined /></template>
            <span>面试记录</span>
          </a-menu-item>
          <a-menu-item key="ability-analysis">
            <template #icon><BarChartOutlined /></template>
            <span>能力分析</span>
          </a-menu-item>
          <a-menu-item key="settings">
            <template #icon><SettingOutlined /></template>
            <span>系统设置</span>
          </a-menu-item>
        </a-menu>

        <!-- Collapse toggle at bottom -->
        <div class="sidebar-footer">
          <a-button
            type="text"
            class="collapse-btn"
            @click="sidebarCollapsed = !sidebarCollapsed"
          >
            <MenuUnfoldOutlined v-if="sidebarCollapsed" />
            <MenuFoldOutlined v-else />
          </a-button>
        </div>
      </a-layout-sider>

      <!-- Main content area -->
      <a-layout class="app-main-layout">
        <!-- Header bar (desktop only, hidden during fullscreen interview) -->
        <a-layout-header v-if="!isMobile && currentPage !== 'interview'" class="app-header">
          <div class="header-left">
            <a-breadcrumb class="header-breadcrumb">
              <a-breadcrumb-item>
                <HomeOutlined />
                <span>首页</span>
              </a-breadcrumb-item>
              <a-breadcrumb-item v-if="currentPage !== 'home'">
                {{ getPageTitle(currentPage) }}
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
          <div class="header-right">
            <a-space :size="16">
              <a-tooltip title="通知">
                <a-badge :count="3" :offset="[-2, 2]">
                  <a-button type="text" shape="circle" class="header-icon-btn">
                    <BellOutlined />
                  </a-button>
                </a-badge>
              </a-tooltip>
              <a-dropdown>
                <div class="header-user-info">
                  <a-avatar class="header-avatar" :size="32">
                    <template #icon><UserOutlined /></template>
                  </a-avatar>
                  <span class="header-username">{{ currentUser?.username || '用户' }}</span>
                </div>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="profile" @click="currentPage = 'settings'">
                      <UserOutlined />
                      <span style="margin-left: 8px">个人设置</span>
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item key="logout" @click="handleLogout">
                      <LogoutOutlined />
                      <span style="margin-left: 8px">退出登录</span>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </div>
        </a-layout-header>

        <!-- Page content -->
        <a-layout-content :class="['app-content', { 'app-content--fullscreen': currentPage === 'interview' }]">
          <div :class="['content-wrapper', { 'content-wrapper--fullscreen': currentPage === 'interview' }]">
            <!-- Mobile Home -->
            <MobileHome
              v-if="currentPage === 'home' && isMobile"
              @start-interview="handleStartInterview"
              @test-analysis="currentPage = 'test'"
              @camera-test="currentPage = 'camera-test'"
              @conversation-test="currentPage = 'conversation-test'"
              @navigate-to-page="handleNavigateToPage"
              :user-id="userId"
              :activities="activities"
            />

            <!-- Desktop Home -->
            <Home
              v-else-if="currentPage === 'home' && !isMobile"
              @start-interview="handleStartInterview"
              @test-analysis="currentPage = 'test'"
              @camera-test="currentPage = 'camera-test'"
              @fullscreen-camera-test="currentPage = 'fullscreen-camera-test'"
              @conversation-test="currentPage = 'conversation-test'"
              @navigate-to-page="handleNavigateToPage"
              :user-id="userId"
            />

            <!-- Interview Records -->
            <InterviewRecords
              v-else-if="currentPage === 'interview-records'"
              :is-mobile="isMobile"
              @go-back="() => currentPage = 'home'"
            />

            <!-- Ability Analysis -->
            <AbilityAnalysis
              v-else-if="currentPage === 'ability-analysis'"
              :is-mobile="isMobile"
              @go-back="() => currentPage = 'home'"
            />

            <!-- Settings -->
            <Settings
              v-else-if="currentPage === 'settings'"
              :is-mobile="isMobile"
              @go-back="() => currentPage = 'home'"
            />

            <!-- Interview -->
            <RealtimeInterview
              v-else-if="currentPage === 'interview'"
              :selected-domain-name="selectedDomainName"
              :selected-role="selectedRole"
              :is-mobile="isMobile"
              @go-home="handleGoHome"
              @analysis-complete="handleAnalysisComplete"
            />

            <!-- Report -->
            <Report
              v-else-if="currentPage === 'report'"
              :feedback-data="feedbackData"
              :selected-domain-name="selectedDomainName"
              :selected-role="selectedRole"
              :radar-chart-scores="radarChartScores"
              :radar-chart-labels="radarChartLabels"
              :is-mobile="isMobile"
              @view-recommendations="currentPage = 'recommendations'"
              @go-home="handleGoHome"
            />

            <!-- Recommendations -->
            <Recommendations
              v-else-if="currentPage === 'recommendations'"
              :learning-recs="learningRecs"
              :category-labels="categoryLabels"
              :is-mobile="isMobile"
              @go-home="handleGoHome"
            />

            <!-- Test pages -->
            <TestAnalysis
              v-else-if="currentPage === 'test'"
              :is-mobile="isMobile"
              @go-back="currentPage = 'home'"
            />

            <CameraTest
              v-else-if="currentPage === 'camera-test'"
              :is-mobile="isMobile"
              @go-back="currentPage = 'home'"
            />

            <FullscreenCameraTest
              v-else-if="currentPage === 'fullscreen-camera-test' && !isMobile"
              @go-back="currentPage = 'home'"
            />

            <ConversationTest
              v-else-if="currentPage === 'conversation-test'"
              :is-mobile="isMobile"
              @go-back="currentPage = 'home'"
            />
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import { message } from 'ant-design-vue';
import { onAuthStateChanged } from 'firebase/auth';
import {
  HomeOutlined,
  FileTextOutlined,
  BarChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  RobotOutlined,
} from '@ant-design/icons-vue';

// Import child components
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import MobileHome from './components/MobileHome.vue';
import MobileNavigation from './components/MobileNavigation.vue';
import RealtimeInterview from './components/RealtimeInterview.vue';
import Report from './components/Report.vue';
import Recommendations from './components/Recommendations.vue';
import TestAnalysis from './components/TestAnalysis.vue';
import CameraTest from './components/CameraTest.vue';
import FullscreenCameraTest from './components/FullscreenCameraTest.vue';
import ConversationTest from './components/ConversationTest.vue';
import InterviewRecords from './components/InterviewRecords.vue';
import AbilityAnalysis from './components/AbilityAnalysis.vue';
import Settings from './components/Settings.vue';

// Import mock data and utility functions
import {
  mockInterviewDomains,
  mockFeedbackReport,
  mockLearningRecommendations,
  categoryLabels,
  radarChartLabels,
  simulateApiCall,
} from './utils/mockData';
import { initializeFirebase, signInAnonymouslyToFirebase, addInterviewHistory } from './utils/realtimeService';

const getEnv = (key) => process.env[key] || '';

const firebaseConfig = {
  apiKey: getEnv('VUE_APP_FIREBASE_API_KEY'),
  authDomain: getEnv('VUE_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VUE_APP_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VUE_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VUE_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VUE_APP_FIREBASE_APP_ID'),
  measurementId: getEnv('VUE_APP_FIREBASE_MEASUREMENT_ID'),
};

// Sidebar
const sidebarCollapsed = ref(false);
const selectedMenuKeys = ref(['home']);

// Global responsive state
const currentPage = ref('home');
const selectedDomain = ref(null);
const selectedRole = ref(null);
const interviewHistory = ref([]);
const isLoading = ref(false);
const feedbackData = ref(null);
const learningRecs = ref([]);
const userId = ref(null);
const dbInstance = ref(null);
const authInstance = ref(null);
const isAuthReady = ref(false);

// Login state
const isLoggedIn = ref(false);
const currentUser = ref(null);

// Mobile detection
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};
const handleResize = () => {
  checkMobile();
};

// Activity data (for mobile home)
const activities = ref([
  { id: 1, icon: 'LaptopOutlined', text: '完成了技术面试', time: '2小时前' },
  { id: 2, icon: 'BarChartOutlined', text: '查看了分析报告', time: '4小时前' },
  { id: 3, icon: 'AimOutlined', text: '开始了HR面试', time: '1天前' },
  { id: 4, icon: 'RiseOutlined', text: '提升了面试技能', time: '2天前' },
  { id: 5, icon: 'TrophyOutlined', text: '获得了优秀评分', time: '3天前' },
  { id: 6, icon: 'FileTextOutlined', text: '上传了新简历', time: '5天前' },
  { id: 7, icon: 'BulbOutlined', text: '学习了面试技巧', time: '1周前' },
  { id: 8, icon: 'SearchOutlined', text: '分析了面试表现', time: '1周前' }
]);

// Check saved login status
const checkLoginStatus = () => {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    try {
      const userData = JSON.parse(savedUser);
      currentUser.value = userData;
      userId.value = userData.userId;
      isLoggedIn.value = true;
    } catch {
      localStorage.removeItem('currentUser');
    }
  }
};

// --- Computed Properties ---
const selectedDomainName = computed(() => mockInterviewDomains.find(d => d.id === selectedDomain.value)?.name);
const radarChartScores = ref([]);

const updateRadarChartScores = (scores) => {
  radarChartScores.value = scores;
};

// Page title mapping
const getPageTitle = (page) => {
  const titleMap = {
    'home': '首页',
    'interview-records': '面试记录',
    'ability-analysis': '能力分析',
    'settings': '系统设置',
    'interview': '模拟面试',
    'report': '面试报告',
    'recommendations': '学习推荐',
    'test': '功能测试',
    'camera-test': '摄像头测试',
    'fullscreen-camera-test': '全屏摄像头',
    'conversation-test': '对话测试',
  };
  return titleMap[page] || page;
};

// Sync sidebar menu with current page
watch(currentPage, (newPage) => {
  const menuPages = ['home', 'interview-records', 'ability-analysis', 'settings'];
  if (menuPages.includes(newPage)) {
    selectedMenuKeys.value = [newPage];
  }
});

// Menu click handler
const handleMenuClick = ({ key }) => {
  currentPage.value = key;
};

// --- Methods ---
const handleStartInterview = (domainId, role) => {
  selectedDomain.value = domainId;
  selectedRole.value = role;
  interviewHistory.value = [];
  currentPage.value = 'interview';
};

const handleAnalysisComplete = async (analysisResult) => {
  try {
    isLoading.value = true;

    const feedback = analysisResult?.feedbackData || {};
    const scores = analysisResult?.radarChartScores || [];
    const recommendations = analysisResult?.learningRecommendations || {};

    feedbackData.value = feedback;
    learningRecs.value = recommendations;
    updateRadarChartScores(scores);

    if (isAuthReady.value && dbInstance.value && userId.value) {
      try {
        await addInterviewHistory(dbInstance.value, 'interview-app', userId.value, {
          domain: selectedDomain.value,
          role: selectedRole.value,
          timestamp: new Date().toISOString(),
          feedback,
          scores,
          recommendations
        });
      } catch {
        // Firebase save failed silently - non-critical
      }
    }

    await nextTick();
    currentPage.value = 'report';

    setTimeout(() => {
      if (currentPage.value !== 'report') {
        currentPage.value = 'report';
      }
    }, 100);

  } catch (error) {
    message.error('处理分析结果失败：' + error.message);
  } finally {
    isLoading.value = false;
  }
};

const handleGoHome = () => {
  currentPage.value = 'home';
  selectedDomain.value = null;
  selectedRole.value = null;
  interviewHistory.value = [];
  isLoading.value = false;
  feedbackData.value = null;
  learningRecs.value = [];
  radarChartScores.value = [];
};

const handleLoginSuccess = (userData) => {
  currentUser.value = userData;
  userId.value = userData.userId;
  isLoggedIn.value = true;
  localStorage.setItem('currentUser', JSON.stringify(userData));
  message.success(`欢迎${userData.isGuest ? '游客' : userData.username}！`);
};

const handleLogout = () => {
  currentUser.value = null;
  userId.value = null;
  isLoggedIn.value = false;
  localStorage.removeItem('currentUser');
  handleGoHome();
  message.success('已退出登录');
};

const handleMobileNavigate = (page) => {
  currentPage.value = page;
};

const handleMobileLogout = () => {
  handleLogout();
};

const handleNavigateToPage = (pageName) => {
  currentPage.value = pageName;
};

onMounted(async () => {
  checkLoginStatus();
  checkMobile();
  window.addEventListener('resize', handleResize);

  try {
    const { auth, db } = initializeFirebase(firebaseConfig);
    authInstance.value = auth;
    dbInstance.value = db;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        userId.value = user.uid;
        isAuthReady.value = true;
      } else {
        signInAnonymouslyToFirebase(auth).then(userCred => {
          userId.value = userCred.user.uid;
          isAuthReady.value = true;
        }).catch(() => {
          userId.value = 'user_' + Math.random().toString(36).substr(2, 9);
          isAuthReady.value = true;
        });
      }
    });
  } catch {
    userId.value = 'user_' + Math.random().toString(36).substr(2, 9);
    isAuthReady.value = true;
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
/* ========== Global Reset & Base ========== */
:root {
  --primary-color: #1677ff;
  --primary-hover: #4096ff;
  --primary-bg: #e6f4ff;
  --sidebar-bg: #fff;
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 72px;
  --header-height: 56px;
  --content-bg: #f0f2f5;
  --card-radius: 12px;
  --text-primary: #1f1f1f;
  --text-secondary: #8c8c8c;
  --border-color: #f0f0f0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--content-bg);
}

/* ========== App Layout ========== */
.app-root {
  min-height: 100vh;
}

.app-layout {
  min-height: 100vh;
}

/* ========== Sidebar ========== */
.app-sidebar {
  background: var(--sidebar-bg) !important;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  position: fixed !important;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
}

.app-sidebar .ant-layout-sider-children {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  cursor: pointer;
  border-bottom: 1px solid var(--border-color);
  height: 64px;
  flex-shrink: 0;
}

.sidebar-logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary-color), #69b1ff);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}

.sidebar-logo-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  border-right: none !important;
  padding: 8px;
}

.sidebar-menu .ant-menu-item {
  border-radius: 8px !important;
  margin-bottom: 4px !important;
  height: 44px !important;
  line-height: 44px !important;
}

.sidebar-menu .ant-menu-item-selected {
  background: var(--primary-bg) !important;
  color: var(--primary-color) !important;
  font-weight: 600;
}

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}

.collapse-btn {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary) !important;
  font-size: 16px;
}

/* ========== Header ========== */
.app-header {
  background: #fff !important;
  padding: 0 24px !important;
  height: var(--header-height) !important;
  line-height: var(--header-height) !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-breadcrumb {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
}

.header-icon-btn {
  color: var(--text-secondary) !important;
  font-size: 18px !important;
}

.header-user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.header-user-info:hover {
  background: #f5f5f5;
}

.header-avatar {
  background: linear-gradient(135deg, var(--primary-color), #69b1ff) !important;
}

.header-username {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

/* ========== Content Area ========== */
.app-main-layout {
  margin-left: var(--sidebar-width);
  transition: margin-left 0.2s;
  min-height: 100vh;
}

.app-content {
  background: var(--content-bg);
  min-height: calc(100vh - var(--header-height));
}

/* Fullscreen interview mode - remove all padding/constraints */
.app-content--fullscreen {
  padding: 0 !important;
  min-height: 100vh;
  background: #000;
}

.content-wrapper--fullscreen {
  padding: 0 !important;
  max-width: 100% !important;
  margin: 0 !important;
  height: 100vh;
}

.content-wrapper {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ========== Transitions ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========== Mobile ========== */
@media (max-width: 768px) {
  .app-main-layout {
    margin-left: 0 !important;
  }

  .content-wrapper {
    padding: 16px;
  }

  .app-header {
    display: none !important;
  }
}

/* ========== Ant Design Overrides ========== */
.ant-layout-sider-collapsed .sidebar-logo {
  padding: 20px 12px;
  justify-content: center;
}

.ant-layout-sider-collapsed .sidebar-menu {
  padding: 8px 4px;
}

/* ========== Scrollbar ========== */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

::-webkit-scrollbar-track {
  background: transparent;
}
</style>
