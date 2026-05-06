<template>
  <div class="recommendations-page">
    <a-card class="recommendations-card" :bordered="false">
      <h1 class="recommendations-title">个性化学习推荐</h1>
      <p class="recommendations-desc">
        根据您的评测结果，为您推荐以下学习资源：
      </p>

      <div v-if="Object.keys(learningRecs).length > 0">
        <div
          v-for="(items, category) in paginatedLearningRecs"
          :key="category"
          class="category-section"
        >
          <h2 class="category-title">
            <ReadOutlined class="category-icon" />
            {{ categoryLabels[category] }} 提升
          </h2>
          <ul class="resource-list">
            <li v-for="(item, index) in items" :key="index" class="resource-item">
              <a :href="item.link" target="_blank" rel="noopener noreferrer" class="resource-link">
                <LinkOutlined class="link-icon" />
                {{ item.title }}
              </a>
            </li>
          </ul>
        </div>

        <!-- 分页组件 -->
        <Pagination
          v-if="totalRecommendations > pageSize"
          :current-page="currentPage"
          :total-items="totalRecommendations"
          :page-size="pageSize"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
        />
      </div>
      <a-empty v-else description="暂无推荐资源" />

      <div class="back-btn-wrapper">
        <a-button size="large" @click="emits('go-home')">
          <HomeOutlined /> 返回首页
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { categoryLabels } from '../utils/mockData';
import { HomeOutlined, ReadOutlined, LinkOutlined } from '@ant-design/icons-vue';
import Pagination from './Pagination.vue';

const props = defineProps({
  learningRecs: Object,
  categoryLabels: Object,
});

const emits = defineEmits(['go-home']);

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(3); // 每页显示3个分类

// 计算总推荐数量
const totalRecommendations = computed(() => {
  return Object.keys(props.learningRecs || {}).length;
});

// 计算分页后的推荐数据
const paginatedLearningRecs = computed(() => {
  if (!props.learningRecs) return {};

  const categories = Object.keys(props.learningRecs);
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  const paginatedCategories = categories.slice(start, end);

  const result = {};
  paginatedCategories.forEach(category => {
    result[category] = props.learningRecs[category];
  });

  return result;
});

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page;
};

const handlePageSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
};
</script>

<style scoped>
.recommendations-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.recommendations-card {
  width: 100%;
  max-width: 960px;
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.recommendations-card :deep(.ant-card-body) {
  padding: 32px;
}

.recommendations-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px;
}

.recommendations-desc {
  font-size: 16px;
  color: #666;
  margin: 0 0 24px;
}

.category-section {
  background: #f0f5ff;
  border-radius: 10px;
  padding: 20px 24px;
  margin-bottom: 16px;
  text-align: left;
  transition: box-shadow 0.2s;
}

.category-section:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.category-title {
  font-size: 18px;
  font-weight: 600;
  color: #1677ff;
  margin: 0 0 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  font-size: 18px;
}

.resource-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.resource-item {
  margin-bottom: 8px;
}

.resource-link {
  font-size: 15px;
  color: #1677ff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}

.resource-link:hover {
  color: #4096ff;
  text-decoration: underline;
}

.link-icon {
  font-size: 14px;
}

.back-btn-wrapper {
  margin-top: 24px;
}
</style>
