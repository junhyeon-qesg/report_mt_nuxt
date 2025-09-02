<script setup lang="ts">
import { NTabs, NTabPane, NCard } from 'naive-ui';
import RowDragDrop from './_subs/RowDragDrop.vue';
import TreeGrid from './_subs/TreeGrid.vue';
import SelectCellRange from './_subs/SelectCellRange.vue';
import TreeCheckboxGrid from './_subs/TreeCheckboxGrid.vue';
import AttachFileGrid from './_subs/AttachFileGrid.vue';
import PerformanceTest from './_subs/PerformanceTest.vue';

defineOptions({
  name: 'TablulatorTest',
});
</script>

<template>
  <NCard title="TablulatorTest">
    <NTabs type="line" animated>
      <NTabPane name="dragdrop" tab="Drag&Drop">
        <RowDragDrop />
      </NTabPane>
      <NTabPane name="treegrid" tab="TreeGrid">
        <TreeGrid />
      </NTabPane>
      <NTabPane name="treecheckboxgrid" tab="TreeCheckboxGrid">
        <TreeCheckboxGrid />
      </NTabPane>
      <NTabPane name="cellrange" tab="CellRange">
        <SelectCellRange />
      </NTabPane>
      <NTabPane name="attach" tab="Attach">
        <AttachFileGrid />
      </NTabPane>
      <NTabPane name="performance" tab="Performance">
        <PerformanceTest />
      </NTabPane>
    </NTabs>
  </NCard>
</template>
