import Store from 'electron-store';
import { ethers } from 'ethers';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { readFileSync, readFile, writeFileSync } from 'fs';
import { app } from 'electron';

///////////////////////////
// This code only adds obfuscation to the store.
// Note that this is not intended for security purposes, since the encryption key would be easily found inside a plain-text Node.js app.
// For more information, see: https://www.npmjs.com/package/electron-store
///////////////////////////

const root = app.getPath('userData');
const storeEncryptionPath = path.join(root, 'storeEncryption.json');

let encryptionKey;
try {
  const file = readFileSync(storeEncryptionPath, 'utf8');
  encryptionKey = JSON.parse(file).key;
} catch (error) {
  console.error('no storeEncryptionPath, creating one');
  const key = nanoid();
  writeFileSync(storeEncryptionPath, JSON.stringify({ key }, null, 2));
  encryptionKey = key;
}

const store = new Store({
  encryptionKey: encryptionKey,
  clearInvalidConfig: true,
});

///////////////////////////
// End of obfuscation code
///////////////////////////

function setDefaultStoreValues() {
  console.log('Setting default store values');
  // Uncomment to delete the store
  // store.clear();

  // some stuff for notifications and last update timestamp
  const timeNow = new Date().toISOString();

  store.get('lastCheckIn.years') || store.set('lastCheckIn.years', null);
  store.get('lastCheckIn.months') || store.set('lastCheckIn.months', null);
  store.get('lastCheckIn.days') || store.set('lastCheckIn.days', null);

  store.get('lastUpdateTimestamp') || store.set('lastUpdateTimestamp', timeNow);

  store.get('notifications.startTimestamp') || store.set('notifications.startTimestamp', timeNow);

  // if privateKey doesnt exist in store, create a random one with ethers
  const privateKey = ethers.Wallet.createRandom();
  store.get('mnemonic') || store.set('mnemonic', privateKey.mnemonic.phrase);
  store.get('ethereumPrivateKey') || store.set('ethereumPrivateKey', privateKey.privateKey);
  const ethereumPrivateKey = store.get('ethereumPrivateKey');
  const wallet = new ethers.Wallet(ethereumPrivateKey as string);
  const address = wallet.address;
  store.get('ethereumAddress') || store.set('ethereumAddress', address);

  // if not signed in, set signed in to false
  store.get('accounts.current.username') || store.set('accounts.current.username', null);

  // if portraits doesnt exist in store, create it as an empty array
  store.get('portraits') || store.set('portraits', []);

  // if subscribedPortraits doesnt exist in store, create it as an empty array
  store.get('subscribedPortraits') || store.set('subscribedPortraits', []);
}

export { store, setDefaultStoreValues };
