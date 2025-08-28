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

defineOptions({
  name: 'SpreadJSEditor',
});
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

function designerInitialized(value: any) {
  designer.value = value;
}
</script>

<template>
  <div id="gc-designer-container">
    <GCSpreadSheetsDesigner :style-info="styleInfo"
                            :config="config"
                            :spread-options="spreadOptions"
                            @designer-initialized="designerInitialized"
    />
  </div>
</template>

<style>
.ribbon-button-welcome {
    background-image: url('./assets/welcome.png');
}
</style>
