<script lang="ts" setup>
import { darkTheme, dateKoKR, koKR, NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui';
</script>

<template>
  <n-config-provider :theme="darkTheme" :locale="koKR" :date-locale="dateKoKR">
    <n-message-provider>
      <n-dialog-provider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
