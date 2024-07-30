import { Menu, Tray, nativeTheme } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { buildTrayMenu } from './trayMenu.mjs';
import { store } from '../helpers/store.mjs';

let tray: Electron.Tray | null;
let rerenderTrayMenu: Electron.Menu | null;
let window: Electron.BrowserWindow | null;
const template: Electron.MenuItemConstructorOptions[] = buildTrayMenu() as any;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

export function fillTrayMenu() {
  rerenderTrayMenu = Menu.buildFromTemplate(buildTrayMenu() as any);
  tray?.setContextMenu(rerenderTrayMenu);
}

function createTray() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // https://stackoverflow.com/a/41998326
  tray = new Tray(path.join(__dirname, '/assets/trayIcon/', 'trayIconTemplate.png'));

  tray.setToolTip('Portrait Hosting Node');
  tray.setContextMenu(menu);

  console.log('Tray created');

  loadingIcon();

  // get position of tray icon
  const trayBounds = tray.getBounds();
  const trayX = trayBounds.x;
  const trayY = trayBounds.y;

  store.set('tray.x', trayX);
  store.set('tray.y', trayY);

  /*
   * Rebuild the tray menu on click
   * This is a workaround for the tray menu not updating when the store changes
   */
  tray.on('click', () => {
    fillTrayMenu();
    const newBounds = tray.getBounds();
    store.set('tray.x', newBounds.x);
    store.set('tray.y', newBounds.y);
  });
}

const trayIconTemplate = path.join(__dirname, '/assets/trayIcon/', 'trayIconTemplate.png');

async function loadingIcon(frame = 1) {
  const wakuReadyState = store.get('waku.ready');

  if (wakuReadyState) {
    console.log('Waku is ready!');
    tray?.setImage(trayIconTemplate);
    return;
  }

  const frameFile = path.join(__dirname, `/assets/trayLoader/loader-${frame}-Template.png`);
  tray?.setImage(frameFile);

  let nextFrame = frame + 1;

  await new Promise((resolve) => setTimeout(resolve, 150));

  if (nextFrame > 4) {
    nextFrame = 1; // Loop back to the first frame
  }

  loadingIcon(nextFrame);
}

export async function actionTrayAnimation(frame = 1) {
  if (frame < 18) {
    const framesObject = {
      1: 90,
      2: 80,
      3: 70,
      4: 60,
      5: 50,
      6: 40,
      7: 30,
      8: 20,
      9: 10,
      10: 20,
      11: 30,
      12: 40,
      13: 50,
      14: 60,
      15: 70,
      16: 80,
      17: 90,
    };

    const frameFile = (f: string) => path.join(__dirname, `/assets/actionAnimation/action-icon-${f}-Template.png`);
    tray?.setImage(frameFile(framesObject[frame]));

    await new Promise((resolve) => setTimeout(resolve, 50));

    return actionTrayAnimation(frame + 1);
  }
  const trayIconTemplate = path.join(__dirname, '/assets/trayIcon/', 'trayIconTemplate.png');

  tray?.setImage(trayIconTemplate);

  return;
}

export { createTray, tray, rerenderTrayMenu };
