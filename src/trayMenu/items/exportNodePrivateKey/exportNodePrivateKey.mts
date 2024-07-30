import { get } from 'http';
import { store } from '../../../helpers/store.mjs';
import { dialog, clipboard } from 'electron';
import { getAboutIcon } from '../about/about.mjs';

export const getExportNodePrivateKeyItem = () => {
  const exportNodePrivateKeyItem = {
    label: store.get('menu.exportNodePrivateKey.label'),
    click: () => {
      dialog
        .showMessageBox({
          title: 'Hosting Node Private Key',
          message: `Hosting Node Private Key`,
          detail: `${store.get('mnemonic')}`,
          type: 'info',
          icon: getAboutIcon(),
          buttons: ['Copy raw private key to clipboard', 'Close'],
        })
        .then((response) => {
          if (response.response === 0) {
            clipboard.writeText(store.get('ethereumPrivateKey') as string);
          }
        });
    },
  };

  return exportNodePrivateKeyItem;
};
