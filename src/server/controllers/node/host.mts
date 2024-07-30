import { store } from '../../../helpers/store.mjs';
import {
  processStoreMessagesFromContentTopic,
  subscribeToContentTopic,
} from '../../../helpers/protocol/subscribeWithCallback.mjs';
import { postUpdateContentTopic, getLatestPortraitContentTopic } from '../../../helpers/protocol/contentTopics.mjs';
import { actionTrayAnimation } from '../../../trayMenu/createTray.mjs';

export default async (req, res) => {
  try {
    const { portraitId } = req.body;

    await processStoreMessagesFromContentTopic(getLatestPortraitContentTopic(portraitId));
    await processStoreMessagesFromContentTopic(postUpdateContentTopic(portraitId));
    await subscribeToContentTopic(postUpdateContentTopic(portraitId));

    // Add the portraitId to the subscribedPortraits array
    const subscribedPortraits = store.get('subscribedPortraits') as number[];
    subscribedPortraits.push(portraitId);

    store.set('subscribedPortraits', subscribedPortraits);

    actionTrayAnimation();

    return res.status(200).json({ message: 'Portrait hosted' });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
};
