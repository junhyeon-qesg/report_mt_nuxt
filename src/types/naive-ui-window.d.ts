import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider';
import type { LoadingBarApiInjection } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import type { ModalApiInjection } from 'naive-ui/es/modal/src/ModalProvider';
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider';

declare global {
  interface Window {
    /** Naive UI global message API (optional at runtime) */
    $message: MessageApiInjection;
    /** Naive UI global dialog API (optional at runtime) */
    $dialog: DialogApiInjection;
    /** Naive UI global notification API (optional at runtime) */
    $notification: NotificationApiInjection;
    /** Naive UI global loading bar API (optional at runtime) */
    $loadingBar: LoadingBarApiInjection;
    /** Naive UI global modal API (optional at runtime) */
    $modal: ModalApiInjection;
  }
}

export {};
