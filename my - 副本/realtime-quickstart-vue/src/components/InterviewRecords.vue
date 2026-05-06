<template>
  <div class="interview-records-container">
    <!-- 页面头部 -->
    <a-card class="page-header-card">
      <div class="page-header">
        <div class="header-left">
          <a-button @click="$emit('go-back')" style="margin-bottom: 16px;">
            <template #icon><ArrowLeftOutlined /></template>
            返回首页
          </a-button>
          <h1 class="page-title"><BarChartOutlined /> 面试记录</h1>
          <div class="breadcrumb">首页 / 面试记录</div>
        </div>
        <div class="header-right">
          <div class="stats-summary">
            <a-statistic title="总面试次数" :value="totalInterviews" class="stat-item" />
            <a-statistic title="平均得分" :value="averageScore" suffix="%" class="stat-item" />
          </div>
        </div>
      </div>
    </a-card>

    <!-- 筛选和搜索 -->
    <a-card class="filters-card">
      <div class="filters-section">
        <div class="filter-group">
          <span class="filter-label">面试类型：</span>
          <a-select v-model:value="selectedType" style="width: 140px;" placeholder="全部">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="tech">技术面试</a-select-option>
            <a-select-option value="hr">HR面试</a-select-option>
            <a-select-option value="management">管理面试</a-select-option>
            <a-select-option value="design">设计面试</a-select-option>
          </a-select>
        </div>
        <div class="filter-group">
          <span class="filter-label">时间范围：</span>
          <a-select v-model:value="selectedTimeRange" style="width: 140px;" placeholder="全部">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="week">最近一周</a-select-option>
            <a-select-option value="month">最近一月</a-select-option>
            <a-select-option value="quarter">最近三月</a-select-option>
          </a-select>
        </div>
        <div class="search-group">
          <a-input-search
            v-model:value="searchKeyword"
            placeholder="搜索岗位或关键词..."
            allow-clear
          />
        </div>
      </div>
    </a-card>

    <!-- 面试记录列表 -->
    <div class="records-grid">
      <a-card
        v-for="record in filteredRecords"
        :key="record.id"
        class="record-card"
        hoverable
        @click="viewRecordDetail(record)"
      >
        <div class="record-header">
          <div class="record-type">
            <component :is="getTypeIconComponent(record.type)" class="type-icon" />
            <span class="type-name">{{ getTypeName(record.type) }}</span>
          </div>
          <a-tag :color="getScoreTagColor(record.score)" class="record-score-tag">
            {{ record.score }}分
          </a-tag>
        </div>

        <div class="record-content">
          <h3 class="record-title">{{ record.position }}</h3>
          <div class="record-meta">
            <span class="record-date"><CalendarOutlined /> {{ formatDate(record.date) }}</span>
            <span class="record-duration"><ClockCircleOutlined /> {{ record.duration }}分钟</span>
          </div>
          <div class="record-tags">
            <a-tag v-for="tag in record.tags" :key="tag">
              {{ tag }}
            </a-tag>
          </div>
        </div>

        <a-divider style="margin: 12px 0;" />

        <div class="record-footer">
          <div class="record-highlights">
            <div class="highlight-item">
              <span class="highlight-label">表现亮点：</span>
              <span class="highlight-text">{{ record.highlights[0] }}</span>
            </div>
          </div>
          <a-button type="primary" size="small">
            查看详情 <ArrowRightOutlined />
          </a-button>
        </div>
      </a-card>
    </div>

    <!-- 空状态 -->
    <a-card v-if="filteredRecords.length === 0" class="empty-card">
      <div class="empty-state">
        <FormOutlined class="empty-icon" />
        <h3 class="empty-title">暂无面试记录</h3>
        <p class="empty-description">开始您的第一次AI模拟面试吧！</p>
        <a-button type="primary" @click="$emit('go-back')">
          开始面试
        </a-button>
      </div>
    </a-card>

    <!-- 分页 -->
    <div v-if="filteredRecords.length > 0" class="pagination">
      <a-button
        v-for="page in totalPages"
        :key="page"
        :type="currentPage === page ? 'primary' : 'default'"
        size="small"
        @click="currentPage = page"
      >
        {{ page }}
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, markRaw } from 'vue';
import {
  BarChartOutlined,
  LaptopOutlined,
  TeamOutlined,
  FileTextOutlined,
  HighlightOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FormOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons-vue';

defineEmits(['go-back']);

// 响应式数据
const selectedType = ref('');
const selectedTimeRange = ref('');
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(6);

// 模拟面试记录数据
const interviewRecords = ref([
  {
    id: 1,
    type: 'tech',
    position: '前端工程师',
    score: 85,
    date: new Date('2024-01-15'),
    duration: 45,
    tags: ['Vue.js', 'JavaScript', '项目经验'],
    highlights: ['技术基础扎实', '项目经验丰富'],
    improvements: ['算法能力需提升', '系统设计经验不足']
  },
  {
    id: 2,
    type: 'hr',
    position: 'HR专员',
    score: 92,
    date: new Date('2024-01-12'),
    duration: 30,
    tags: ['沟通能力', '团队协作', '抗压能力'],
    highlights: ['沟通表达清晰', '团队合作意识强'],
    improvements: ['职业规划需明确', '行业了解需加深']
  },
  {
    id: 3,
    type: 'tech',
    position: '后端工程师',
    score: 78,
    date: new Date('2024-01-10'),
    duration: 50,
    tags: ['Java', 'Spring', '数据库'],
    highlights: ['数据库设计能力强', '代码规范性好'],
    improvements: ['并发处理经验不足', '微服务架构需学习']
  },
  {
    id: 4,
    type: 'design',
    position: 'UI设计师',
    score: 88,
    date: new Date('2024-01-08'),
    duration: 40,
    tags: ['Figma', '用户体验', '视觉设计'],
    highlights: ['设计思维清晰', '用户体验意识强'],
    improvements: ['交互动效需提升', '设计系统化程度不够']
  },
  {
    id: 5,
    type: 'management',
    position: '项目经理',
    score: 90,
    date: new Date('2024-01-05'),
    duration: 35,
    tags: ['项目管理', '团队领导', '风险控制'],
    highlights: ['项目管理经验丰富', '团队协调能力强'],
    improvements: ['技术深度需加强', '跨部门沟通需提升']
  },
  {
    id: 6,
    type: 'tech',
    position: '算法工程师',
    score: 82,
    date: new Date('2024-01-03'),
    duration: 60,
    tags: ['机器学习', 'Python', '数据分析'],
    highlights: ['算法理论扎实', '数学基础好'],
    improvements: ['工程实践经验不足', '大数据处理需学习']
  }
]);

// 计算属性
const filteredRecords = computed(() => {
  let filtered = interviewRecords.value;

  if (selectedType.value) {
    filtered = filtered.filter(record => record.type === selectedType.value);
  }

  if (selectedTimeRange.value) {
    const now = new Date();
    const timeRanges = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000
    };
    const range = timeRanges[selectedTimeRange.value];
    filtered = filtered.filter(record =>
      now.getTime() - record.date.getTime() <= range
    );
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(record =>
      record.position.toLowerCase().includes(keyword) ||
      record.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
  }

  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filtered.slice(start, end);
});

const totalInterviews = computed(() => interviewRecords.value.length);
const averageScore = computed(() => {
  if (interviewRecords.value.length === 0) return 0;
  const total = interviewRecords.value.reduce((sum, record) => sum + record.score, 0);
  return Math.round(total / interviewRecords.value.length);
});

const totalPages = computed(() => {
  return Math.ceil(interviewRecords.value.length / pageSize.value);
});

// 方法
const getTypeIconComponent = (type) => {
  const icons = {
    tech: markRaw(LaptopOutlined),
    hr: markRaw(TeamOutlined),
    management: markRaw(FileTextOutlined),
    design: markRaw(HighlightOutlined)
  };
  return icons[type] || markRaw(FormOutlined);
};

const getTypeName = (type) => {
  const names = {
    tech: '技术面试',
    hr: 'HR面试',
    management: '管理面试',
    design: '设计面试'
  };
  return names[type] || '其他面试';
};

const getScoreTagColor = (score) => {
  if (score >= 90) return 'green';
  if (score >= 80) return 'blue';
  if (score >= 70) return 'orange';
  return 'red';
};

const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent';
  if (score >= 80) return 'score-good';
  if (score >= 70) return 'score-average';
  return 'score-poor';
};

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const viewRecordDetail = (record) => {
};
</script>

