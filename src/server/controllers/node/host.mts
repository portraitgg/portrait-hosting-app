import { store } from '../../../helpers/store.mjs';
import {
  processStoreMessagesFromContentTopic,
  subscribeToContentTopic,
} from '../../../helpers/protocol/subscribeWithCallback.mjs';
import { postUpdateContentTopic, getLatestPortraitContentTopic } from '../../../helpers/protocol/contentTopics.mjs';
import { actionTrayAnimation } from '../../../trayMenu/createTray.mjs';
import { API_URL } from '../../../globals.mjs';

export default async (req, res) => {
  try {
    const { portraitId } = req.body;

    // Add the portraitId to the subscribedPortraits array
    const subscribedPortraits = store.get('subscribedPortraits') as number[];
    subscribedPortraits.push(portraitId);
    console.log('subscribedPortraits', subscribedPortraits);
    store.set('subscribedPortraits', subscribedPortraits);

    const identifier = store.get('accounts.current.identifier') as string;
    const nodeAddress = store.get('ethereumAddress') as string;
    const authenticated = store.get('accounts.current.portraitId');

    try {
      await fetch(`${API_URL}/node/host`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, nodeAddress, authenticated, subscribedPortraits }),
      });
    } catch (e) {
      console.log(e);
    }

    res.status(200).json({ message: 'Portrait hosted' });

    actionTrayAnimation();

    await processStoreMessagesFromContentTopic(getLatestPortraitContentTopic(portraitId));
    await processStoreMessagesFromContentTopic(postUpdateContentTopic(portraitId));
    await subscribeToContentTopic(postUpdateContentTopic(portraitId));

    return;
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
};
