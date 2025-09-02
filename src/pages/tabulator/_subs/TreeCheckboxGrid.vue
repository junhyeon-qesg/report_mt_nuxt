<script setup lang="ts">
import { TabulatorFull as Tabulator } from 'tabulator-tables'; // import Tabulator library
import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';

defineOptions({
  name: 'RowDragDrop',
});

const table = ref(null);
const tabulator = ref(null);
const tableData = reactive([
  { id: 1, name: 'Parent 1', checked: true, _children: [
    { id: 2, name: 'Child 1-1', checked: false },
    { id: 3, name: 'Child 1-2', checked: false },
  ] },
  { id: 4, name: 'Parent 2', checked: false },
]);

onMounted(() => {
  console.log(table.value);

  tabulator.value = new Tabulator(table.value, {
    height: '311px',
    // rowHeader: { headerSort: false, resizable: false, minWidth: 30, width: 100 },
    data: tableData, // link data to table
    dataTree: true,
    dataTreeStartExpanded: true,
    rowFormatter: function (row) {
      const rowEl = row.getElement();

      if (rowEl.querySelector('.custom-row-checkbox')) {
        return;
      }

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('custom-row-checkbox');

      checkbox.checked = row.getData().checked || false;

      checkbox.addEventListener('change', function () {
        const checked = this.checked;
        // 현재 행 데이터
        row.update({ checked });

        // 하위 자식 노드 재귀 체크/해제
        function setChildChecked(r, state) {
          const children = r.getTreeChildren();
          children.forEach((child) => {
            child.update({ checked: state });
            setChildChecked(child, state);
          });
        }
        setChildChecked(row, checked);

        // 상위 부모 노드 상태 업데이트 (부분 체크도 고려 가능)
        function updateParentChecked(r) {
          const parent = r.getTreeParent();
          if (parent) {
            const siblings = parent.getTreeChildren();
            const allChecked = siblings.every(sib => sib.getData().checked);
            parent.update({ checked: allChecked });
            updateParentChecked(parent);
          }
        }
        updateParentChecked(row);
      });

      rowEl.insertBefore(checkbox, rowEl.firstChild);
    },

    columns: [
      { title: 'Name', field: 'name', width: 200 },
    ],
  });

  // listen for row move
  tabulator.value.on('rowMoved', function (row) {
    console.log('Row: ' + row.getData().name + ' has been moved');
  });
});
</script>

<template>
  <div>
    <div ref="table" />
  </div>
</template>
