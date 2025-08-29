import { createPinia, setActivePinia } from 'pinia';
import { resetStore } from '~~/src/plugins/storeManager';
import { createApp } from 'vue';

export function setupPinia() {
  const app = createApp({});

  const pinia = createPinia().use(resetStore);
  app.use(pinia);
  setActivePinia(pinia);
}
