import { shell } from 'electron';
import { ethers } from 'ethers';
import { store } from '../../../helpers/store.mjs';
import { getSettingsItem } from '../settings/settings.mjs';
import { getExportNodePrivateKeyItem } from '../exportNodePrivateKey/exportNodePrivateKey.mjs';
import { FRONTEND_URL } from '../../../globals.mjs';

/*
 *
 * Authentication
 *
 */
export const signInString = 'Sign in...';

/* Logged out */

// Set default authentication label if the user is not signed in
store.get('menu.authentication.label') || store.set('menu.authentication.label', signInString);

// If no label, set authenticationAccelerator to 'CmdOrCtrl+S'
store.get('menu.authentication.label') === signInString
  ? store.set('menu.authentication.accelerator', 'CmdOrCtrl+S')
  : null;

// If the label is the signInString, set the click function to show the mainWindow
store.get('menu.authentication.label') === signInString
  ? store.set('menu.authentication.click', true)
  : store.set('menu.authentication.click', false);

/* Logged in */
/* Set the authentication label to the username if the user is signed in */
store.get('accounts.current.username') || store.set('accounts.current.username', null);
const isSignedIn = () => store.get('accounts.current.username') !== null;

const signOut = () => {
  shell.openExternal(`${FRONTEND_URL}/node/remove?nodeAddress=${store.get('ethereumAddress')}`);

  // store.set('accounts.current.username', null);
  // store.set('menu.authentication.label', signInString);
  // store.set('menu.authentication.accelerator', 'CmdOrCtrl+S');
  // store.set('menu.authentication.click', true);

  // const privateKey = ethers.Wallet.createRandom();
  // store.set('mnemonic', privateKey.mnemonic.phrase);
  // store.set('ethereumPrivateKey', privateKey.privateKey);
  // const ethereumPrivateKey = store.get('ethereumPrivateKey');
  // const wallet = new ethers.Wallet(ethereumPrivateKey as string);
  // const address = wallet.address;
  // store.set('ethereumAddress', address);

  // store.set('subscribedPortraits', []);

  // store.set('accounts.current.identifier', null);
  // store.set('accounts.current.deviceName', null);
  // store.set('accounts.current.portraitId', null);
};

// Log out option
const authenticationSubmenu = [
  getSettingsItem(),
  getExportNodePrivateKeyItem(),
  {
    label: 'Sign out...',
    click: () => {
      signOut();
    },
  },
];

export const getAuthenticationItem = () => {
  if (isSignedIn()) {
    store.set('menu.authentication.label', store.get('accounts.current.username'));
    store.set('menu.authentication.accelerator', null);
    store.set('menu.authentication.click', false);
  }

  return {
    label: store.get('menu.authentication.label'),
    accelerator: store.get('menu.authentication.accelerator'),
    click: store.get('menu.authentication.click')
      ? () => shell.openExternal(`${FRONTEND_URL}/node/add?nodeAddress=${store.get('ethereumAddress')}`)
      : null,
    ...(isSignedIn() && {
      submenu: authenticationSubmenu,
    }),
  };
};
