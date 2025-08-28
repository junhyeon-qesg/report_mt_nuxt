<script setup lang="ts">
import { h } from 'vue';
import { NInput, NSelect, NDatePicker, NButton, NDataTable } from 'naive-ui';

const columns = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Age',
    key: 'age',
  },
];

const data = [
  {
    name: 'John Brown',
    age: 32,
  },
  {
    name: 'Jim Green',
    age: 40,
  },
];

const pagination = {
  pageSize: 10,
};
</script>

<template>
  <div>
    <h1>Sample Page</h1>

    <div class="search-filter">
      <div class="search-filter__item">
        <n-input placeholder="Search text" class="search-filter__text--medium" />
      </div>
      <div class="search-filter__item">
        <n-select :options="[{ label: 'Option 1', value: 1 }, { label: 'Option 2', value: 2 }]"
                  placeholder="Select option"
                  class="search-filter__select--medium"
        />
      </div>
      <div class="search-filter__item">
        <n-date-picker type="daterange" clearable class="search-filter__date-range" />
      </div>
      <div class="search-filter__actions">
        <n-button type="primary" class="search-filter__action">
          Search
        </n-button>
        <n-button class="search-filter__action">
          Reset
        </n-button>
      </div>
    </div>

    <n-data-table :columns="columns" :data="data" :pagination="pagination" />
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/form.scss';
</style>
