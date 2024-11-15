import { dialog, nativeImage, app, shell, nativeTheme, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';
import * as path from 'path';
import { FRONTEND_URL } from '../../../globals.mjs';

import { store } from '../../../helpers/store.mjs';

import { isDev } from '../../../globals.mjs';

// TO-DO: Move this to a global helper, as it is used in multiple places
export const getAboutIcon = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(path.dirname(path.dirname(path.dirname(__filename))));

  let iconFileName = 'logo_new.png';

  // Check if the system is in light mode
  if (nativeTheme.shouldUseDarkColors) {
    iconFileName = 'logo_new.png';
  }

  const aboutIcon = path.join(__dirname, '/assets/aboutIcon/', iconFileName);

  return nativeImage.createFromPath(aboutIcon);
};

export const getAboutItem = () => {
  const aboutDetailDefaultString =
    'A desktop application that allows you to host and serve Portraits on the Portrait Network.\n\n© 2024 Portrait Technology Inc.';
  const aboutDetail = isDev ? `${aboutDetailDefaultString}\n\nThis is a development build.` : aboutDetailDefaultString;
  const aboutItem = {
    label: store.get('menu.about.label'),
    accelerator: store.get('menu.about.accelerator'),
    click: () => {
      dialog
        .showMessageBox({
          title: 'Portrait Hosting Node',
          message: `Hosting Node v${app.getVersion()}`,
          type: 'info',
          detail: aboutDetail,
          icon: getAboutIcon(),
          buttons: ['More information', 'Close'],
        })
        .then((response) => {
          if (response.response === 0) {
            shell.openExternal(`${FRONTEND_URL}`);
          }
        });
    },
  };

  return aboutItem;
};
