<template>
  <div class="radar-chart-container" ref="containerRef">
    <canvas ref="canvas" class="radar-canvas"></canvas>

    <!-- Labels -->
    <div class="label-labels">
      <div
        v-for="(label, index) in labels"
        :key="`label-${index}`"
        class="label-item"
        :style="getLabelPosition(index)"
      >
        <span class="label-text">{{ label }}</span>
      </div>
    </div>

    <!-- Scores -->
    <div class="score-labels">
      <div
        v-for="(score, index) in scores"
        :key="`score-${index}`"
        class="score-item"
        :style="getScorePosition(index)"
      >
        <span class="score-value">{{ score }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue';

const props = defineProps({
  scores: {
    type: Array,
    required: true,
    default: () => [85, 80, 75, 90, 70]
  },
  labels: {
    type: Array,
    required: true,
    default: () => ['专业知识', '岗位技能', '语言表达', '逻辑思维', '抗压应变']
  },
  size: {
    type: Number,
    default: 300
  }
});

const canvas = ref(null);
const containerRef = ref(null);
let ctx = null;
const actualSize = ref(props.size);

// Blue palette
const COLORS = {
  grid: 'rgba(22, 119, 255, 0.12)',
  gridLine: 'rgba(22, 119, 255, 0.08)',
  fill: 'rgba(22, 119, 255, 0.15)',
  stroke: '#1677ff',
  dot: '#1677ff',
  dotInner: '#fff',
};

// Calculate responsive size
const updateSize = () => {
  if (containerRef.value) {
    const parentWidth = containerRef.value.parentElement?.clientWidth || props.size;
    const maxSize = Math.min(parentWidth - 80, props.size);
    actualSize.value = Math.max(200, maxSize);
  }
};

// Label positions
const getLabelPosition = (index) => {
  const angle = (index * 2 * Math.PI) / props.labels.length - Math.PI / 2;
  const radius = actualSize.value / 2 + 40;
  const x = Math.cos(angle) * radius + actualSize.value / 2;
  const y = Math.sin(angle) * radius + actualSize.value / 2;
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -50%)'
  };
};

const getScorePosition = (index) => {
  const angle = (index * 2 * Math.PI) / props.labels.length - Math.PI / 2;
  const score = props.scores[index] || 0;
  const maxRadius = actualSize.value / 2 - 20;
  const radius = (maxRadius * score) / 100 + 16;
  const x = Math.cos(angle) * radius + actualSize.value / 2;
  const y = Math.sin(angle) * radius + actualSize.value / 2;
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -50%)'
  };
};

// Animation state
let animationProgress = 0;
let animationFrame = null;

const drawRadarChart = (progress = 1) => {
  if (!ctx) return;

  const s = actualSize.value;
  const dpr = window.devicePixelRatio || 1;
  canvas.value.width = s * dpr;
  canvas.value.height = s * dpr;
  canvas.value.style.width = s + 'px';
  canvas.value.style.height = s + 'px';
  ctx.scale(dpr, dpr);

  const centerX = s / 2;
  const centerY = s / 2;
  const maxRadius = s / 2 - 20;
  const numPoints = props.labels.length;

  ctx.clearRect(0, 0, s, s);
  drawGrid(centerX, centerY, maxRadius, numPoints);
  drawDataArea(centerX, centerY, maxRadius, numPoints, progress);
  drawDataPoints(centerX, centerY, maxRadius, numPoints, progress);
};

const drawGrid = (cx, cy, maxR, n) => {
  // Concentric polygons
  for (let ring = 1; ring <= 5; ring++) {
    const r = (maxR * ring) / 5;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (ring % 2 === 0) {
      ctx.fillStyle = 'rgba(22, 119, 255, 0.02)';
      ctx.fill();
    }
  }

  // Radial lines
  for (let i = 0; i < n; i++) {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
    ctx.strokeStyle = COLORS.gridLine;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
};

const drawDataArea = (cx, cy, maxR, n, progress) => {
  const points = [];
  for (let i = 0; i < n; i++) {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    const score = (props.scores[i] || 0) * progress;
    const r = (maxR * score) / 100;
    points.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r
    });
  }

  // Fill
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = COLORS.fill;
  ctx.fill();

  // Stroke
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.strokeStyle = COLORS.stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
};

const drawDataPoints = (cx, cy, maxR, n, progress) => {
  for (let i = 0; i < n; i++) {
    const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
    const score = (props.scores[i] || 0) * progress;
    const r = (maxR * score) / 100;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = COLORS.dot;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = COLORS.dotInner;
    ctx.fill();
  }
};

// Animate
const animateChart = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationProgress = 0;

  const animate = () => {
    animationProgress += 0.04;
    if (animationProgress >= 1) {
      animationProgress = 1;
      drawRadarChart(1);
      return;
    }
    const eased = 1 - Math.pow(1 - animationProgress, 3);
    drawRadarChart(eased);
    animationFrame = requestAnimationFrame(animate);
  };
  animate();
};

watch(() => props.scores, () => {
  nextTick(() => {
    animateChart();
  });
}, { deep: true });

let resizeObserver = null;

onMounted(() => {
  updateSize();

  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    animateChart();
  }

  if (containerRef.value && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      updateSize();
      nextTick(() => drawRadarChart(1));
    });
    resizeObserver.observe(containerRef.value.parentElement || containerRef.value);
  }
});

onUnmounted(() => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  if (resizeObserver) resizeObserver.disconnect();
});
</script>

<style scoped>
.radar-chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 16px auto;
  width: fit-content;
}

.radar-canvas {
  border-radius: 12px;
  background: transparent;
}

.label-labels,
.score-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.label-item,
.score-item {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label-text {
  font-size: 13px;
  font-weight: 600;
  color: #1f1f1f;
  background: #fff;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
}

.score-value {
  font-size: 12px;
  font-weight: 700;
  color: #1677ff;
  background: #e6f4ff;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #bae0ff;
}

@media (max-width: 768px) {
  .label-text {
    font-size: 11px;
    padding: 2px 6px;
  }

  .score-value {
    font-size: 10px;
  }
}
</style>
