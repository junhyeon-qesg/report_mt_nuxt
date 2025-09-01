<script setup lang="ts">
import { ref, computed, h, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NCard,
  NButton,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NUpload,
  NAlert,
  NTag,
  NText,
} from 'naive-ui';
import type { SelectOption, UploadFileInfo } from 'naive-ui';
import { useDataSheetManageStore } from '@/stores/dataSheetManageStore';

defineOptions({
  name: 'DataSheetManageDetail',
});

const route = useRoute();
const router = useRouter();
const dataSheetId = computed(() => Number(route.params.id));

const store = useDataSheetManageStore();
const dataSheet = computed(() => store.getDataSheetById(dataSheetId.value));

// If dataSheet is not found, navigate back or show error
watch(dataSheet, (newValue) => {
  if (!newValue) {
    router.replace('/data-sheet-manage'); // Redirect if data sheet not found
  }
}, { immediate: true });

// --- Rejection Modal Logic ---
const showRejectModal = ref(false);
const rejectForm = ref({
  targetGroups: [] as string[],
  reason: '',
  fileList: [] as UploadFileInfo[],
});

const groupOptions = ref<SelectOption[]>([
  { label: '온실가스 그룹 A', value: 'group-a' },
  { label: '수자원 그룹 B', value: 'group-b' },
  { label: '폐기물 그룹 C', value: 'group-c' },
]);

const handleReject = () => {
  showRejectModal.value = true;
};

const submitRejection = () => {
  if (dataSheet.value) {
    store.rejectDataSheet(dataSheet.value.id, {
      groups: rejectForm.value.targetGroups,
      reason: rejectForm.value.reason,
      attachments: rejectForm.value.fileList.map(file => file.name),
    });
    console.log('Data Sheet Rejected:', dataSheet.value);
    // TODO: Send email to 담당자
    showRejectModal.value = false;
  }
};

// --- Approval Logic ---
const handleApprove = () => {
  if (dataSheet.value) {
    store.approveDataSheet(dataSheet.value.id);
    console.log('Data Sheet Approved:', dataSheet.value);
    // TODO: Send email to 담당자
  }
};

// --- File Upload Logic ---
const handleFileUpload = ({ file, fileList }: { file: UploadFileInfo, fileList: UploadFileInfo[] }) => {
  rejectForm.value.fileList = fileList;
  return file;
};

const handleRemoveFile = ({ file, fileList }: { file: UploadFileInfo, fileList: UploadFileInfo[] }) => {
  rejectForm.value.fileList = fileList;
  return true;
};

// --- Computed properties for UI ---
const isRejected = computed(() => dataSheet.value?.status === '반려됨');
const isApproved = computed(() => dataSheet.value?.status === '승인됨');
const isSubmitted = computed(() => dataSheet.value?.status === '제출됨');

const statusTagType = computed(() => {
  switch (dataSheet.value?.status) {
    case '승인됨': return 'success';
    case '반려됨': return 'error';
    case '제출됨': return 'warning';
    default: return 'default';
  }
});

const getGroupName = (value: string) => {
  const option = groupOptions.value.find(opt => opt.value === value);
  return option ? option.label : value;
};

</script>

<template>
  <div class="space-y-4">
    <NCard :title="dataSheet?.title">
      <template #header-extra>
        <NSpace>
          <NButton @click="router.push('/data-sheet-manage')">목록으로</NButton>
          <NButton type="success" @click="handleApprove" :disabled="!isSubmitted">승인</NButton>
          <NButton type="error" @click="handleReject" :disabled="!isSubmitted">반려</NButton>
        </NSpace>
      </template>

      <NSpace vertical>
        <NText><strong>제출자:</strong> {{ dataSheet?.submitter }}</NText>
        <NText><strong>제출일:</strong> {{ dataSheet?.submissionDate }}</NText>
        <NText><strong>상태:</strong> <NTag :type="statusTagType" bordered="false">{{ dataSheet?.status }}</NTag></NText>
        <NText><strong>내용:</strong></NText>
        <NCard embedded :bordered="false" class="bg-gray-50 dark:bg-gray-800">
          <p>{{ dataSheet?.content }}</p>
        </NCard>

        <NAlert v-if="isRejected" type="error" title="반려 사유" closable>
          <NText><strong>대상 그룹:</strong>
            <NTag v-for="group in dataSheet?.rejectionReason?.groups" :key="group" type="info" size="small" class="mr-1">
              {{ getGroupName(group) }}
            </NTag>
          </NText><br>
          <NText><strong>사유:</strong> {{ dataSheet?.rejectionReason?.reason }}</NText><br>
          <NText v-if="dataSheet?.rejectionReason?.attachments?.length"><strong>첨부 자료:</strong>
            <span v-for="(file, index) in dataSheet?.rejectionReason?.attachments" :key="index" class="mr-1">
              {{ file }}{{ index < dataSheet?.rejectionReason?.attachments.length - 1 ? ',' : '' }}
            </span>
          </NText>
          <template #footer>
            <NText type="warning">반려된 데이터 시트는 제출 버튼이 다시 활성화됩니다.</NText>
          </template>
        </NAlert>
      </NSpace>
    </NCard>

    <!-- Reject Modal -->
    <NModal
      v-model:show="showRejectModal"
      preset="card"
      title="데이터 시트 반려"
      :style="{ width: '600px' }"
    >
      <NForm :model="rejectForm">
        <NFormItem label="대상 그룹" path="targetGroups" required>
          <NSelect
            v-model:value="rejectForm.targetGroups"
            multiple
            :options="groupOptions"
            placeholder="반려할 그룹을 선택하세요"
          />
        </NFormItem>
        <NFormItem label="반려 사유" path="reason" required>
          <NInput
            v-model:value="rejectForm.reason"
            type="textarea"
            placeholder="반려 사유를 상세히 입력하세요"
            :rows="4"
          />
        </NFormItem>
        <NFormItem label="참고 자료 (선택 사항)" path="fileList">
          <NUpload
            v-model:file-list="rejectForm.fileList"
            multiple
            :max="3"
            :on-update:file-list="handleFileUpload"
            :on-remove="handleRemoveFile"
          >
            <NButton>파일 선택</NButton>
          </NUpload>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showRejectModal = false">취소</NButton>
          <NButton type="error" @click="submitRejection">반려 제출</NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>
