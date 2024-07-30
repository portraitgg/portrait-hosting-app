import { FRONTEND_URL } from '../../../globals.mjs';
import { store } from '../../../helpers/store.mjs';
import { shell } from 'electron';

export const getSettingsItem = () => {
  const settingsItem = {
    label: store.get('menu.settings.label'),
    accelerator: store.get('menu.settings.accelerator'),
    click: () => shell.openExternal(`${FRONTEND_URL}/node/settings`),
  };

  return settingsItem;
};
