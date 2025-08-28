<script lang="ts" setup>
import { darkTheme, dateKoKR, koKR, NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui';
import '@fontsource-variable/noto-sans-kr';
import '@fontsource-variable/noto-sans-sc';
import '@fontsource-variable/noto-sans-tc';
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
