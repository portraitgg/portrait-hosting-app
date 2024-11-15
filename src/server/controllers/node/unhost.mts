import { store } from '../../../helpers/store.mjs';
import { unsubscribeFromContentTopic } from '../../../helpers/protocol/unsubscribe.mjs';
import { postUpdateContentTopic } from '../../../helpers/protocol/contentTopics.mjs';
import { actionTrayAnimation } from '../../../trayMenu/createTray.mjs';
import { API_URL } from '../../../globals.mjs';
export default async (req, res) => {
  try {
    const { portraitId } = req.body;

    // Unsubscribe from the content topic
    await unsubscribeFromContentTopic(postUpdateContentTopic(portraitId));

    // Remove the portraitId from the subscribedPortraits array
    const subscribedPortraits = store.get('subscribedPortraits') as number[];
    const portraitIndex = subscribedPortraits.indexOf(portraitId);
    subscribedPortraits.splice(portraitIndex, 1);
    store.set('subscribedPortraits', subscribedPortraits);

    // Remove the portrait from portraits array
    const portraits = store.get('portraits') as any[];
    const portraitIndexStore = portraits.findIndex((portrait) => portrait.portraitId === portraitId);
    portraits.splice(portraitIndexStore, 1);
    store.set('portraits', portraits);

    const identifier = store.get('accounts.current.identifier') as string;
    const nodeAddress = store.get('ethereumAddress') as string;
    const authenticated = store.get('accounts.current.portraitId');

    actionTrayAnimation();

    await fetch(`${API_URL}/node/host`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, nodeAddress, authenticated, subscribedPortraits }),
    });

    return res.status(200).json({ message: 'Portrait unhosted' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
};