<style scoped>
.interview-records-container {
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

.stats-summary {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

/* 筛选区域 */
.filters-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.filters-section {
  display: flex;
  gap: 24px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
}

.search-group {
  flex: 1;
  min-width: 200px;
}

/* 记录网格 */
.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.record-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.record-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-icon {
  font-size: 1.2rem;
  color: #1677ff;
}

.type-name {
  font-weight: 500;
  color: #666;
}

.record-score-tag {
  font-weight: 700;
  font-size: 0.95rem;
  padding: 2px 12px;
  border-radius: 16px;
}

.record-content {
  margin-bottom: 4px;
}

.record-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.record-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #666;
}

.record-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.record-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.record-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-highlights {
  flex: 1;
}

.highlight-item {
  font-size: 0.9rem;
}

.highlight-label {
  color: #666;
  font-weight: 500;
}

.highlight-text {
  color: #52c41a;
  margin-left: 4px;
}

/* 空状态 */
.empty-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  font-size: 4rem;
  color: #999;
  margin-bottom: 16px;
  display: block;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.empty-description {
  color: #666;
  margin-bottom: 24px;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .interview-records-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .stats-summary {
    width: 100%;
    justify-content: space-around;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    justify-content: space-between;
  }

  .records-grid {
    grid-template-columns: 1fr;
  }

  .record-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>
