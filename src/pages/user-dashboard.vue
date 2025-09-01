<script setup lang="ts">
import { ref, h, computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { NCard, NStatistic, NSelect, NDataTable, NTag, NButton, NProgress } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { NuxtLink } from '#components';

defineOptions({
  name: 'UserDashboard',
});

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// --- Mock Data ---
const currentYear = new Date().getFullYear();
const selectedYear = ref(currentYear);
const yearOptions = [
  { label: `${currentYear}년`, value: currentYear },
  { label: `${currentYear - 1}년`, value: currentYear - 1 },
];

const userProgress = ref({
  completed: 8,
  inProgress: 3,
  notStarted: 2,
});

const totalSheets = computed(() => userProgress.value.completed + userProgress.value.inProgress + userProgress.value.notStarted);

const completionRate = computed(() => (totalSheets.value > 0 ? ((userProgress.value.completed / totalSheets.value) * 100).toFixed(1) : 0));

const doughnutChartData = computed(() => ({
  labels: ['완료', '작성 중', '미작성'],
  datasets: [
    {
      backgroundColor: ['#22c55e', '#f97316', '#ef4444'],
      data: [userProgress.value.completed, userProgress.value.inProgress, userProgress.value.notStarted],
    },
  ],
}));

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || '';
          const value = context.raw || 0;
          const percentage = ((value / totalSheets.value) * 100).toFixed(1);
          return `${label}: ${value}건 (${percentage}%)`;
        },
      },
    },
  },
};

type SheetData = {
  key: number;
  title: string;
  status: 'completed' | 'inProgress' | 'notStarted';
  dueDate: string;
  id: string;
  rate: number; // 작성률
};

const assignedSheets = ref<SheetData[]>([
  { key: 1, id: 'sheet-001', title: '1분기 에너지 사용량', status: 'completed', dueDate: '2024-04-15', rate: 100 },
  { key: 2, id: 'sheet-002', title: '1분기 폐기물 배출량', status: 'completed', dueDate: '2024-04-15', rate: 100 },
  { key: 3, id: 'sheet-003', title: '2분기 에너지 사용량', status: 'inProgress', dueDate: '2024-07-15', rate: 65 },
  { key: 4, id: 'sheet-004', title: '2분기 폐기물 배출량', status: 'notStarted', dueDate: '2024-07-15', rate: 0 },
  { key: 5, id: 'sheet-005', title: '3분기 용수 사용량', status: 'notStarted', dueDate: '2024-10-15', rate: 0 },
]);

const getStatusInfo = (status: SheetData['status']) => {
  switch (status) {
    case 'completed':
      return { text: '완료', type: 'success' as const };
    case 'inProgress':
      return { text: '작성 중', type: 'warning' as const };
    case 'notStarted':
      return { text: '미작성', type: 'error' as const };
  }
};

const createColumns = (): DataTableColumns<SheetData> => [
  {
    title: '상태',
    key: 'status',
    width: 100,
    render(row) {
      const statusInfo = getStatusInfo(row.status);
      return h(NTag, { type: statusInfo.type, bordered: false }, { default: () => statusInfo.text });
    },
  },
  {
    title: '작성률',
    key: 'rate',
    width: 150,
    render(row) {
      return h(NProgress, {
        'type': 'line',
        'percentage': row.rate,
        'status': row.rate === 100 ? 'success' : 'default',
        'indicator-placement': 'inside',
      });
    },
  },
  {
    title: '데이터 시트명',
    key: 'title',
  },
  {
    title: '제출 기한',
    key: 'dueDate',
    width: 120,
  },
  {
    title: '작업',
    key: 'actions',
    width: 100,
    render(row) {
      return h(
        NuxtLink,
        { to: `/data-sheet/${row.id}` },
        { default: () => h(NButton, { tertiary: true, type: 'primary', size: 'small' }, { default: () => '바로가기' }) },
      );
    },
  },
];

const columns = createColumns();
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

    <!-- KPI & Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <n-card title="나의 데이터 시트 현황" bordered class="shadow-sm">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <n-statistic label="완료" :value="userProgress.completed" />
          <n-statistic label="작성 중" :value="userProgress.inProgress" />
          <n-statistic label="미작성" :value="userProgress.notStarted" />
          <n-statistic label="작성률">
            <span class="text-green-500 font-semibold">{{ completionRate }}%</span>
          </n-statistic>
        </div>
      </n-card>

      <n-card title="작성 진행률" bordered class="shadow-sm h-full">
        <div class="h-48 flex items-center justify-center">
          <Doughnut :data="doughnutChartData" :options="doughnutChartOptions" />
        </div>
      </n-card>
    </div>

    <!-- Assigned Data Sheet List -->
    <n-card title="나에게 할당된 데이터 시트" bordered class="shadow-sm">
      <n-data-table :columns="columns"
                    :data="assignedSheets"
                    :pagination="{ pageSize: 5 }"
                    :bordered="false"
      />
    </n-card>
  </div>
</template>

<style scoped>
/* Additional fine-tuning if necessary */
</style>
