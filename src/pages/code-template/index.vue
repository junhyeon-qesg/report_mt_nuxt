<script setup lang="ts">
import { h } from 'vue';
import { NDataTable, NButton, NSpace } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { NuxtLink } from '#components';

defineOptions({
  name: 'CodeTemplateList',
});

type Template = {
  id: number;
  name: string;
  version: string;
  createdAt: string;
  updatedAt: string;
};

const mockData: Template[] = [
  { id: 1, name: '온실가스 인벤토리 (Scope 1, 2)', version: 'v1.2', createdAt: '2023-10-15', updatedAt: '2024-08-20' },
  { id: 2, name: '에너지 사용량', version: 'v1.0', createdAt: '2023-11-01', updatedAt: '2024-07-30' },
  { id: 3, name: '용수 및 폐기물 관리', version: 'v0.9', createdAt: '2024-02-10', updatedAt: '2024-06-15' },
];

const createColumns = (): DataTableColumns<Template> => [
  {
    title: '템플릿명',
    key: 'name',
  },
  {
    title: '버전',
    key: 'version',
    width: 100,
  },
  {
    title: '생성일',
    key: 'createdAt',
    width: 150,
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
        { to: `/code-template/${row.id}` },
        { default: () => h(NButton, { size: 'small' }, { default: () => '편집' }) }
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
        <NuxtLink to="/code-template/new">
          <NButton type="primary">지표 템플릿 추가</NButton>
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
