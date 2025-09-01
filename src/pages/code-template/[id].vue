<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HotTable, HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';

import {
  NTabs,
  NTabPane,
  NCard,
  NButton,
  NSpace,
  NAlert,
  NDataTable,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NTree,
} from 'naive-ui';
import type { DataTableColumns, TreeOption } from 'naive-ui';
import AccessControl from '~/pages/code-template/_subs/AccessControl.vue';

// Handsontable 모듈 등록
registerAllModules();

defineOptions({
  name: 'CodeTemplateDetail',
});

const route = useRoute();
const router = useRouter();
const isEditMode = computed(() => route.params.id !== 'new');

// --- Mock Data & Settings for Handsontable ---

const hotData = ref([
  { code: 'C-001', guide_l: '온실가스 배출량', guide_m: 'Scope 1', guide_s: '직접연소', name: 'LNG 사용량' },
  { code: 'C-002', guide_l: '온실가스 배출량', guide_m: 'Scope 1', guide_s: '직접연소', name: '경유 사용량' },
  { code: 'C-003', guide_l: '온실가스 배출량', guide_m: 'Scope 2', guide_s: '간접배출', name: '전력 사용량' },
  { code: 'W-001', guide_l: '수자원 사용량', guide_m: '용수', guide_s: '직접취수', name: '지하수 사용량' },
  { code: 'W-002', guide_l: '수자원 사용량', guide_m: '용수', guide_s: '공급망', name: '상수도 사용량' },
  { code: 'D-001', guide_l: '폐기물 발생량', guide_m: '생활 폐기물', guide_s: '-', name: '종량제 폐기물' },
  { code: 'D-002', guide_l: '폐기물 발생량', guide_m: '지정 폐기물', guide_s: '-', name: '폐유기용제' },
  { code: 'S-001', guide_l: '안전보건', guide_m: '재해율', guide_s: '-', name: '총 재해 건수' },
  { code: 'S-002', guide_l: '안전보건', guide_m: '교육', guide_s: '-', name: '임직원 안전보건 교육 시간' },
  { code: 'F-001', guide_l: '산출식', guide_m: '-', guide_s: '-', name: '온실가스 배출량 합계' },
]);

const nestedHeaders = [
  [{ label: 'Code', rowspan: 2 }, { label: '가이드 컬럼', colspan: 5 }, { label: '단위', rowspan: 2 }, { label: '데이터 유형', rowspan: 2 }, { label: '데이터 입력란', colspan: 3 }, { label: 'Placeholder', rowspan: 2 }, { label: '비고', rowspan: 2 }, { label: '증빙 파일 업로드', rowspan: 2 }],
  ['대분류', '중분류', '소분류', '데이터명', '데이터 작성 기준', 'FY 2023', 'FY 2022', 'FY 2021'],
];

// --- Group Assignment Logic ---
const showGroupModal = ref(false);
const isGroupEditMode = ref(false);
const currentGroupId = ref<number | null>(null);

const groups = ref([
  { id: 1, category: '온실가스', name: 'Scope 1 배출량', codes: ['C-001', 'C-002'] },
  { id: 2, category: '수자원', name: '전체 용수 사용량', codes: ['W-001', 'W-002'] },
]);

const groupForm = ref({
  category: '',
  name: '',
  codes: [] as string[],
});

const codeTreeData: TreeOption[] = [
  {
    label: '온실가스 배출량',
    key: 'C',
    children: [
      {
        label: 'Scope 1',
        key: 'C-S1',
        children: [
          { label: 'LNG 사용량 (C-001)', key: 'C-001' },
          { label: '경유 사용량 (C-002)', key: 'C-002' },
        ],
      },
      {
        label: 'Scope 2',
        key: 'C-S2',
        children: [
          { label: '전력 사용량 (C-003)', key: 'C-003' },
        ],
      },
    ],
  },
  {
    label: '수자원 사용량',
    key: 'W',
    children: [
      {
        label: '용수',
        key: 'W-W',
        children: [
          { label: '지하수 사용량 (W-001)', key: 'W-001' },
          { label: '상수도 사용량 (W-002)', key: 'W-002' },
        ],
      },
    ],
  },
  {
    label: '폐기물 발생량',
    key: 'D',
    children: [
      { label: '종량제 폐기물 (D-001)', key: 'D-001' },
      { label: '폐유기용제 (D-002)', key: 'D-002' },
    ],
  },
];

