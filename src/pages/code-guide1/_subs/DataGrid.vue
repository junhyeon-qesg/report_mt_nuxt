<template>
  <div class="w-full p-8 bg-[#050506] text-white">
    <h1 class="text-3xl font-bold mb-6">Handsontable with Nuxt 3 & Nested Rows</h1>
    <HotTable ref="hotTableRef"
              theme-name="ht-theme-main"
              :data="defaultData"
              height="auto"
              width="100%"
              license-key="non-commercial-and-evaluation"
              :nestedRows="true"
              :nested-headers="[
                [
                  { label: 'User', colspan: 4 },
                  { label: 'Account Details', colspan: 3 },
                  { label: 'Login information', colspan: 2 },
                  { label: 'Actions', colspan: 1 }
                ],
                [
                  'Name',
                  'Age',
                  'Country',
                  'City',
                  'Active',
                  'Interest',
                  'Favorite Product',
                  'Login date',
                  'Login time',
                  'Action'
                ],
              ]"
              :hidden-columns="{ indicators: true }"
              :hidden-rows="{ indicators: true }"
              :context-menu="customContextMenu"
              header-class-name="htLeft"
              :col-headers="true"
              :collapsible-columns="true"
              :filters="true"
              :dropdown-menu="true"
              :comments="true"
              :multi-column-sorting="true"
              :manual-column-resize="true"
              :manual-row-move="true"
              :manual-column-move="true"
              :manual-row-resize="true"
              :auto-wrap-row="true"
              :row-headers="true"
              :navigable-headers="true"
    >
      <HotColumn data="name" :width="160" />
      <HotColumn data="age" type="numeric" :width="100" />
      <HotColumn data="country"
                 type="autocomplete"
                 :source="[
                   'Germany', 'China', 'France', 'Netherlands', 'Switzerland', 'USA',
                   'Canada', 'UK', 'Australia', 'Spain', 'Japan', 'Brazil',
                   'South Korea', 'Mexico',
                 ]"
                 :strict="true"
                 :allow-invalid="true"
                 :width="160"
      />
      <HotColumn data="city"
                 type="dropdown"
                 :source="[
                   'Walldorf', 'Shenzhen', 'Lyon', 'Amsterdam', 'Zurich', 'New York',
                   'Toronto', 'London', 'Sydney', 'Los Angeles', 'Barcelona', 'Tokyo',
                   'Manchester', 'Sao Paulo', 'Miami', 'Madrid', 'Seoul', 'Vancouver',
                   'Valencia', 'Chicago', 'Mexico City', 'Houston',
                 ]"
                 :width="160"
      />
      <HotColumn data="isActive"
                 type="checkbox"
                 class-name="htCenter"
                 :width="120"
      />
      <HotColumn data="interest"
                 type="dropdown"
                 :source="[
                   'Electronics', 'Fashion', 'Tech Gadgets', 'Home Decor',
                   'Sports & Fitness', 'Books & Literature', 'Beauty & Personal Care',
                   'Food & Cooking', 'Travel & Adventure', 'Art & Collectibles',
                 ]"
                 :width="220"
      />
      <HotColumn data="favoriteProduct" :width="180" />
      <HotColumn data="lastLoginDate"
                 type="date"
                 class-name="htRight"
                 :correct-format="true"
                 date-format="MMM DD, YYYY"
                 :width="180"
      />
      <HotColumn data="lastLoginTime"
                 type="time"
                 class-name="htRight"
                 :correct-format="true"
                 time-format="HH:mm"
                 :width="180"
      />
      
      <HotColumn
        title="Action"
        :width="120"
        :read-only="true"
        :renderer="buttonRenderer"
      />
    </HotTable>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onUnmounted, createApp } from 'vue';
import { HotTable, HotColumn } from '@handsontable/vue3';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import { NButton } from 'naive-ui'; // Naive UI 버튼 임포트

// Handsontable 모듈 등록
registerAllModules();

const hotTableRef = ref<any>(null);

