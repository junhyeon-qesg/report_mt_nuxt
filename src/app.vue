<script lang="ts" setup>
import { darkTheme, dateKoKR, koKR, NConfigProvider, createDiscreteApi } from 'naive-ui';
import '@fontsource-variable/noto-sans-kr';
import '@fontsource-variable/noto-sans-sc';
import '@fontsource-variable/noto-sans-tc';

const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
  {
    configProviderProps: {
      theme: darkTheme,
      locale: koKR,
      dateLocale: dateKoKR,
    },
  },
);

onMounted(() => {
  window.$message = message;
  window.$dialog = dialog;
  window.$loadingBar = loadingBar;
  window.$notification = notification;
  window.$modal = modal;
});
</script>

<template>
  <n-config-provider :theme="darkTheme" :locale="koKR" :date-locale="dateKoKR">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </n-config-provider>
</template>
