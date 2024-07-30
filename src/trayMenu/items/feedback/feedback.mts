import { store } from '../../../helpers/store.mjs';
import { shell } from 'electron';

export const getFeedbackItem = () => {
  const feedbackItem = {
    label: store.get('menu.feedback.label'),
    accelerator: store.get('menu.feedback.accelerator'),
    click: () => shell.openExternal(`https://discord.portrait.so`),
  };

  return feedbackItem;
};