// 중첩 행을 위한 데이터 구조 수정
const defaultData = [
 {
    name: 'Alice Johnson',
    age: 29,
    country: 'USA',
    city: 'New York',
    isActive: true,
    interest: 'Tech Gadgets',
    favoriteProduct: 'Smartwatch X',
    lastLoginDate: 'Jan 10, 2025',
    lastLoginTime: '09:30',
    __children: [
        {
            name: 'Diego Martinez',
            age: 27,
            country: 'Mexico',
            city: 'Mexico City',
            isActive: true,
            interest: 'Food & Cooking',
            favoriteProduct: 'Cast Iron Skillet',
            lastLoginDate: 'May 18, 2025',
            lastLoginTime: '08:20',
        },
        {
            name: 'Emma Brown',
            age: 36,
            country: 'UK',
            city: 'London',
            isActive: false,
            interest: 'Books & Literature',
            favoriteProduct: 'E-reader Pro',
            lastLoginDate: 'Nov 30, 2024',
            lastLoginTime: '19:10',
        }
    ]
 },
 {
    name: 'Bruno Schmidt',
    age: 41,
    country: 'Germany',
    city: 'Walldorf',
    isActive: false,
    interest: 'Travel & Adventure',
    favoriteProduct: 'Hiking Backpack',
    lastLoginDate: 'Aug 21, 2024',
    lastLoginTime: '17:05',
    __children: [
        {
            name: 'Ivan Petrov',
            age: 38,
            country: 'France',
            city: 'Lyon',
            isActive: true,
            interest: 'Fashion',
            favoriteProduct: 'Leather Jacket',
            lastLoginDate: 'Jan 15, 2025',
            lastLoginTime: '21:30',
        }
    ]
 },
 {
    name: 'Choi Minseo',
    age: 33,
    country: 'South Korea',
    city: 'Seoul',
    isActive: true,
    interest: 'Electronics',
    favoriteProduct: 'Noise-cancelling Headphones',
    lastLoginDate: 'Jul 02, 2025',
    lastLoginTime: '11:45',
 },
 {
    name: 'Fiona Lee',
    age: 31,
    country: 'Canada',
    city: 'Toronto',
    isActive: true,
    interest: 'Home Decor',
    favoriteProduct: 'Minimalist Lamp',
    lastLoginDate: 'Mar 08, 2025',
    lastLoginTime: '13:55',
 },
 {
    name: 'George Wang',
    age: 45,
    country: 'China',
    city: 'Shenzhen',
    isActive: false,
    interest: 'Art & Collectibles',
    favoriteProduct: 'Vintage Poster',
    lastLoginDate: 'Sep 12, 2024',
    lastLoginTime: '10:05',
 },
 {
    name: 'Hannah Kim',
    age: 24,
    country: 'Australia',
    city: 'Sydney',
    isActive: true,
    interest: 'Sports & Fitness',
    favoriteProduct: 'Yoga Mat',
    lastLoginDate: 'Aug 01, 2025',
    lastLoginTime: '07:15',
 },
 {
    name: 'Julia Sato',
    age: 28,
    country: 'Japan',
    city: 'Tokyo',
    isActive: true,
    interest: 'Beauty & Personal Care',
    favoriteProduct: 'Skincare Set',
    lastLoginDate: 'Feb 05, 2025',
    lastLoginTime: '16:00',
 },
];

const mountedApps = new Map();


const handleButtonClick = (row: number) => {
    const hotInstance = hotTableRef.value?.hotInstance;
    if (hotInstance) {
        const rowDataObject = hotInstance.getSourceDataAtRow(row);
        console.log(`Button in row ${row} clicked. Data:`, rowDataObject);
        alert(`'${(rowDataObject as any).name}'의 정보를 확인했습니다. 콘솔을 보세요.`);
    }
};

const buttonRenderer = (instance, TD, row, col) => {
  if (mountedApps.has(TD)) {
    mountedApps.get(TD).unmount();
    mountedApps.delete(TD);
  }

  TD.innerHTML = '';

  const app = createApp({
    render() {
      return h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          onClick: () => handleButtonClick(row),
        },
        { default: () => 'View Data' } 
      );
    },
  });

  app.mount(TD);

  mountedApps.set(TD, app);
};

onUnmounted(() => {
  mountedApps.forEach(app => app.unmount());
  mountedApps.clear();
});

const customContextMenu = [
  'row_above',
  'row_below',
  'remove_row',
  '---------',
  {
    key: 'log_data', 
    name: 'Log data to console', 
    callback(key, selection, clickEvent) {
      const { start, end } = selection[0];
      const hotInstance = hotTableRef.value.hotInstance;

      for (let row = start.row; row <= end.row; row++) {
        for (let col = start.col; col <= end.col; col++) {
          console.log(`(${row}, ${col}):`, hotInstance.getDataAtCell(row, col));
        }
      }
    },
  },
  '---------',
  'cut',
  'copy',
  '---------',
  'alignment',
  'make_read_only',
  'clear_column',
];
</script>

