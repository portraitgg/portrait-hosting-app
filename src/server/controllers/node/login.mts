import { tray } from '../../../trayMenu/createTray.mjs';
import { store } from '../../../helpers/store.mjs';
import { wallet, getContractForName } from '../../../helpers/contractHelpers.mjs';
import { fillTrayMenu } from '../../../trayMenu/createTray.mjs';

export default async (req, res) => {
  try {
    const { portraitId, identifier, deviceName } = req.body;
    console.log('portraitId', portraitId);
    console.log('identifier', identifier);
    console.log('deviceName', deviceName);

    store.set('accounts.current.identifier', identifier);
    store.set('accounts.current.deviceName', (deviceName || 'noDeviceName').toString());

    const PortraitNodeRegistry = getContractForName('PortraitNodeRegistry');

    const nodeAddress = wallet().address;

    // wait 2 seconds
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000);

    const hasRegisteredNode = await PortraitNodeRegistry.hasRegisteredNode(nodeAddress, portraitId);

    if (!hasRegisteredNode) {
      return res.status(400).json({ error: 'Node not registered' });
    }

    const PortraitNameRegistry = getContractForName('PortraitNameRegistry');

    const name = await PortraitNameRegistry.portraitIdToName(portraitId);

    store.set('accounts.current.portraitId', portraitId);

    store.set('accounts.current.username', name.toString());

    return res.status(200).json({ message: 'Node registered' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  } finally {
    fillTrayMenu();
    tray.popUpContextMenu();
  }
};
