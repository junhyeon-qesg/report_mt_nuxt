<template>
  <div class="h-screen w-full p-8 bg-gray-100">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">AG Grid Enterprise Tree Data with Nuxt 3 & TypeScript</h1>

    <!-- AG Grid Vue Component -->
    <ag-grid-vue
      class="ag-theme-quartz-dark"
      style="height: 600px; width: 100%;"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      :treeData="true"
      :getDataPath="getDataPath"
      :groupDefaultExpanded="1"
      :pagination="true"
      :paginationPageSize="15"
      :rowDragManaged="true"
      :enableRangeSelection="true"
      @grid-ready="onGridReady"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { AgGridVue } from "ag-grid-vue3";
import {
  ModuleRegistry,
  type GridOptions,
  type GridReadyEvent,
} from "ag-grid-community";
import {
  AllEnterpriseModule,
  LicenseManager,
  IntegratedChartsModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";

ModuleRegistry.registerModules([
  AllEnterpriseModule,
  TreeDataModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
]);

LicenseManager.setLicenseKey("[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-092282}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{30 September 2025}____[v3]_[0102]_MTc1OTE4NjgwMDAwMA==b14af90085bc735deadf736da75f63af");

interface IRow {
  hierarchy: string[];
  price: number;
  electric: boolean;
}

const columnDefs = ref<GridOptions<IRow>['columnDefs']>([
  {
    headerName: "Hierarchy",
    field: "hierarchy",
    cellRenderer: "agGroupCellRenderer",
    rowDrag: true, // 🔥 드래그 핸들 활성화
  },
  { headerName: "Price", field: "price", editable: true },
  { headerName: "Electric", field: "electric", editable: true },
]);

const rowData = ref<IRow[]>([]);

const defaultColDef = ref<GridOptions<IRow>['defaultColDef']>({
  flex: 1,
  minWidth: 150,
  sortable: true,
  resizable: true,
});

const getDataPath = (data: IRow) => data.hierarchy;

const onGridReady = (params: GridReadyEvent) => {
  console.log("Grid with TreeData and Row Reorder is ready!");
};

onMounted(() => {
  rowData.value = [
    { hierarchy: ["Cars", "Tesla", "Model Y"], price: 64950, electric: true },
    { hierarchy: ["Cars", "Tesla", "Model 3"], price: 53950, electric: true },
    { hierarchy: ["Cars", "Ford", "F-Series"], price: 33850, electric: false },
    { hierarchy: ["Cars", "Toyota", "Corolla"], price: 29600, electric: false },
    { hierarchy: ["Cars", "BMW", "i4"], price: 51400, electric: true },
    { hierarchy: ["Cars", "Hyundai", "IONIQ 5"], price: 41450, electric: true },
    { hierarchy: ["Cars", "Honda", "Civic"], price: 23950, electric: false },
    { hierarchy: ["Trucks", "Chevrolet", "Silverado"], price: 36800, electric: false },
    { hierarchy: ["Trucks", "Rivian", "R1T"], price: 73000, electric: true },
  ];
});
</script>
