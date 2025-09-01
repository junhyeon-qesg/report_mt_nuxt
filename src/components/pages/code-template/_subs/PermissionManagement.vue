<script setup lang="ts">
import { ref, h } from 'vue';
import { NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NSpace, NCheckbox, NGrid, NGi } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useAccessControlStore } from '@/stores/accessControlStore';
import type { Permission } from '@/stores/accessControlStore';

defineOptions({
  name: 'PermissionManagement',
});

const store = useAccessControlStore();
const { permissions } = store;

const showPermissionModal = ref(false);
const isEditMode = ref(false);
const form = ref({
  name: '',
  canEditTemplate: false,
  canEditPermission: false,
  canCreateSheet: false,
});

const handleAddPermission = () => {
  isEditMode.value = false;
  form.value = { name: '', canEditTemplate: false, canEditPermission: false, canCreateSheet: false };
  showPermissionModal.value = true;
};

const handleSavePermission = () => {
  if (form.value.name) {
    store.addPermission(form.value.name);
    showPermissionModal.value = false;
  }
};

const createColumns = (): DataTableColumns<Permission> => [
  { title: '권한명', key: 'name' },
  { title: '지표 템플릿 수정', key: 'canEditTemplate', render: () => h(NCheckbox, { disabled: true, checked: true }) }, // Mock data
  { title: '권한 편집 가능', key: 'canEditPermission', render: () => h(NCheckbox, { disabled: true, checked: false }) }, // Mock data
  { title: '데이터 시트 생성', key: 'canCreateSheet', render: () => h(NCheckbox, { disabled: true, checked: true }) }, // Mock data
  {
    title: '작업',
    key: 'actions',
    render(_row) {
      return h(NSpace, null, {
        default: () => [
          h(NButton, { size: 'small' }, { default: () => '편집' }),
          h(NButton, { size: 'small', danger: true }, { default: () => '삭제' }),
        ],
      });
    },
  },
];

const columns = createColumns();
</script>

<template>
  <NSpace vertical :size="12">
    <NCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">
            권한 목록
          </h3>
          <NButton type="primary" @click="handleAddPermission">
            권한 추가
          </NButton>
        </div>
      </template>
      <NDataTable :columns="columns" :data="permissions" :bordered="false" />
    </NCard>

    <NModal v-model:show="showPermissionModal"
            preset="card"
            :title="isEditMode ? '권한 편집' : '권한 추가'"
            :style="{ width: '600px' }"
    >
      <NForm :model="form" @submit.prevent="handleSavePermission">
        <NFormItem label="권한명" required>
          <NInput v-model:value="form.name" placeholder="새 권한의 이름을 입력하세요" />
        </NFormItem>
        <NFormItem label="세부 권한 설정">
          <NGrid :y-gap="8">
            <NGi :span="24">
              <NCheckbox v-model:checked="form.canEditTemplate">
                지표 템플릿 수정
              </NCheckbox>
            </NGi>
            <NGi :span="24">
              <NCheckbox v-model:checked="form.canEditPermission">
                권한 편집 가능
              </NCheckbox>
            </NGi>
            <NGi :span="24">
              <NCheckbox v-model:checked="form.canCreateSheet">
                데이터 시트 생성 가능
              </NCheckbox>
            </NGi>
          </NGrid>
        </NFormItem>
        <NSpace justify="end">
          <NButton @click="showPermissionModal = false">
            취소
          </NButton>
          <NButton type="primary" attr-type="submit">
            저장
          </NButton>
        </NSpace>
      </NForm>
    </NModal>
  </NSpace>
</template>
