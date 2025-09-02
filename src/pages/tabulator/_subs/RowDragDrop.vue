<script setup lang="ts">
import { TabulatorFull as Tabulator } from 'tabulator-tables'; // import Tabulator library
import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';

defineOptions({
  name: 'RowDragDrop',
});

const table = ref(null);
const tabulator = ref(null);
const tableData = reactive([{
  id: 1,
  name: 'John Doe',
  progress: 50,
  gender: 'Male',
  rating: 4,
  col: 'Red',
  dob: '1990-01-01',
  car: 'Yes',
}, {
  id: 2,
  name: 'Jane Smith',
  progress: 75,
  gender: 'Female',
  rating: 5,
  col: 'Blue',
  dob: '1992-02-02',
  car: 'No',
}]);

onMounted(() => {
  console.log(table.value);

  tabulator.value = new Tabulator(table.value, {
    height: '311px',
    movableRows: true,
    rowHeader: { headerSort: false, resizable: false, minWidth: 30, width: 30, rowHandle: true, formatter: 'handle' },
    data: tableData, // link data to table
    reactiveData: true, // enable data reactivity
    columns: [
      { editor: true, title: 'Name', field: 'name', width: 150 },
      { editor: true, title: 'Progress', field: 'progress', formatter: 'progress', sorter: 'number' },
      { editor: true, title: 'Gender', field: 'gender' },
      { editor: true, title: 'Rating', field: 'rating', formatter: 'star', formatterParams: { stars: 6 }, hozAlign: 'center', width: 120 },
      { editor: true, title: 'Favourite Color', field: 'col' },
      { editor: true, title: 'Date Of Birth', field: 'dob', hozAlign: 'center', sorter: 'date' },
      { editor: true, title: 'Driver', field: 'car', hozAlign: 'center', formatter: 'tickCross' },
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
