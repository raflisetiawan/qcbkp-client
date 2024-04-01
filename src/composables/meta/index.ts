import { useMeta } from 'quasar';
/**
 * Returns a meta object with a modified title.
 *
 * @param {string} title - The title to be used in the meta object.
 * @returns {void} - The modified meta object.
 */
export const useMetaTitle = (title: string): void => {
  useMeta({
    title: title,
    titleTemplate: (title) => `${title} - BKP Quality Issue`,
  });
};
