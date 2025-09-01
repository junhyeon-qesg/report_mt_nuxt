<script setup lang="ts">
import { NTabs, NTabPane, NCard } from 'naive-ui';
import UserManagement from './UserManagement.vue';
import PermissionManagement from './PermissionManagement.vue';
import PermissionAssignment from './PermissionAssignment.vue';

defineOptions({
  name: 'AccessControl',
});
</script>

<template>
  <NCard title="사용자 접근 권한 설정">
    <NTabs type="line" animated>
      <NTabPane name="user-management" tab="사용자 관리">
        <UserManagement />
      </NTabPane>
      <NTabPane name="permission-management" tab="권한 관리">
        <PermissionManagement />
      </NTabPane>
      <NTabPane name="permission-assignment" tab="권한 지정">
        <PermissionAssignment />
      </NTabPane>
    </NTabs>
  </NCard>
</template>
