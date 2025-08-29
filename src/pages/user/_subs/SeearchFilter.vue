<script setup lang="ts">
import type { FormInst } from 'naive-ui';
import { storeToRefs } from 'pinia';
import main from './user';

const { majorForm } = main();
const { formModel } = storeToRefs(majorForm);
</script>

<template>
  <n-card hoverable>
    <n-form :ref="(el) => { majorForm.formRef = el as unknown as FormInst }"
            :model="majorForm.formModel"
            :rules="majorForm.rules"
            @submit="majorForm.onSubmit"
    >
      <div class="search-filter">
        <div class="search-filter__item">
          <n-form-item class="search-filter__select search-filter__select--small" label="검색어" path="searchType">
            <n-select v-model:value="formModel.searchType" placeholder="검색 유형을 선택해주세요." :options="majorForm.inputOptions" />
          </n-form-item>
          <n-form-item path="searchValue" class="search-filter__text search-filter__text--medium">
            <n-input v-model:value="formModel.searchValue" placeholder="검색어를 입력해주세요." />
          </n-form-item>
        </div>
        <div class="search-filter__item">
          <n-form-item class="search-filter__date-range" label="생성일" path="searchType">
            <n-date-picker v-model:value="formModel.createdAt"
                           close-on-select
                           clearable
                           type="daterange"
            />
          </n-form-item>
        </div>
      </div>
      <div class="search-filter__actions">
        <n-button class="search-filter__actions__action" type="primary" attr-type="submit">
          검색
        </n-button>
        <n-button class="search-filter__actions__action" @click="majorForm.onReset">
          초기화
        </n-button>
      </div>
    </n-form>
  </n-card>
</template>
