import { getHelpItem } from './items/help/help.mjs';
import { getFeedbackItem } from './items/feedback/feedback.mjs';
import { getCheckForUpdatesItem } from './items/updates/checkForUpdates.mjs';
import { seperatorItem } from './items/seperator/seperator.mjs';
import { getAboutItem } from './items/about/about.mjs';
import { getQuitItem } from './items/quit/quit.mjs';
import { getLastUpdateItem } from './items/lastUpdate/lastUpdate.mjs';
import { getAuthenticationItem } from './items/authentication/authentication.mjs';
import { store } from '../helpers/store.mjs';

export const buildTrayMenu = () => {
  /* Settings */
  store.get('menu.settings.label') || store.set('menu.settings.label', 'Settings');
  store.get('menu.settings.accelerator') || store.set('menu.settings.accelerator', 'CmdOrCtrl+,');

  /* Export Node Private Key */
  store.get('menu.exportNodePrivateKey.label') ||
    store.set('menu.exportNodePrivateKey.label', 'Export Node Private Key');

  /* Help */
  store.get('menu.help.label') || store.set('menu.help.label', 'Help');
  store.get('menu.help.accelerator') || store.set('menu.help.accelerator', 'CmdOrCtrl+H');

  /* Check for updates */
  store.get('menu.checkForUpdates.label') || store.set('menu.checkForUpdates.label', 'Check for updates...');

  /* Feedback */
  store.get('menu.feedback.label') || store.set('menu.feedback.label', 'Send feedback...');
  store.get('menu.feedback.accelerator') || store.set('menu.feedback.accelerator', 'CmdOrCtrl+I');

  /* About */
  store.get('menu.about.label') || store.set('menu.about.label', 'About');
  store.get('menu.about.accelerator') || store.set('menu.about.accelerator', 'CmdOrCtrl+A');

  /* Quit */
  store.get('menu.quit.label') || store.set('menu.quit.label', 'Quit');
  store.get('menu.quit.accelerator') || store.set('menu.quit.accelerator', 'CmdOrCtrl+Q');

  ////////////////////////
  const authenticationItem = getAuthenticationItem();

  const helpItem = getHelpItem();

  const checkForUpdatesItem = getCheckForUpdatesItem();

  const feedbackItem = getFeedbackItem();

  const aboutItem = getAboutItem();

  const quitItem = getQuitItem();

  const lastUpdate = getLastUpdateItem();

  const menu = [
    lastUpdate,
    seperatorItem,
    authenticationItem,
    helpItem,
    seperatorItem,
    feedbackItem,
    checkForUpdatesItem,
    seperatorItem,
    aboutItem,
    quitItem,
  ];

  return menu;
};

export default buildTrayMenu() as Electron.MenuItemConstructorOptions[];
