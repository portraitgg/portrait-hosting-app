import { store } from '../../../helpers/store.mjs';
import { shell } from 'electron';

export const getHelpItem = () => {
  const helpItem = {
    label: store.get('menu.help.label'),
    accelerator: store.get('menu.help.accelerator'),
    click: () => shell.openExternal(`https://learn.portrait.so/hosting-a-portrait`),
  };

  return helpItem;
};
