<script setup lang="ts">
import { ref, computed } from 'vue';
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
  NAvatarGroup,
  NAvatar,
  NTooltip,
  NUpload,
  NUploadDragger,
  NIcon,
  NText,
  NList,
  NListItem,
  NThing,
} from 'naive-ui';

// Handsontable 모듈 등록
registerAllModules();

defineOptions({
  name: 'DataSheetDetail',
});

const route = useRoute();
const router = useRouter();
const sheetId = computed(() => route.params.id);

// --- Mock Data for Main Sheet ---
const mainSheetData = ref([
  { code: 'C-001', name: 'LNG 사용량', unit: 'm3', fy2023: 1205, fy2022: 1150, fy2021: 1100, notes: '', attachment: true },
  { code: 'C-002', name: '경유 사용량', unit: 'L', fy2023: 510, fy2022: 520, fy2021: 550, notes: '운행일지 확인', attachment: true },
  { code: 'C-003', name: '전력 사용량', unit: 'kWh', fy2023: 25100, fy2022: 24000, fy2021: 23000, notes: '', attachment: false },
  { code: 'F-001', name: '온실가스 배출량 합계', unit: 'tCO2eq', fy2023: '=SUM(D2:D4)', fy2022: '', fy2021: '', notes: '', attachment: false },
]);

const mainSheetNestedHeaders = [
  [{ label: 'Code', rowspan: 2 }, { label: '데이터명', rowspan: 2 }, { label: '단위', rowspan: 2 }, { label: '데이터 입력', colspan: 3 }, { label: '비고', rowspan: 2 }, { label: '증빙', rowspan: 2 }],
  ['FY 2023', 'FY 2022', 'FY 2021']
];

// --- Mock Data for Auxiliary Sheet ---
const auxSheetData = ref([
  { label: '총 에너지 비용', fy2023: 15000, notes: '전력+가스' },
  { label: '단위당 배출량', fy2023: '=B1/1000', notes: 'tCO2eq/MWh' },
]);

// --- Mock Data for Attachments ---
const fileList = ref([
  { id: 'f1', name: '2024년 1분기 LNG 고지서.pdf', user: '김담당', date: '2024-04-10' },
  { id: 'f2', name: '차량운행일지_202401-03.xlsx', user: '박선임', date: '2024-04-11' },
]);

const saveStatus = ref('모든 변경 사항이 저장되었습니다.');
</script>

