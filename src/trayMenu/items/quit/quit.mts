import { store } from '../../../helpers/store.mjs';
import { app } from 'electron';
import { wakuNode } from '../../../helpers/protocol/initWaku.mjs';

export let quitting = false; // Flag to track if quitting is initiated by the user

export const getQuitItem = () => {
  const quitItem = {
    label: store.get('menu.quit.label'),
    accelerator: store.get('menu.quit.accelerator'),
    click: () => {
      quitting = true;
      app.quit();
    },
  };

  return quitItem;
};
