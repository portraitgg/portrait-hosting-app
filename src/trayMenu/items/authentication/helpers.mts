import { store } from '../../../helpers/store.mjs';

export const updateAuthenticationItem = (authenticationItem) => {
  const item = {
    label: store.get('authenticationLabel'),
    accelerator: store.get('authenticationAccelerator'),
    click: store.get('authenticationClick'),
  };

  return item;
};
