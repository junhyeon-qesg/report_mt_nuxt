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
    id: 1,
    name: 'John Doe',
    progress: 50,
    gender: 'Male',
    rating: 4,
    col: 'Red',
    dob: '1990-01-01',
    car: 'Yes',
  },
  {
    id: 2,
    name: 'Jane Smith',
    progress: 75,
    gender: 'Female',
    rating: 5,
    col: 'Blue',
    dob: '1992-02-02',
    car: 'No',
  },
  {
    id: 3,
    name: 'Michael Johnson',
    progress: 60,
    gender: 'Male',
    rating: 3,
    col: 'Green',
    dob: '1995-03-03',
    car: 'Yes',
  },
  {
    id: 4,
    name: 'Emily Davis',
    progress: 80,
    gender: 'Female',
    rating: 5,
    col: 'Purple',
    dob: '1998-04-04',
    car: 'No',
  },
  {
    id: 5,
    name: 'David Wilson',
    progress: 90,
    gender: 'Male',
    rating: 5,
    col: 'Orange',
    dob: '1988-05-05',
    car: 'Yes',
  },
]);

onMounted(() => {
  console.log(table.value);

  tabulator.value = new Tabulator(table.value, {
    height: '311px',
    // rowHeader: { headerSort: false, resizable: false, minWidth: 30, width: 100 },
    data: tableData, // link data to table
    reactiveData: true, // enable data reactivity
    // enable range selection
    selectableRange: 1,
    selectableRangeColumns: true,
    selectableRangeRows: true,
    selectableRangeClearCells: true,

    // change edit trigger mode to make cell navigation smoother
    editTriggerEvent: 'dblclick',

    // configure clipboard to allow copy and paste of range format data
    clipboard: true,
    clipboardCopyStyled: false,
    clipboardCopyConfig: {
      rowHeaders: false,
      columnHeaders: false,
    },
    clipboardCopyRowRange: 'range',
    clipboardPasteParser: 'range',
    clipboardPasteAction: 'range',

    rowHeader: { resizable: false, frozen: true, width: 40, hozAlign: 'center', formatter: 'rownum', cssClass: 'range-header-col', editor: false },

    // setup cells to work as a spreadsheet
    columnDefaults: {
      headerSort: false,
      headerHozAlign: 'center',
      editor: 'input',
      resizable: 'header',
      width: 100,
    },
    columns: [
      { editable: true, title: 'Name', field: 'name', width: 200 },
      { editable: true, title: 'Progress', field: 'progress', width: 100, hozAlign: 'right', sorter: 'number' },
      { editable: true, title: 'Gender', field: 'gender', width: 100 },
      { editable: true, title: 'Rating', field: 'rating', hozAlign: 'center', width: 80 },
      { editable: true, title: 'Favourite Color', field: 'col' },
      { editable: true, title: 'Date Of Birth', field: 'dob', hozAlign: 'center', sorter: 'date' },
      { editable: true, title: 'Driver', field: 'car', hozAlign: 'center', width: 100 },
    ],
  });
});
</script>

<template>
  <div>
    <div ref="table" />
  </div>
</template>
