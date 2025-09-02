<script setup lang="ts">
import { TabulatorFull as Tabulator } from 'tabulator-tables'; // import Tabulator library
import 'tabulator-tables/dist/css/tabulator_semanticui.min.css';

defineOptions({
  name: 'RowDragDrop',
});

const table = ref(null);
const tabulator = ref(null);
const tableData = reactive([
  {
    name: 'Oli Bob', location: 'United Kingdom', gender: 'male', col: 'red', dob: '14/04/1984', _children: [
      { name: 'Mary May', location: 'Germany', gender: 'female', col: 'blue', dob: '14/05/1982' },
      { name: 'Christine Lobowski', location: 'France', gender: 'female', col: 'green', dob: '22/05/1982' },
      {
        name: 'Brendon Philips', location: 'USA', gender: 'male', col: 'orange', dob: '01/08/1980', _children: [
          { name: 'Margret Marmajuke', location: 'Canada', gender: 'female', col: 'yellow', dob: '31/01/1999' },
          { name: 'Frank Harbours', location: 'Russia', gender: 'male', col: 'red', dob: '12/05/1966' },
        ],
      },
    ],
  },
  { name: 'Jamie Newhart', location: 'India', gender: 'male', col: 'green', dob: '14/05/1985' },
  {
    name: 'Gemma Jane', location: 'China', gender: 'female', col: 'red', dob: '22/05/1982', _children: [
      { name: 'Emily Sykes', location: 'South Korea', gender: 'female', col: 'maroon', dob: '11/11/1970' },
    ],
  },
  { name: 'James Newman', location: 'Japan', gender: 'male', col: 'red', dob: '22/03/1998' },
]);

onMounted(() => {
  console.log(table.value);

  tabulator.value = new Tabulator(table.value, {
    height: '311px',
    // rowHeader: { headerSort: false, resizable: false, minWidth: 30, width: 100 },
    data: tableData, // link data to table
    dataTree: true,
    dataTreeStartExpanded: true,
    columns: [
      { title: 'Name', field: 'name', width: 200, responsive: 0 }, // never hide this column
      { title: 'Location', field: 'location', width: 150 },
      { title: 'Gender', field: 'gender', width: 150, responsive: 2 }, // hide this column first
      { title: 'Favourite Color', field: 'col', width: 150 },
      { title: 'Date Of Birth', field: 'dob', hozAlign: 'center', sorter: 'date', width: 150 },
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
