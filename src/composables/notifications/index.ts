import { Notify } from 'quasar';

/**
 * Creates a notification using the Quasar Notify module.
 *
 * @param {string} message - The message to display in the notification.
 * @param {string} color - The color of the notification.
 * @returns {void}
 */
const useNotify = (message: string, color: string): void => {
  Notify.create({
    message,
    color,
  });
};

/**
 * Displays an error notification using the Notify module from the quasar library.
 * @param message - The error message to be displayed in the notification.
 */
const useErrorNotify = (message: string): void => {
  Notify.create({
    message,
    color: 'negative',
    position: 'top-right',
    icon: 'error',
    actions: [
      {
        label: 'Tutup',
        color: 'white',
        handler: () => {
          /* ... */
        },
      },
    ],
    multiLine: true,
    iconColor: 'white',
  });
};

export { useNotify, useErrorNotify };
