<template>
  <!-- Loading state -->
  <div v-if="!feedbackData" class="report-loading">
    <a-spin size="large" tip="正在生成报告..." />
  </div>

  <!-- Report content -->
  <div v-else class="report-page">
    <!-- Header -->
    <div class="report-header">
      <div class="report-header-content">
        <h1 class="report-title">面试评测报告</h1>
        <p class="report-meta">
          领域：<a-tag color="blue">{{ selectedDomainName }}</a-tag>
          岗位：<a-tag color="blue">{{ selectedRole }}</a-tag>
        </p>
      </div>
    </div>

    <!-- Radar Chart Section -->
    <a-card class="report-card" :bordered="false">
      <template #title>
        <RadarChartOutlined style="color: #1677ff; margin-right: 8px" />
        能力雷达图
      </template>
      <div class="radar-wrapper">
        <RadarChart :scores="radarChartScores" :labels="radarChartLabels" :max-score="100" />
      </div>
    </a-card>

    <!-- Score Overview -->
    <a-row :gutter="[16, 16]" class="score-row" v-if="radarChartScores && radarChartScores.length > 0">
      <a-col
        v-for="(score, index) in radarChartScores"
        :key="index"
        :xs="12"
        :sm="8"
        :md="Math.floor(24 / Math.min(radarChartScores.length, 5))"
      >
        <a-card class="score-card" :bordered="false" size="small">
          <a-statistic
            :title="radarChartLabels[index] || `维度${index + 1}`"
            :value="score"
            suffix="分"
            :value-style="{ color: getScoreColor(score), fontWeight: 700 }"
          />
          <a-progress
            :percent="score"
            :stroke-color="getScoreColor(score)"
            :show-info="false"
            size="small"
            style="margin-top: 8px"
          />
        </a-card>
      </a-col>
    </a-row>

    <!-- Key Issues -->
    <a-card class="report-card" :bordered="false">
      <template #title>
        <ExclamationCircleOutlined style="color: #faad14; margin-right: 8px" />
        关键问题定位
      </template>
      <a-list
        :data-source="paginatedKeyIssues"
        size="small"
      >
        <template #renderItem="{ item, index }">
          <a-list-item>
            <a-list-item-meta>
              <template #avatar>
                <a-avatar
                  :style="{
                    background: '#fff7e6',
                    color: '#faad14',
                    fontWeight: 700,
                    fontSize: '13px'
                  }"
                  size="small"
                >
                  {{ (issuesCurrentPage - 1) * issuesPageSize + index + 1 }}
                </a-avatar>
              </template>
              <template #title>
                <span style="font-size: 14px">{{ item }}</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
      <Pagination
        v-if="feedbackData.keyIssues && feedbackData.keyIssues.length > issuesPageSize"
        :current-page="issuesCurrentPage"
        :total-items="feedbackData.keyIssues.length"
        :page-size="issuesPageSize"
        @page-change="handleIssuesPageChange"
        @page-size-change="handleIssuesPageSizeChange"
      />
    </a-card>

    <!-- Improvement Suggestions -->
    <a-card class="report-card" :bordered="false">
      <template #title>
        <BulbOutlined style="color: #52c41a; margin-right: 8px" />
        改进建议
      </template>
      <a-list
        :data-source="paginatedSuggestions"
        size="small"
      >
        <template #renderItem="{ item, index }">
          <a-list-item>
            <a-list-item-meta>
              <template #avatar>
                <a-avatar
                  :style="{
                    background: '#f6ffed',
                    color: '#52c41a',
                    fontWeight: 700,
                    fontSize: '13px'
                  }"
                  size="small"
                >
                  {{ (suggestionsCurrentPage - 1) * suggestionsPageSize + index + 1 }}
                </a-avatar>
              </template>
              <template #title>
                <span style="font-size: 14px">{{ item }}</span>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
      <Pagination
        v-if="feedbackData.improvementSuggestions && feedbackData.improvementSuggestions.length > suggestionsPageSize"
        :current-page="suggestionsCurrentPage"
        :total-items="feedbackData.improvementSuggestions.length"
        :page-size="suggestionsPageSize"
        @page-change="handleSuggestionsPageChange"
        @page-size-change="handleSuggestionsPageSizeChange"
      />
    </a-card>

    <!-- Actions -->
    <div class="report-actions">
      <a-space :size="16" wrap>
        <a-button
          type="primary"
          size="large"
          @click="emits('view-recommendations')"
        >
          <BookOutlined /> 查看学习推荐
        </a-button>
        <a-button
          size="large"
          @click="emits('go-home')"
        >
          <HomeOutlined /> 返回首页
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, watch, ref, computed } from 'vue';
import RadarChart from './RadarChart.vue';
import Pagination from './Pagination.vue';
import {
  RadarChartOutlined,
  ExclamationCircleOutlined,
  BulbOutlined,
  BookOutlined,
  HomeOutlined,
} from '@ant-design/icons-vue';

const props = defineProps({
  feedbackData: Object,
  selectedDomainName: String,
  selectedRole: String,
  radarChartScores: Array,
  radarChartLabels: Array,
});

const emits = defineEmits(['view-recommendations', 'go-home']);

// Pagination
const issuesCurrentPage = ref(1);
const issuesPageSize = ref(5);
const suggestionsCurrentPage = ref(1);
const suggestionsPageSize = ref(5);

const paginatedKeyIssues = computed(() => {
  if (!props.feedbackData?.keyIssues) return [];
  const start = (issuesCurrentPage.value - 1) * issuesPageSize.value;
  const end = start + issuesPageSize.value;
  return props.feedbackData.keyIssues.slice(start, end);
});

const paginatedSuggestions = computed(() => {
  if (!props.feedbackData?.improvementSuggestions) return [];
  const start = (suggestionsCurrentPage.value - 1) * suggestionsPageSize.value;
  const end = start + suggestionsPageSize.value;
  return props.feedbackData.improvementSuggestions.slice(start, end);
});

const handleIssuesPageChange = (page) => {
  issuesCurrentPage.value = page;
};

const handleIssuesPageSizeChange = (size) => {
  issuesPageSize.value = size;
  issuesCurrentPage.value = 1;
};

const handleSuggestionsPageChange = (page) => {
  suggestionsCurrentPage.value = page;
};

const handleSuggestionsPageSizeChange = (size) => {
  suggestionsPageSize.value = size;
  suggestionsCurrentPage.value = 1;
};

const getScoreColor = (score) => {
  if (score >= 80) return '#52c41a';
  if (score >= 60) return '#1677ff';
  if (score >= 40) return '#faad14';
  return '#ff4d4f';
};

</script>

<style scoped>
.report-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.report-page {
  max-width: 900px;
  margin: 0 auto;
}

.report-header {
  margin-bottom: 24px;
}

.report-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f1f1f;
  margin: 0 0 8px;
}

.report-meta {
  color: #8c8c8c;
  font-size: 14px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.report-card {
  border-radius: 12px !important;
  margin-bottom: 16px;
}

.report-card :deep(.ant-card-head) {
  border-bottom: 1px solid #f0f0f0;
}

.report-card :deep(.ant-card-head-title) {
  font-weight: 600;
  font-size: 16px;
}

.radar-wrapper {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* Score cards */
.score-row {
  margin-bottom: 16px;
}

.score-card {
  border-radius: 10px !important;
  text-align: center;
}

.score-card :deep(.ant-statistic-title) {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

/* Actions */
.report-actions {
  text-align: center;
  padding: 24px 0;
}

/* List items */
.report-card :deep(.ant-list-item) {
  padding: 10px 0;
}
</style>
