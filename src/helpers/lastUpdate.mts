import { store } from './store.mjs';

export const setLastUpdateTimestamp = () => {
  const timeNow = new Date().toISOString();
  store.set('lastUpdateTimestamp', timeNow);
};
