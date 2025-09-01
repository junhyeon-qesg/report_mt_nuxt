<script setup lang="ts">
import { ref, h } from 'vue';
import { NButton, NDataTable, NModal, NCard, NForm, NFormItem, NInput, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { useAccessControlStore } from '@/stores/accessControlStore';
import type { User } from '@/stores/accessControlStore';

defineOptions({
  name: 'UserManagement',
});

const store = useAccessControlStore();
const { users } = store;

const showInviteModal = ref(false);
const inviteForm = ref({ email: '' });

const handleInviteUser = () => {
  if (inviteForm.value.email) {
    store.inviteUser(inviteForm.value.email);
    showInviteModal.value = false;
    inviteForm.value.email = '';
  }
};

const createColumns = (): DataTableColumns<User> => [
  { title: '이름', key: 'name' },
  { title: '이메일', key: 'email' },
  {
    title: '상태',
    key: 'status',
    render(_row) {
      const tagType = _row.status === 'active' ? 'success' : 'warning';
      const text = _row.status === 'active' ? '활성' : '초대중';
      return h(NTag, { type: tagType, bordered: false }, { default: () => text });
    },
  },
  {
    title: '작업',
    key: 'actions',
    render(_row) {
      return h(NButton, { size: 'small', danger: true }, { default: () => '삭제' });
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
            사용자 목록
          </h3>
          <NButton type="primary" @click="showInviteModal = true">
            사용자 초대
          </NButton>
        </div>
      </template>
      <NDataTable :columns="columns" :data="users" :bordered="false" />
    </NCard>

    <NModal v-model:show="showInviteModal"
            preset="card"
            title="사용자 초대"
            :style="{ width: '500px' }"
    >
      <NForm :model="inviteForm" @submit.prevent="handleInviteUser">
        <NFormItem label="이메일 주소" required>
          <NInput v-model:value="inviteForm.email" placeholder="초대할 사용자의 이메일을 입력하세요" />
        </NFormItem>
        <NSpace justify="end">
          <NButton @click="showInviteModal = false">
            취소
          </NButton>
          <NButton type="primary" attr-type="submit">
            초대 보내기
          </NButton>
        </NSpace>
      </NForm>
    </NModal>
  </NSpace>
</template>
