<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { HotTable } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import { HyperFormula } from 'hyperformula';
import 'handsontable/dist/handsontable.full.css';
import ExcelJS from 'exceljs';

// Handsontable 모듈 등록
registerAllModules();

async function readXlsxWorkbookFromFile(filename) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filename);
  return workbook;
}

function convertXlsxWorkbookToJavascriptArrays(workbook) {
  const workbookData = {};

  workbook.eachSheet((worksheet) => {
    const sheetData = [];

    worksheet.eachRow((row) => {
      const rowData = [];

      row.eachCell((cell) => {
        const cellData = cell.formula ? `=${cell.formula}` : cell.value;
        rowData.push(cellData);
      });

      sheetData.push(rowData);
    });

    workbookData[worksheet.name] = sheetData;
  });

  return workbookData;
}

async function run(filename) {
  const xlsxWorkbook = await readXlsxWorkbookFromFile(filename);
  const sheetsAsJavascriptArrays = convertXlsxWorkbookToJavascriptArrays(xlsxWorkbook);
  const hf = HyperFormula.buildFromSheets(sheetsAsJavascriptArrays, { licenseKey: 'gpl-v3' });

  console.log('Formulas:', hf.getSheetSerialized(0));
  console.log('Values:  ', hf.getSheetValues(0));
}

// 타입들
type Cell = string | number | boolean | null | undefined;
type AoA = Cell[][];

const loading = ref(true);
const error = ref<string | null>(null);
const sheets = ref<Record<string, AoA>>({});
const sheetNames = ref<string[]>([]);
const currentSheet = ref<string>('');
const engine = ref<HyperFormula | null>(null);

const tableData = computed<AoA>(() => {
  if (!currentSheet.value) return [];
  return sheets.value[currentSheet.value] || [];
});

onMounted(async () => {
  try {
    // public/sample.xlsx 가져오기
    const res = await fetch('/sample.xlsx');
    if (!res.ok) {
      throw new Error(`파일을 가져오지 못했습니다: ${res.status} ${res.statusText}`);
    }
    const ab = await res.arrayBuffer();

    // HyperFormula XLSX import 시도
    let importedSheets: Record<string, AoA> | null = null;
    try {
      type XlsxImportStatic = {
        extractSheets?: (buffer: ArrayBuffer) => Promise<Record<string, AoA>> | Record<string, AoA>;
        fromArrayBuffer?: (buffer: ArrayBuffer) => Promise<{ getSheets?: () => Record<string, AoA>; sheets?: Record<string, AoA> }>;
      };

      const hfObj = HyperFormula as unknown as { XlsxImport?: XlsxImportStatic };
      let XlsxImport: XlsxImportStatic | undefined = hfObj.XlsxImport;
      if (!XlsxImport) {
        const mod = (await import('hyperformula')) as unknown as { XlsxImport?: XlsxImportStatic };
        XlsxImport = mod.XlsxImport;
      }

      if (XlsxImport?.extractSheets) {
        const maybe = XlsxImport.extractSheets(ab);
        importedSheets = (maybe instanceof Promise) ? await maybe : maybe;
      }
      if (!importedSheets && XlsxImport?.fromArrayBuffer) {
        const importer = await XlsxImport.fromArrayBuffer(ab);
        importedSheets = importer.getSheets ? importer.getSheets() : importer.sheets ?? null;
      }
    }
    catch {
      // 무시하고 아래에서 에러 처리
    }

    if (!importedSheets || Object.keys(importedSheets).length === 0) {
      throw new Error('HyperFormula XLSX import 기능을 사용할 수 없습니다. file-import 설정을 확인하세요.');
    }

    // 엔진 생성 (AGPL 라이선스 필요)
    engine.value = HyperFormula.buildFromSheets(importedSheets, { licenseKey: 'agpl-v3' });

    sheets.value = importedSheets;
    sheetNames.value = Object.keys(importedSheets);
    currentSheet.value = sheetNames.value[0] || '';
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  }
  finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div v-if="loading">
      로딩 중…
    </div>
    <div v-else-if="error" class="text-red-500">
      {{ error }}
    </div>
    <div v-else>
      <div class="mb-2 flex items-center gap-2">
        <label for="sheet">시트 선택:</label>
        <select id="sheet" v-model="currentSheet">
          <option v-for="name in sheetNames"
                  :key="name"
                  :value="name"
          >
            {{ name }}
          </option>
        </select>
      </div>

      <HotTable :data="tableData"
                :row-headers="true"
                :col-headers="true"
                :context-menu="true"
                :dropdown-menu="true"
                :filters="true"
                :license-key="'non-commercial-and-evaluation'"
                :formulas="engine ? { engine, sheetName: currentSheet } : undefined"
                :auto-wrap-row="true"
                :manual-column-resize="true"
                :manual-row-resize="true"
                :width="'100%'"
                :height="450"
      />
    </div>
  </div>
</template>

<style scoped>
.mb-2 { margin-bottom: 0.5rem; }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.text-red-500 { color: #ef4444; }
</style>
