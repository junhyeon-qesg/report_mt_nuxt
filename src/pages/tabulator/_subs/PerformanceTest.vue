<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineOptions({ name: 'TabulatorPerformanceTest' });

const table = ref<HTMLDivElement | null>(null);
type TabulatorLike = { destroy: () => void };
let tabulator: TabulatorLike | null = null;

// 10만 건 더미 데이터 생성 (빠른 루프)
function buildData(count = 10000) {
  const arr = new Array(count);
  for (let i = 0; i < count; i++) {
    arr[i] = {
      id: i + 1,
      name: `User ${i + 1}`,
      progress: Math.floor(Math.random() * 101),
      gender: i % 2 === 0 ? 'Male' : 'Female',
      rating: (i % 5) + 1,
      col: ['Red', 'Blue', 'Green', 'Purple', 'Orange'][i % 5],
      dob: `199${i % 10}-0${(i % 9) + 1}-1${i % 9}`,
      car: i % 3 === 0 ? 'Yes' : 'No',
    };
  }
  return arr;
}

onMounted(async () => {
  if (!table.value) return;

  // 동적 import로 CSR에서만 로드 (타입/SSR 이슈 회피)
  const mod = await import('tabulator-tables');
  await import('tabulator-tables/dist/css/tabulator_semanticui.min.css');
  type TabulatorCtor = new (element: HTMLElement, options: unknown) => TabulatorLike;
  const TabulatorCtor = (
    (mod as unknown as { TabulatorFull?: unknown; default?: unknown }).TabulatorFull
    ?? (mod as unknown as { default?: unknown }).default
    ?? (mod as unknown)
  ) as TabulatorCtor;

  const data = buildData(10000);

  tabulator = new TabulatorCtor(table.value, {
    height: '70vh',
    data,
    // 성능 핵심: 가상 DOM
    virtualDom: true,
    // SelectCellRange 예시에서 일부 UX 요소 차용
    selectableRange: 1,
    selectableRangeColumns: true,
    selectableRangeRows: true,
    selectableRangeClearCells: true,
    editTriggerEvent: 'dblclick',
    clipboard: true,
    clipboardCopyStyled: false,
    clipboardCopyConfig: { rowHeaders: false, columnHeaders: false },
    clipboardCopyRowRange: 'range',
    clipboardPasteParser: 'range',
    clipboardPasteAction: 'range',
    rowHeader: { resizable: false, frozen: true, width: 50, hozAlign: 'center', formatter: 'rownum' },
    columnDefaults: {
      headerSort: false,
      headerHozAlign: 'center',
      resizable: 'header',
      width: 120,
      editor: 'input',
    },
    columns: [
      { title: 'ID', field: 'id', width: 90, hozAlign: 'right' },
      { title: 'Name', field: 'name', width: 180 },
      { title: 'Progress', field: 'progress', width: 120, hozAlign: 'right', sorter: 'number' },
      { title: 'Gender', field: 'gender', width: 120 },
      { title: 'Rating', field: 'rating', width: 100, hozAlign: 'center' },
      { title: 'Favourite Color', field: 'col', width: 160 },
      { title: 'Date Of Birth', field: 'dob', width: 140, hozAlign: 'center', sorter: 'date' },
      { title: 'Driver', field: 'car', width: 110, hozAlign: 'center' },
    ],
  });
});

onBeforeUnmount(() => {
  try {
    tabulator?.destroy();
  }
  catch {
    // no-op
  }
  tabulator = null;
});
</script>

<template>
  <div>
    <div ref="table" />
  </div>
</template>
