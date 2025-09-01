<script setup lang="ts">
import { h, computed } from 'vue';
import { NDataTable, NButton, NSpace, NCard, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { NuxtLink } from '#components';
import { useDataSheetManageStore } from '@/stores/dataSheetManageStore';

defineOptions({
  name: 'DataSheetManageList',
});

const store = useDataSheetManageStore();
const dataSheets = computed(() => store.dataSheets);

interface DataSheet {
  id: number;
  title: string;
  submitter: string;
  submissionDate: string;
  status: '제출됨' | '승인됨' | '반려됨';
}

const createColumns = (): DataTableColumns<DataSheet> => [
  {
    title: '제목',
    key: 'title',
  },
  {
    title: '제출자',
    key: 'submitter',
    width: 120,
  },
  {
    title: '제출일',
    key: 'submissionDate',
    width: 150,
  },
  {
    title: '상태',
    key: 'status',
    width: 100,
    render(row) {
      let tagType: 'default' | 'success' | 'warning' | 'error' = 'default';
      switch (row.status) {
        case '승인됨':
          tagType = 'success';
          break;
        case '반려됨':
          tagType = 'error';
          break;
        case '제출됨':
          tagType = 'warning';
          break;
      }
      return h(NTag, { type: tagType, bordered: false }, { default: () => row.status });
    },
  },
  {
    title: '작업',
    key: 'actions',
    width: 100,
    render(row) {
      return h(
        NuxtLink,
        { to: `/data-sheet-manage/${row.id}` },
        { default: () => h(NButton, { size: 'small' }, { default: () => '상세 보기' }) }
      );
    },
  },
];

const columns = createColumns();
const pagination = { pageSize: 10 };
</script>

<template>
  <div class="space-y-4">
    <NCard title="제출된 데이터 시트 목록">
      <NDataTable
        :columns="columns"
        :data="dataSheets"
        :pagination="pagination"
        :bordered="false"
      />
    </NCard>
  </div>
</template>
