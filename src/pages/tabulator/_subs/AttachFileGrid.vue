<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, createVNode, render, getCurrentInstance, defineComponent, h } from 'vue';
import type { CellComponent, ColumnDefinition } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';
import { NUpload, NButton } from 'naive-ui';
import type { UploadFileInfo, UploadOnChange } from 'naive-ui';
import { TabulatorFull as Tabulator } from 'tabulator-tables'; // import Tabulator library

type RowData = {
  id: number;
  name: string;
  files: UploadFileInfo[];
};

const tableEl = ref<HTMLDivElement | null>(null);
let table: { destroy: () => void } | null = null;

// 현재 앱 컨텍스트를 하위 셀 컴포넌트 렌더에 전달 (Naive UI 테마/프로바이더 상속용)
const appContext = getCurrentInstance()?.appContext;

// Tabulator 셀에 주입할 업로드 컴포넌트
const UploadCell = defineComponent({
  name: 'UploadCell',
  props: {
    value: { type: Array as unknown as () => UploadFileInfo[] | undefined, default: undefined },
    accept: { type: String, default: '*/*' },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const onChange: UploadOnChange = ({ fileList }) => {
      console.log(fileList);

      emit('update:value', fileList as UploadFileInfo[]);
    };

    return () => h(NUpload, {
      fileList: props.value ?? [],
      defaultUpload: false, // 서버 업로드 없이 로컬 상태만 관리
      accept: props.accept,
      max: 1,
      onChange,
    }, {
      default: () => h(NButton, null, { default: () => '첨부파일' }),
    });
  },
});

onMounted(async () => {
  if (!tableEl.value) return;

  const data: RowData[] = [
    { id: 1, name: '문서 A', files: [] },
    { id: 2, name: '문서 B', files: [] },
    { id: 3, name: '문서 C', files: [] },
  ];

  const columns: ColumnDefinition[] = [
    { title: 'ID', field: 'id', width: 80 },
    { title: '이름', field: 'name' },
    {
      title: '첨부',
      field: 'files',
      hozAlign: 'center',
      vertAlign: 'middle',
      formatter: (cell: CellComponent) => {
        const container = document.createElement('div');
        const row = cell.getRow();
        const rowData = row.getData() as RowData;

        const vnode = createVNode(UploadCell, {
          value: rowData.files,
          onUpdateValue: (list: UploadFileInfo[]) => {
            row.update({ files: list, fileName: list?.[0]?.name ?? '' });
          },
          accept: '*/*',
        });

        if (appContext) vnode.appContext = appContext;
        render(vnode, container);
        (container as unknown as { __naiveUploadVnode?: unknown }).__naiveUploadVnode = vnode;
        return container;
      },
    },
    {
      title: '파일명',
      field: 'fileName',
      formatter: (cell: CellComponent) => {
        console.log(cell);

        const { files } = cell.getRow().getData() as RowData & { fileName?: string };
        return files?.[0]?.name ?? '';
      },
    },
  ];

  table = new Tabulator(tableEl.value, {
    layout: 'fitColumns',
    reactiveData: true,
    data,
    columns,
  });
});
</script>

<template>
  <div>
    <div ref="tableEl" />
  </div>
</template>

<style scoped>
/* 셀 안 버튼의 높이를 살짝 줄여 표에 맞춤 */
.n-button {
	--n-height: 28px;
	--n-padding: 0 10px;
}
</style>
