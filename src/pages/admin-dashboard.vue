<script setup lang="ts">
import { ref, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { NCard, NStatistic, NSelect, NList, NListItem, NThing, NTag } from 'naive-ui';

defineOptions({
  name: 'AdminDashboard',
});

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// --- Mock Data ---
const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const yearOptions = [
  { label: `${currentYear}년`, value: currentYear },
  { label: `${currentYear - 1}년`, value: currentYear - 1 },
  { label: `${currentYear - 2}년`, value: currentYear - 2 },
];

const kpiData = ref({
  totalSheets: 150,
  inProgress: 75,
  completed: 50,
  notSubmitted: 25,
  yoyGrowth: 5.2, // 전년 대비 주요 지표 증감률
});

const progressData = ref({
  labels: ['사업장 A', '사업장 B', '사업장 C', '사업장 D', '사업장 E'],
  datasets: [
    {
      label: '작성 완료율 (%)',
      backgroundColor: '#4ade80', // green-400
      borderColor: '#22c55e', // green-500
      borderWidth: 1,
      hoverBackgroundColor: '#86efac', // green-300
      data: [85, 60, 95, 70, 88],
    },
  ],
});

const recentActivities = ref([
  { id: 1, user: '김관리', action: '사업장 A의 데이터를 제출했습니다.', timestamp: '2시간 전', status: 'completed' },
  { id: 2, user: '박담당', action: '새로운 데이터 시트가 생성되었습니다: 분기별 실적', timestamp: '5시간 전', status: 'new' },
  { id: 3, user: '이책임', action: '사업장 C의 데이터를 반려했습니다.', timestamp: '1일 전', status: 'rejected' },
  { id: 4, user: '최선임', action: '사업장 B의 데이터를 제출했습니다.', timestamp: '2일 전', status: 'completed' },
]);

// --- Chart Options ---
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#fff',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#ddd',
      borderWidth: 1,
      callbacks: {
        label: (context: any) => `${context.dataset.label}: ${context.raw}%`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value: any) => `${value}%`,
      },
    },
  },
  onClick: (event: any, elements: any) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const businessUnit = progressData.value.labels[elementIndex];
      alert(`'${businessUnit}'의 데이터 시트 목록으로 이동합니다.`);
      // 여기에 실제 라우팅 로직을 추가할 수 있습니다.
      // Ex: router.push(`/data-sheets?unit=${businessUnit}`);
    }
  },
}));

const getStatusTagType = (status: string) => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'new':
      return 'info';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};
</script>

<template>
  <div class="space-y-8 min-h-screen">
    <!-- Header -->
    <div class="flex justify-end items-center">
      <n-select
        v-model:value="selectedYear"
        :options="yearOptions"
        class="w-40"
      />
    </div>

    <!-- KPI Widgets -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      <n-card bordered class="shadow-sm hover:shadow-md transition-shadow">
        <n-statistic label="전체 데이터 시트" :value="kpiData.totalSheets" />
      </n-card>
      <n-card bordered class="shadow-sm hover:shadow-md transition-shadow">
        <n-statistic label="작성 진행 중" :value="kpiData.inProgress" />
      </n-card>
      <n-card bordered class="shadow-sm hover:shadow-md transition-shadow">
        <n-statistic label="완료" :value="kpiData.completed" />
      </n-card>
      <n-card bordered class="shadow-sm hover:shadow-md transition-shadow">
        <n-statistic label="미제출" :value="kpiData.notSubmitted" />
      </n-card>
      <n-card bordered class="shadow-sm hover:shadow-md transition-shadow">
        <n-statistic label="전년 대비 증감률">
          <template #prefix>
            <span :class="kpiData.yoyGrowth > 0 ? 'text-green-500' : 'text-red-500'">
              {{ kpiData.yoyGrowth > 0 ? '▲' : '▼' }}
            </span>
          </template>
          <span :class="kpiData.yoyGrowth > 0 ? 'text-green-500' : 'text-red-500'">
            {{ kpiData.yoyGrowth }}%
          </span>
        </n-statistic>
      </n-card>
    </div>

    <!-- Charts & Recent Activities -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Progress Chart -->
      <div class="lg:col-span-2">
        <n-card title="사업장별 데이터 시트 작성률" bordered class="shadow-sm h-full">
          <div class="h-96 relative">
            <Bar :data="progressData" :options="chartOptions" />
          </div>
        </n-card>
      </div>

      <!-- Recent Activities -->
      <div>
        <n-card title="최근 활동 및 알림" bordered class="shadow-sm h-full">
          <n-list hoverable clickable class="h-full">
            <n-list-item v-for="activity in recentActivities" :key="activity.id">
              <n-thing :title="activity.action">
                <template #avatar>
                  <n-tag :type="getStatusTagType(activity.status)" size="small" class="w-16 text-center">
                    {{ activity.status === 'completed' ? '제출' : activity.status === 'new' ? '신규' : '반려' }}
                  </n-tag>
                </template>
                <template #description>
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>by {{ activity.user }}</span>
                    <span>{{ activity.timestamp }}</span>
                  </div>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional fine-tuning if necessary */
</style>
