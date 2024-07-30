import { tray } from '../../../trayMenu/createTray.mjs';
import { store } from '../../../helpers/store.mjs';
import { getContractForName } from '../../../helpers/contractHelpers.mjs';
import { fillTrayMenu } from '../../../trayMenu/createTray.mjs';
import { ethers } from 'ethers';
import { signInString } from '../../../trayMenu/items/authentication/authentication.mjs';
import { unsubscribeFromContentTopic } from '../../../helpers/protocol/unsubscribe.mjs';
import { postUpdateContentTopic } from '../../../helpers/protocol/contentTopics.mjs';
import { actionTrayAnimation } from '../../../trayMenu/createTray.mjs';

export default async (req, res) => {
  try {
    const { portraitId, nodeAddress } = req.body;

    const ethereumAddress = store.get('ethereumAddress') as string;

    if (ethereumAddress !== nodeAddress) {
      return res.status(400).json({ error: 'Node address does not match' });
    }

    const authenticated = store.get('accounts.current.portraitId');

    if (authenticated !== portraitId) {
      return res.status(400).json({ error: 'Node not authenticated' });
    }

    const PortraitNodeRegistry = getContractForName('PortraitNodeRegistry');

    const hasRegisteredNode = await PortraitNodeRegistry.hasRegisteredNode(nodeAddress, portraitId);

    if (hasRegisteredNode) {
      return res.status(400).json({ error: 'Node still registered' });
    }

    // Else, sign out
    const subscribedPortraits = store.get('subscribedPortraits') as number[];

    for (const portraitId of subscribedPortraits) {
      await unsubscribeFromContentTopic(postUpdateContentTopic(portraitId));
    }

    store.set('accounts.current.username', null);
    store.set('menu.authentication.label', signInString);
    store.set('menu.authentication.accelerator', 'CmdOrCtrl+S');
    store.set('menu.authentication.click', true);

    const privateKey = ethers.Wallet.createRandom();
    store.set('mnemonic', privateKey.mnemonic.phrase);
    store.set('ethereumPrivateKey', privateKey.privateKey);
    const ethereumPrivateKey = store.get('ethereumPrivateKey');
    const wallet = new ethers.Wallet(ethereumPrivateKey as string);
    const address = wallet.address;
    store.set('ethereumAddress', address);

    store.set('subscribedPortraits', []);
    store.set('portraits', []);

    store.set('accounts.current.identifier', null);
    store.set('accounts.current.deviceName', null);
    store.set('accounts.current.portraitId', null);

    actionTrayAnimation();

    return res.status(200).json({ message: 'Node signed out' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  } finally {
    fillTrayMenu();
    tray.popUpContextMenu();
  }
};
