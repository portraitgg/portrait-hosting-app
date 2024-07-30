import { app } from 'electron';
import { inspect } from 'util';
import { initWakuNode } from './helpers/protocol/initWaku.mjs';

import { setDefaultStoreValues } from './helpers/store.mjs';
import { createTray } from './trayMenu/createTray.mjs';

import { startExpressServer } from './server/express.mjs';

import { checkForNotificationsPeriodically } from './helpers/checkForNotification.mjs';
import { callHomePeriodically } from './helpers/callHome.mjs';
import { subscribeToHostedPortraitsTopics, restartWakuNodePeriodically } from './helpers/protocol/core.mjs';
import { handleDeviceStateChange } from './helpers/handleDeviceStateChange.mjs';

// Debugging
inspect.defaultOptions.depth = null;

/* Hide the dock icon, this is an incomplete workaround for a non-release version
 * https://github.com/electron/electron/issues/422
 */
// app.dock.hide();

// If the app is already running, quit this instance.
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
}

app.whenReady().then(async () => {
  /*
   * Set the default values for the store
   */
  setDefaultStoreValues();

  /*
   * Creates the tray icon and menu
   */
  createTray();

  /*
   * Start the Waku node
   */
  await initWakuNode();

  /*
   * Subscribe to default topics, etc.
   */
  await subscribeToHostedPortraitsTopics();

  /*
   * Start the express server to handle hosting calls from frontend
   */
  startExpressServer();

  /*
   * Start all the protocol processes to interact with the Waku node every 30 minutes
   */
  restartWakuNodePeriodically();

  /*
   * Check for notifications periodically - currently every 15 minutes
   */
  checkForNotificationsPeriodically();

  /*
   * Call home periodically - currently every 1 minute
   */
  callHomePeriodically();

  /*
   * Handle device state changes
   */
  handleDeviceStateChange();

  console.log('Portrait Node is ready');
});
