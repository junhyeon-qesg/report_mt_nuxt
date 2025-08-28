<script setup lang="ts">
import AppFooter from '~/components/layouts/AppFooter.vue';
import AppNav from '~/components/layouts/AppHeader.vue';
import LNB from '~/components/layouts/LNB.vue';

defineOptions({
  name: 'DefaultLayout',
});
</script>

<template>
  <n-layout has-sider
            class="app-layout app-layout--full-height"
  >
    <LNB />
    <div class="app-layout__content">
      <AppNav />
      <n-layout-content>
        <main class="main-content">
          <slot />
          <AppFooter />
        </main>
      </n-layout-content>
    </div>
  </n-layout>
</template>