const handleOpenGroupModal = (group: any | null = null) => {
  if (group) {
    isGroupEditMode.value = true;
    currentGroupId.value = group.id;
    groupForm.value = { ...group };
  }
  else {
    isGroupEditMode.value = false;
    currentGroupId.value = null;
    groupForm.value = { category: '', name: '', codes: [] };
  }
  showGroupModal.value = true;
};

const handleSaveGroup = () => {
  if (isGroupEditMode.value) {
    const index = groups.value.findIndex(g => g.id === currentGroupId.value);
    if (index !== -1) groups.value[index] = { ...groupForm.value, id: currentGroupId.value! };
  }
  else {
    const newId = groups.value.length > 0 ? Math.max(...groups.value.map(g => g.id)) + 1 : 1;
    groups.value.push({ ...groupForm.value, id: newId });
  }
  showGroupModal.value = false;
};

const groupColumns: DataTableColumns<any> = [
  { title: '카테고리', key: 'category' },
  { title: '그룹명', key: 'name' },
  { title: '적용 Code 수', key: 'codes', render: row => row.codes.length },
  {
    title: 'Action', key: 'actions', width: 100,
    render(row) {
      return h(NButton, { size: 'small', onClick: () => handleOpenGroupModal(row) }, { default: () => '편집' });
    },
  },
];

// --- Business Unit Scope ---
const scopeData = computed(() =>
  hotData.value.map(item => ({
    code: item.code,
    name: item.name,
    hq: true, // dummy data
    plant_a: false, // dummy data
  })),
);

const scopeColumns: DataTableColumns<any> = [
  { title: 'Code', key: 'code', width: 100, ellipsis: { tooltip: true } },
  { title: '데이터명', key: 'name', ellipsis: { tooltip: true } },
  { title: '본사', key: 'hq', align: 'center' },
  { title: 'A사업장', key: 'plant_a', align: 'center' },
];
</script>

