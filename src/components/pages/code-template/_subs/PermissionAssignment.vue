<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAccessControlStore } from '@/stores/accessControlStore';
import type { User } from '@/stores/accessControlStore';
import draggable from 'vuedraggable';
import { NCard, NTag, NEmpty } from 'naive-ui';

defineOptions({
  name: 'PermissionAssignment',
});

const store = useAccessControlStore();

const selectedUserIds = ref<number[]>([]);

const toggleSelection = (userId: number, event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) { // Ctrl or Cmd key for multi-selection
    const index = selectedUserIds.value.indexOf(userId);
    if (index > -1) {
      selectedUserIds.value.splice(index, 1);
    } else {
      selectedUserIds.value.push(userId);
    }
  } else { // Single selection
    selectedUserIds.value = [userId];
  }
};

const isSelected = (userId: number) => selectedUserIds.value.includes(userId);

const unassignedUsers = computed({
  get: () => store.unassignedUsers.map(user => ({ ...user, selected: isSelected(user.id) })),
  set: (_users: User[]) => {
        // This is a bit of a hack to make vuedraggable work with a getter.
        // The actual update logic is handled by the `update` event on the draggable component.
    },
});

const getPermissionUsers = (permissionId: string) => {
  return computed({
    get: () => store.getUsersByPermission(permissionId).map(user => ({ ...user, selected: isSelected(user.id) })),
    set: (users: User[]) => {
      store.updateAssignments(permissionId, users);
    }
  });
};

const onDragStart = (event: any) => {
  // If the dragged item is not part of the current selection, clear selection and select it
  const draggedUserId = event.item._underlying_vm_.id; // Access the actual user ID
  if (!isSelected(draggedUserId)) {
    selectedUserIds.value = [draggedUserId];
  }
  // Here, you would typically prepare the "virtual drag icon" if implementing step 3
  // For now, we just ensure the dragged item is selected.
};

const onDragEnd = (event: any) => {
  // Clear selection after drag ends
  selectedUserIds.value = [];
};


</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <!-- Permissions Columns -->
    <div class="col-span-9">
      <div class="grid grid-cols-3 gap-4">
        <div v-for="permission in store.permissions" :key="permission.id" class="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 border dark:border-gray-700">
          <h4 class="font-semibold text-center p-2 border-b mb-2">
            {{ permission.name }}
          </h4>
          <draggable
                    class="h-full min-h-[200px]"
                    :list="getPermissionUsers(permission.id).value"
                    group="users"
                    item-key="id"
                    @change="(event) => store.updateAssignments(permission.id, getPermissionUsers(permission.id).value)"
                    @start="onDragStart"
                    @end="onDragEnd"
                >
                    <template #item="{ element }">
                        <div :class="['p-2 m-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded cursor-move text-sm', { 'selected-item': element.selected }]" @click="(event) => toggleSelection(element.id, event)">
                            {{ element.name }} ({{ element.email }})
                        </div>
                    </template>
            <template #footer>
              <div v-if="getPermissionUsers(permission.id).value.length === 0" class="flex items-center justify-center h-full">
                <NEmpty :description="`여기에 사용자를 드래그하세요`" size="small" class="text-gray-400 dark:text-gray-500" />
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>

    <!-- Unassigned Users Column -->
    <div class="col-span-3">
      <NCard title="미지정 사용자">
        <draggable class="min-h-[200px] p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
                   :list="unassignedUsers"
                   group="users"
                   item-key="id"
        >
          <template #item="{ element }">
            <div :class="['p-2 m-1 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded cursor-move text-sm', { 'selected-item': element.selected }]" @click="(event) => toggleSelection(element.id, event)">
              <NTag :bordered="false" :type="element.status === 'active' ? 'success' : 'warning'" class="mr-2">
                {{ element.status === 'active' ? '활성' : '초대중' }}
              </NTag>
              {{ element.name }}
            </div>
          </template>
          <template #footer>
            <div v-if="unassignedUsers.length === 0" class="flex items-center justify-center h-full">
              <NEmpty description="모든 사용자가 할당되었습니다" size="small" class="text-gray-400 dark:text-gray-500" />
            </div>
          </template>
        </draggable>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.selected-item {
  border: 2px solid #1890ff; /* Blue border for selected items */
  box-shadow: 0 0 5px rgba(24, 144, 255, 0.5); /* Blue glow */
}
</style>
