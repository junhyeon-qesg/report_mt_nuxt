<script setup lang="ts">
import '@mescius/spread-sheets/styles/gc.spread.sheets.excel2013white.css';
import '@mescius/spread-sheets-designer/styles/gc.spread.sheets.designer.light.min.css';
import * as GC from '@mescius/spread-sheets';
import '@mescius/spread-sheets-print';
import '@mescius/spread-sheets-shapes';
import '@mescius/spread-sheets-datacharts-addon';
import '@mescius/spread-sheets-slicers';
import '@mescius/spread-sheets-pivot-addon';
import '@mescius/spread-sheets-tablesheet';
import '@mescius/spread-sheets-ganttsheet';
import '@mescius/spread-sheets-reportsheet-addon';
import '@mescius/spread-sheets-formula-panel';
import '@mescius/spread-sheets-io';
import '@mescius/spread-sheets-designer-resources-en';
import * as GCDesigner from '@mescius/spread-sheets-designer';
import GCSpreadSheetsDesigner from '@mescius/spread-sheets-designer-vue';
import * as ExcelIO from '@mescius/spread-excelio';
import { saveAs } from 'file-saver';

defineOptions({
  name: 'SpreadJSEditor',
});

const excelIO = new ExcelIO.IO();

const config = ref(GCDesigner.Spread.Sheets.Designer.DefaultConfig);
config.value.commandMap = {
  Welcome: {
    title: 'Welcome',
    text: 'Welcome',
    iconClass: 'ribbon-button-welcome',
    bigButton: 'true',
    commandName: 'Welcome',
    execute: async (context, propertyName, fontItalicChecked) => {
      alert('Welcome to new designer.');
    },
  },
};

config.value.ribbon[0].buttonGroups.unshift({
  label: 'NewDesigner',
  thumbnailClass: 'welcome',
  commandGroup: {
    children: [
      {
        direction: 'vertical',
        commands: ['Welcome'],
      },
      // This is custom button ----------------end-------------
    ],
  },
});

const styleInfo = ref({ height: 'calc(100dvh - 160px)', width: '100%' });
const spreadOptions = ref({
  sheetCount: 2,
});
const designer = ref<any>(null);

async function designerInitialized(value: any) {
  designer.value = value;

  const result = await $fetch('/sample.xlsx', {
    method: 'get',
    responseType: 'blob',
  });

  const blob = new Blob([result], { type: result.type });

  excelIO.open(
    blob,
    async (json: JSON) => {
      try {
        designer.value.Spread.fromJSON(json);
      }
      catch (e: any) {
        throw new Error(e);
      }
    },
    (error: any) => {
      console.error('error', error);
    },
  );
}

function saveXlsx() {
  excelIO.save(designer.value.Spread.toJSON(), (blob: Blob) => {
    saveAs(blob, `sample.xlsx`);
  }, (error: any) => {
    console.error(error);
  });
}
</script>

<template>
  <div id="gc-designer-container">
    <div>
      <n-button @click="saveXlsx">
        엑셀 다운로드
      </n-button>
    </div>

    <GCSpreadSheetsDesigner :style-info="styleInfo"
                            :config="config"
                            :spread-options="spreadOptions"
                            @designer-initialized="designerInitialized"
    />
    <div id="log" style="margin-top: 10px; font-weight: bold;" />
  </div>
</template>

<style>
.ribbon-button-welcome {
    background-image: url('./assets/welcome.png');
}
</style>

<style>
/* 버튼에 간단한 스타일 추가 */
.custom-btn {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}
</style>
