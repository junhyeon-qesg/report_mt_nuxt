<script lang="ts">
import { defineComponent } from 'vue';
import { HotTable, HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';

import { data } from './constants';

import { alignHeaders, addClassesToRows } from './hooks-callbacks';

// register Handsontable's modules
registerAllModules();

export default defineComponent({
  name: 'DataGrid',
  components: {
    HotTable,
    HotColumn,
  },
  computed: {
    alignHeadersProp() {
      return alignHeaders;
    },

    addClassesToRowsProp() {
      return addClassesToRows;
    },

    dataProp() {
      return data;
    },
  },
});
</script>

<template>
  <div id="example">
    <HotTable :data="dataProp"
              :height="450"
              :col-widths="[170, 222, 130, 120, 120, 140, 156]"
              :col-headers="[
                'Company name',
                'Name',
                'Sell date',
                'In stock',
                'Qty',
                'Order ID',
                'Country',
              ]"
              :dropdown-menu="true"
              :hidden-columns="{
                indicators: true,
              }"
              :context-menu="true"
              :multi-column-sorting="true"
              :filters="true"
              :row-headers="true"
              :after-get-col-header="alignHeadersProp"
              :before-renderer="addClassesToRowsProp"
              :manual-row-move="true"
              :auto-wrap-row="true"
              :auto-wrap-col="true"
              license-key="non-commercial-and-evaluation"
    >
      <HotColumn data="companyName" />
      <HotColumn data="name" />
      <HotColumn data="sellDate" type="date" :allow-invalid="false" />
      <HotColumn data="inStock" type="checkbox" class-name="htCenter" />
      <HotColumn data="quantity" type="numeric" />
      <HotColumn data="orderId" />
      <HotColumn data="country" />
    </HotTable>
  </div>
</template>

<style lang="css">
/*
  A stylesheet customizing app (custom renderers)
*/

table.htCore tr.odd td {
  background: #fafbff;
}

/*
  A stylesheet customizing Handsontable style
*/

.handsontable {
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Helvetica Neue", Arial, sans-serif;
  font-weight: 400;
}

.handsontable .collapsibleIndicator {
  text-align: center;
}

td .error {
  background: #ff4c42;
}
</style>