<template>
  <div class="space-y-4">
    <NTabs type="line" animated>
      <template #suffix>
        <NSpace align="center">
          <NText type="success" :depth="3">{{ saveStatus }}</NText>
          <NTooltip>
            <template #trigger>
              <NAvatarGroup :options="[{ name: '김담당', src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg' }, { name: '이선임', src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg' }]" :size="24" :max="2" />
            </template>
            <span>김담당, 이선임 님이 편집 중입니다.</span>
          </NTooltip>
          <NButton @click="router.push('/data-sheet')">목록으로</NButton>
          <NButton type="tertiary">저장</NButton>
          <NButton type="primary">제출</NButton>
        </NSpace>
      </template>

      <NTabPane name="data-entry" tab="데이터 입력">
        <NCard>
            <template #header-extra>
                <NSpace>
                    <NButton>엑셀 양식 다운로드</NButton>
                    <NButton>가져오기</NButton>
                    <NButton>내보내기</NButton>
                </NSpace>
            </template>
            <NTabs type="bar" animated>
                <NTabPane name="all" tab="전체">
                    <NAlert type="info" title="안내" :show-icon="false" class="mb-4">
                        - 동시 편집, 자동 저장, 히스토리 기능은 MVP 이후 구현될 예정입니다.<br>
                        - 셀 우클릭 시 메모 추가, '해당 없음' 처리 등 다양한 기능을 사용할 수 있습니다.
                    </NAlert>
                    <div class="overflow-x-auto">
                        <HotTable
                        :data="mainSheetData"
                        :nestedHeaders="mainSheetNestedHeaders"
                        :manualRowMove="true"
                        :manualColumnResize="true"
                        :rowHeaders="true"
                        :comments="true"
                        :formulas="true"
                        contextMenu
                        colHeaders=" "
                        height="600"
                        width="100%"
                        license-key="non-commercial-and-evaluation"
                        >
                        <HotColumn data="code" title="Code" :readOnly="true" />
                        <HotColumn data="name" title="데이터명" :readOnly="true" />
                        <HotColumn data="unit" title="단위" :readOnly="true" />
                        <HotColumn data="fy2023" title="FY 2023" type="numeric" />
                        <HotColumn data="fy2022" title="FY 2022" type="numeric" />
                        <HotColumn data="fy2021" title="FY 2021" type="numeric" />
                        <HotColumn data="notes" title="비고" />
                        <HotColumn data="attachment" title="증빙" type="checkbox" className="htCenter" />
                        </HotTable>
                    </div>
                </NTabPane>
                <NTabPane name="hq" tab="본사">
                    <div class="p-4">본사 데이터 입력 시트</div>
                </NTabPane>
                <NTabPane name="plant-a" tab="A사업장">
                    <div class="p-4">A사업장 데이터 입력 시트</div>
                </NTabPane>
                <NTabPane name="plant-b" tab="B사업장">
                    <div class="p-4">B사업장 데이터 입력 시트</div>
                </NTabPane>
            </NTabs>
        </NCard>
      </NTabPane>

      <NTabPane name="aux-sheet" tab="보조 시트">
        <NCard title="보조 시트 (계산용)">
          <NAlert type="info" title="안내" :show-icon="false" class="mb-4">
            - 자유롭게 데이터를 입력하고, 엑셀 함수를 사용하여 계산할 수 있습니다.
            - 이곳의 데이터는 '데이터 입력' 시트에서 참조할 수 있습니다. (예: `=B2*100`)
          </NAlert>
          <div class="overflow-x-auto">
            <HotTable
              :data="auxSheetData"
              :rowHeaders="true"
              :colHeaders="true"
              :formulas="true"
              contextMenu
              height="400"
              width="100%"
              license-key="non-commercial-and-evaluation"
            />
          </div>
        </NCard>
      </NTabPane>

      <NTabPane name="attachments" tab="첨부 문서함">
        <NCard title="첨부된 증빙 문서">
          <NUpload multiple directory-dnd action="/api/upload" :max="5">
            <NUploadDragger>
              <div style="margin-bottom: 12px">
                <NIcon size="48" :depth="3"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19.47 14.22a.75.75 0 0 0-1.06-1.06l-4.94 4.94V2.75a.75.75 0 0 0-1.5 0v15.35l-4.94-4.94a.75.75 0 0 0-1.06 1.06l6.25 6.25a.75.75 0 0 0 1.06 0l6.25-6.25Z" fill="currentColor"></path><path d="M3.25 14a.75.75 0 0 0-1.5 0v5.5A2.25 2.25 0 0 0 4 21.75h16a2.25 2.25 0 0 0 2.25-2.25v-5.5a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 1-.75.75H4a.75.75 0 0 1-.75-.75v-5.5Z" fill="currentColor"></path></svg></NIcon>
              </div>
              <NText style="font-size: 16px">클릭하거나 파일을 드래그하여 업로드하세요.</NText>
              <p class="text-xs text-gray-400 mt-2">여러 파일을 동시에 올릴 수 있습니다.</p>
            </NUploadDragger>
          </NUpload>
          <NList hoverable clickable class="mt-6">
            <NListItem v-for="file in fileList" :key="file.id">
              <NThing :title="file.name">
                <template #description>
                  <NText :depth="3" class="text-xs">by {{ file.user }} on {{ file.date }}</NText>
                </template>
              </NThing>
            </NListItem>
          </NList>
        </NCard>
      </NTabPane>
    </NTabs>
  </div>
</template>

<style>
.htMenu {
  z-index: 1080 !important;
}
</style>