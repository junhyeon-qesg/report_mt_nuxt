<script setup lang="ts">
import { h } from 'vue';
import { NDataTable, NButton, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { NuxtLink } from '#components';

defineOptions({
  name: 'DataSheetList',
});

type SheetStatus = '작성 중' | '제출 완료' | '반려';

type DataSheet = {
  id: number;
  name: string;
  template: string;
  status: SheetStatus;
  updatedAt: string;
};

const mockData: DataSheet[] = [
  { id: 1, name: '2024년 1분기 온실가스 배출량', template: '온실가스 인벤토리 (v1.2)', status: '제출 완료', updatedAt: '2024-04-15' },
  { id: 2, name: '2024년 2분기 온실가스 배출량', template: '온실가스 인벤토리 (v1.2)', status: '작성 중', updatedAt: '2024-07-10' },
  { id: 3, name: '2024년 사업장 폐기물 발생량', template: '용수 및 폐기물 관리 (v0.9)', status: '작성 중', updatedAt: '2024-08-01' },
  { id: 4, name: '2023년 전체 에너지 사용량', template: '에너지 사용량 (v1.0)', status: '반려', updatedAt: '2024-01-25' },
];

const getStatusTagType = (status: SheetStatus) => {
  switch (status) {
    case '제출 완료': return 'success';
    case '작성 중': return 'warning';
    case '반려': return 'error';
    default: return 'default';
  }
};

const createColumns = (): DataTableColumns<DataSheet> => [
  {
    title: '데이터 시트명',
    key: 'name',
    render(row) {
      return h(NuxtLink, { to: `/data-sheet/${row.id}`, class: 'text-blue-600 hover:underline' }, { default: () => row.name });
    }
  },
  {
    title: '템플릿',
    key: 'template',
  },
  {
    title: '상태',
    key: 'status',
    width: 120,
    render(row) {
      return h(NTag, { type: getStatusTagType(row.status), bordered: false }, { default: () => row.status });
    },
  },
  {
    title: '최종 수정일',
    key: 'updatedAt',
    width: 150,
  },
  {
    title: '작업',
    key: 'actions',
    width: 120,
    render(row) {
      return h(
        NuxtLink,
        { to: `/data-sheet/${row.id}` },
        { default: () => h(NButton, { size: 'small', type: 'primary', ghost: true }, { default: () => '입력' }) }
      );
    },
  },
];

const columns = createColumns();
const pagination = { pageSize: 10 };

</script>

<template>
  <div class="space-y-4">
    <header class="flex justify-end items-center">
      <NSpace>
        <NuxtLink to="/data-sheet/new">
          <NButton type="primary">새 데이터 시트 작성</NButton>
        </NuxtLink>
      </NSpace>
    </header>

    <NCard>
      <NDataTable
        :columns="columns"
        :data="mockData"
        :pagination="pagination"
        :bordered="false"
      />
    </NCard>
  </div>
</template>