<style>
/* React 예제의 커스텀 테마 변수 */
.ht-theme-main {
  --ht-font-size: 14px;
  --ht-line-height: 20px;
  --ht-font-weight: 400;
  --ht-letter-spacing: 0;
  --ht-gap-size: 4px;
  --ht-icon-size: 16px;
  --ht-table-transition: 0.15s;
  --ht-border-color: #313132;
  --ht-accent-color: #476af7;
  --ht-foreground-color: #c7c7c7;
  --ht-background-color: #050506;
  --ht-placeholder-color: #68696c;
  --ht-read-only-color: #a3a3a3;
  --ht-disabled-color: #68696c;
  --ht-cell-horizontal-border-color: #313132;
  --ht-cell-vertical-border-color: #313132;
  --ht-wrapper-border-width: 0;
  --ht-wrapper-border-radius: 4px;
  --ht-wrapper-border-color: #313132;
  --ht-row-header-odd-background-color: #1e1e1f;
  --ht-row-header-even-background-color: #1e1e1f;
  --ht-row-cell-odd-background-color: rgba(0, 0, 0, 0);
  --ht-row-cell-even-background-color: rgba(0, 0, 0, 0);
  --ht-cell-horizontal-padding: 8px;
  --ht-cell-vertical-padding: 4px;
  --ht-cell-editor-border-width: 2px;
  --ht-cell-editor-border-color: #476af7;
  --ht-cell-editor-foreground-color: #ffffff;
  --ht-cell-editor-background-color: #050506;
  --ht-cell-editor-shadow-blur-radius: 0;
  --ht-cell-editor-shadow-color: #476af7;
  --ht-cell-success-background-color: rgba(66, 190, 101, 0.30);
  --ht-cell-error-background-color: rgba(255, 42, 52, 0.30);
  --ht-cell-read-only-background-color: rgba(199, 199, 199, 0.12);
  --ht-cell-selection-border-color: #476af7;
  --ht-cell-selection-background-color: #2e56fc;
  --ht-cell-autofill-size: 6px;
  --ht-cell-autofill-border-width: 1px;
  --ht-cell-autofill-border-radius: 4px;
  --ht-cell-autofill-border-color: #050506;
  --ht-cell-autofill-background-color: #476af7;
  --ht-cell-autofill-fill-border-color: #c7c7c7;
  --ht-cell-mobile-handle-size: 12px;
  --ht-cell-mobile-handle-border-width: 1px;
  --ht-cell-mobile-handle-border-radius: 6px;
  --ht-cell-mobile-handle-border-color: #476af7;
  --ht-cell-mobile-handle-background-color: rgba(71, 106, 247, 0.40);
  --ht-resize-indicator-color: rgba(199, 199, 199, 0.40);
  --ht-move-backlight-color: rgba(199, 199, 199, 0.16);
  --ht-move-indicator-color: #476af7;
  --ht-hidden-indicator-color: rgba(199, 199, 199, 0.40);
  --ht-scrollbar-border-radius: 8px;
  --ht-scrollbar-track-color: #1e1e1f;
  --ht-scrollbar-thumb-color: #68696c;
  --ht-header-font-weight: 400;
  --ht-header-foreground-color: #c7c7c7;
  --ht-header-background-color: #1e1e1f;
  --ht-header-highlighted-shadow-size: 0;
  --ht-header-highlighted-foreground-color: #ffffff;
  --ht-header-highlighted-background-color: #282829;
  --ht-header-active-border-color: #5371ee;
  --ht-header-active-foreground-color: #050506;
  --ht-header-active-background-color: #476af7;
  --ht-header-filter-background-color: rgba(66, 190, 101, 0.30);
  --ht-header-row-foreground-color: #c7c7c7;
  --ht-header-row-background-color: #1e1e1f;
  --ht-header-row-highlighted-foreground-color: #ffffff;
  --ht-header-row-highlighted-background-color: #282829;
  --ht-header-row-active-foreground-color: #050506;
  --ht-header-row-active-background-color: #476af7;
  --ht-checkbox-size: 16px;
  --ht-checkbox-border-radius: 4px;
  --ht-checkbox-border-color: #404144;
  --ht-checkbox-background-color: #050506;
  --ht-checkbox-icon-color: rgba(0, 0, 0, 0);
  --ht-checkbox-focus-border-color: #404144;
  --ht-checkbox-focus-background-color: #050506;
  --ht-checkbox-focus-icon-color: rgba(0, 0, 0, 0);
  --ht-checkbox-focus-ring-color: #476af7;
  --ht-checkbox-disabled-border-color: #313132;
  --ht-checkbox-disabled-background-color: #404144;
  --ht-checkbox-disabled-icon-color: rgba(0, 0, 0, 0);
  --ht-checkbox-checked-border-color: #5371ee;
  --ht-checkbox-checked-background-color: #476af7;
  --ht-checkbox-checked-icon-color: #050506;
  --ht-checkbox-checked-focus-border-color: #050506;
  --ht-checkbox-checked-focus-background-color: #476af7;
  --ht-checkbox-checked-focus-icon-color: #050506;
  --ht-checkbox-checked-disabled-border-color: #313132;
  --ht-checkbox-checked-disabled-background-color: #404144;
  --ht-checkbox-checked-disabled-icon-color: #68696c;
  --ht-checkbox-indeterminate-border-color: #5371ee;
  --ht-checkbox-indeterminate-background-color: #476af7;
  --ht-checkbox-indeterminate-icon-color: #050506;
  --ht-checkbox-indeterminate-focus-border-color: #050506;
  --ht-checkbox-indeterminate-focus-background-color: #476af7;
  --ht-checkbox-indeterminate-focus-icon-color: #050506;
  --ht-checkbox-indeterminate-disabled-border-color: #313132;
  --ht-checkbox-indeterminate-disabled-background-color: #404144;
  --ht-checkbox-indeterminate-disabled-icon-color: #727272;
  --ht-radio-size: 16px;
  --ht-radio-border-color: #404144;
  --ht-radio-background-color: #050506;
  --ht-radio-icon-color: rgba(0, 0, 0, 0);
  --ht-radio-focus-border-color: #313132;
  --ht-radio-focus-background-color: #050506;
  --ht-radio-focus-icon-color: rgba(0, 0, 0, 0);
  --ht-radio-focus-ring-color: #476af7;
  --ht-radio-disabled-border-color: #313132;
  --ht-radio-disabled-background-color: #404144;
  --ht-radio-disabled-icon-color: rgba(0, 0, 0, 0);
  --ht-radio-checked-border-color: #476af7;
  --ht-radio-checked-background-color: #050506;
  --ht-radio-checked-icon-color: #476af7;
  --ht-radio-checked-focus-border-color: #5371ee;
  --ht-radio-checked-focus-background-color: #050506;
  --ht-radio-checked-focus-icon-color: #5371ee;
  --ht-radio-checked-disabled-border-color: #313132;
  --ht-radio-checked-disabled-background-color: #404144;
  --ht-radio-checked-disabled-icon-color: #68696c;
  --ht-icon-button-border-radius: 2px;
  --ht-icon-button-border-color: #1e1e1f;
  --ht-icon-button-background-color: #1e1e1f;
  --ht-icon-button-icon-color: rgba(199, 199, 199, 0.40);
  --ht-icon-button-hover-border-color: #313132;
  --ht-icon-button-hover-background-color: #313132;
  --ht-icon-button-hover-icon-color: rgba(199, 199, 199, 0.40);
  --ht-icon-button-active-border-color: #476af7;
  --ht-icon-button-active-background-color: #476af7;
  --ht-icon-button-active-icon-color: #050506;
  --ht-icon-button-active-hover-border-color: #5371ee;
  --ht-icon-button-active-hover-background-color: #5371ee;
  --ht-icon-button-active-hover-icon-color: #050506;
  --ht-collapse-button-border-radius: 4px;
  --ht-collapse-button-open-border-color: #404144;
  --ht-collapse-button-open-background-color: #050506;
  --ht-collapse-button-open-icon-color: #a3a3a3;
  --ht-collapse-button-open-icon-active-color: #a3a3a3;
  --ht-collapse-button-open-hover-border-color: #404144;
  --ht-collapse-button-open-hover-background-color: #1e1e1f;
  --ht-collapse-button-open-hover-icon-color: #a3a3a3;
  --ht-collapse-button-open-hover-icon-active-color: #a3a3a3;
  --ht-collapse-button-close-border-color: #404144;
  --ht-collapse-button-close-background-color: #282829;
  --ht-collapse-button-close-icon-color: #a3a3a3;
  --ht-collapse-button-close-icon-active-color: #a3a3a3;
  --ht-collapse-button-close-hover-border-color: #404144;
  --ht-collapse-button-close-hover-background-color: #282829;
  --ht-collapse-button-close-hover-icon-color: #a3a3a3;
  --ht-collapse-button-close-hover-icon-active-color: #a3a3a3;
  --ht-button-border-radius: 4px;
  --ht-button-horizontal-padding: 12px;
  --ht-button-vertical-padding: 6px;
  --ht-primary-button-border-color: rgba(0, 0, 0, 0);
  --ht-primary-button-foreground-color: #050506;
  --ht-primary-button-background-color: #476af7;
  --ht-primary-button-disabled-border-color: rgba(0, 0, 0, 0);
  --ht-primary-button-disabled-foreground-color: #68696c;
  --ht-primary-button-disabled-background-color: #282829;
  --ht-primary-button-hover-border-color: rgba(0, 0, 0, 0);
  --ht-primary-button-hover-foreground-color: #050506;
  --ht-primary-button-hover-background-color: #6180ff;
  --ht-primary-button-focus-border-color: #050506;
  --ht-primary-button-focus-foreground-color: #050506;
  --ht-primary-button-focus-background-color: #476af7;
  --ht-secondary-button-border-color: #313132;
  --ht-secondary-button-foreground-color: #c7c7c7;
  --ht-secondary-button-background-color: #050506;
  --ht-secondary-button-disabled-border-color: #313132;
  --ht-secondary-button-disabled-foreground-color: #68696c;
  --ht-secondary-button-disabled-background-color: #282829;
  --ht-secondary-button-hover-border-color: #313132;
  --ht-secondary-button-hover-foreground-color: #c7c7c7;
  --ht-secondary-button-hover-background-color: #313132;
  --ht-secondary-button-focus-border-color: #313132;
  --ht-secondary-button-focus-foreground-color: #c7c7c7;
  --ht-secondary-button-focus-background-color: #050506;
  --ht-comments-textarea-horizontal-padding: 8px;
  --ht-comments-textarea-vertical-padding: 4px;
  --ht-comments-textarea-border-width: 1px;
  --ht-comments-textarea-border-color: rgba(0, 0, 0, 0);
  --ht-comments-textarea-foreground-color: #c7c7c7;
  --ht-comments-textarea-background-color: #1e1e1f;
  --ht-comments-textarea-focus-border-width: 1px;
  --ht-comments-textarea-focus-border-color: #476af7;
  --ht-comments-textarea-focus-foreground-color: #c7c7c7;
  --ht-comments-textarea-focus-background-color: #050506;
  --ht-comments-indicator-size: 6px;
  --ht-comments-indicator-color: #476af7;
  --ht-license-horizontal-padding: 16px;
  --ht-license-vertical-padding: 8px;
  --ht-license-foreground-color: #c7c7c7;
  --ht-license-background-color: #1e1e1f;
  --ht-link-color: #5371ee;
  --ht-link-hover-color: #6180ff;
  --ht-input-border-width: 1px;
  --ht-input-border-radius: 4px;
  --ht-input-horizontal-padding: 12px;
  --ht-input-vertical-padding: 6px;
  --ht-input-border-color: #313132;
  --ht-input-foreground-color: #c7c7c7;
  --ht-input-background-color: #1e1e1f;
  --ht-input-hover-border-color: #313132;
  --ht-input-hover-foreground-color: #c7c7c7;
  --ht-input-hover-background-color: #050506;
  --ht-input-disabled-border-color: #313132;
  --ht-input-disabled-foreground-color: #68696c;
  --ht-input-disabled-background-color: #404144;
  --ht-input-focus-border-color: #476af7;
  --ht-input-focus-foreground-color: #c7c7c7;
  --ht-input-focus-background-color: #050506;
  --ht-menu-border-width: 1px;
  --ht-menu-border-radius: 4px;
  --ht-menu-horizontal-padding: 0;
  --ht-menu-vertical-padding: 8px;
  --ht-menu-item-horizontal-padding: 12px;
  --ht-menu-item-vertical-padding: 4px;
  --ht-menu-border-color: #313132;
  --ht-menu-shadow-x: 0;
  --ht-menu-shadow-y: 8px;
  --ht-menu-shadow-blur: 16px;
  --ht-menu-shadow-color: rgba(0, 0, 0, 0.80);
  --ht-menu-item-hover-color: rgba(199, 199, 199, 0.12);
  --ht-menu-item-active-color: rgba(199, 199, 199, 0.16);
}
</style>