<template>
  <div class="space-y-4">
    <NTabs type="card" animated>
      <template #suffix>
        <NSpace>
          <NButton @click="router.push('/code-template')">
            목록으로
          </NButton>
          <NButton v-if="!isEditMode">
            템플릿 복사
          </NButton>
          <NButton type="primary">
            저장
          </NButton>
        </NSpace>
      </template>

      <NTabPane name="template-edit" tab="지표 템플릿 편집">
        <NCard>
          <div class="overflow-x-auto">
            <HotTable :data="hotData"
                      :nested-headers="nestedHeaders"
                      :manual-row-move="true"
                      :manual-column-resize="true"
                      :row-headers="true"
                      col-headers=" "
                      height="500"
                      width="100%"
                      license-key="non-commercial-and-evaluation"
            >
              <HotColumn data="code" title="Code" />
              <HotColumn data="guide_l" title="대분류" />
              <HotColumn data="guide_m" title="중분류" />
              <HotColumn data="guide_s" title="소분류" />
              <HotColumn data="name" title="데이터명" />
              <HotColumn data="criteria" title="데이터 작성 기준" />
              <HotColumn data="unit"
                         title="단위"
                         type="dropdown"
                         :source="['m3', 'L', 'kWh', 'tCO2eq', 'g']"
              />
              <HotColumn data="dataType"
                         title="데이터 유형"
                         type="dropdown"
                         :source="['number', 'string', 'function']"
              />
              <HotColumn data="fy2023" title="FY 2023" type="numeric" />
              <HotColumn data="fy2022" title="FY 2022" type="numeric" />
              <HotColumn data="fy2021" title="FY 2021" type="numeric" />
              <HotColumn data="placeholder" title="Placeholder" />
              <HotColumn data="notes" title="비고" />
              <HotColumn data="upload"
                         title="증빙 파일 업로드"
                         type="checkbox"
                         class-name="htCenter"
              />
            </HotTable>
          </div>
        </NCard>
      </NTabPane>

      <NTabPane v-if="isEditMode" name="group-assign" tab="그룹 지정">
        <NCard title="지표 그룹 목록">
          <template #header-extra>
            <NButton @click="handleOpenGroupModal()">
              그룹 추가
            </NButton>
          </template>
          <NDataTable :columns="groupColumns" :data="groups" :bordered="false" />
        </NCard>
      </NTabPane>

      <NTabPane v-if="isEditMode" name="scope-edit" tab="사업장 범위 편집">
        <NCard title="사업장 범위 설정">
          <template #header-extra>
            <NButton>사업장 추가</NButton>
          </template>
          <HotTable :data="hotData"
                    :nested-headers="nestedHeaders"
                    :manual-row-move="true"
                    :manual-column-resize="true"
                    :row-headers="true"
                    col-headers=" "
                    height="500"
                    width="100%"
                    license-key="non-commercial-and-evaluation"
          >
            <HotColumn data="code" title="Code" />
            <HotColumn data="guide_l" title="대분류" />
            <HotColumn data="guide_m" title="중분류" />
            <HotColumn data="guide_s" title="소분류" />
            <HotColumn data="name" title="데이터명" />
            <HotColumn data="criteria" title="데이터 작성 기준" />
            <HotColumn data="unit"
                       title="단위"
                       type="dropdown"
                       :source="['m3', 'L', 'kWh', 'tCO2eq', 'g']"
            />
            <HotColumn data="dataType"
                       title="데이터 유형"
                       type="dropdown"
                       :source="['number', 'string', 'function']"
            />
            <HotColumn data="fy2023" title="FY 2023" type="numeric" />
            <HotColumn data="fy2022" title="FY 2022" type="numeric" />
            <HotColumn data="fy2021" title="FY 2021" type="numeric" />
            <HotColumn data="placeholder" title="Placeholder" />
            <HotColumn data="notes" title="비고" />
            <HotColumn data="upload"
                       title="증빙 파일 업로드"
                       type="checkbox"
                       class-name="htCenter"
            />
          </HotTable>
        </NCard>
      </NTabPane>

      <NTabPane v-if="isEditMode" name="access-control" tab="접근 권한 편집">
        <AccessControl />
      </NTabPane>

      <NTabPane v-if="isEditMode" name="preview" tab="미리보기">
        <NCard title="데이터 시트 작성 화면 미리보기">
          <NAlert type="warning" title="구현 예정">
            현재 설정된 템플릿을 기반으로 실제 데이터 시트 작성 화면이 어떻게 보일지 미리 확인하는 기능입니다. 이곳에서 입력한 데이터는 저장되지 않습니다.
          </NAlert>
        </NCard>
      </NTabPane>
    </NTabs>

    <!-- Group Edit/Create Modal -->
    <NModal v-model:show="showGroupModal"
            preset="card"
            :style="{ width: '600px' }"
            :title="isGroupEditMode ? '그룹 편집' : '그룹 생성'"
    >
      <NForm :model="groupForm">
        <NFormItem label="카테고리" required>
          <NInput v-model:value="groupForm.category" placeholder="예: 온실가스" />
        </NFormItem>
        <NFormItem label="그룹명" required>
          <NInput v-model:value="groupForm.name" placeholder="예: Scope 1 배출량" />
        </NFormItem>
        <NFormItem label="Code 선택">
          <div style="width: 100%; border: 1px solid #efefef; border-radius: 3px; padding: 8px;">
            <NTree v-model:checked-keys="groupForm.codes"
                   block-line
                   checkable
                   cascade
                   :data="codeTreeData"
                   style="max-height: 300px; overflow-y: auto;"
            />
          </div>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton @click="showGroupModal = false">
            취소
          </NButton>
          <NButton type="primary" @click="handleSaveGroup">
            저장
          </NButton>
        </NSpace>
      </template>
    </NModal>
  </div>
</template>

<style>
.htMenu {
  z-index: 1080 !important;
}
</style>
