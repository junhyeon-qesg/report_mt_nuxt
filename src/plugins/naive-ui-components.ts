import { createDiscreteApi, darkTheme, dateKoKR, koKR } from 'naive-ui';
import type { MessageApi, DialogApi, NotificationApi, LoadingBarApi, ModalApi } from 'naive-ui';
import type { InjectionKey } from 'vue';

// 각 서비스에 대한 심볼 생성
export const MessageSymbol: InjectionKey<MessageApi> = Symbol('message');
export const DialogSymbol: InjectionKey<DialogApi> = Symbol('dialog');
export const NotificationSymbol: InjectionKey<NotificationApi> = Symbol('notification');
export const LoadingBarSymbol: InjectionKey<LoadingBarApi> = Symbol('loadingBar');
export const ModalSymbol: InjectionKey<ModalApi> = Symbol('modal');

export default defineNuxtPlugin({
  name: 'naive-ui-global',
  setup() {
    return {
      provide: {

      },
    };
  },
});
