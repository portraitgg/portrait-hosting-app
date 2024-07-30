// In this file, everything comes together.
import { setLastUpdateTimestamp } from '../lastUpdate.mjs';
import { initWakuNode } from './initWaku.mjs';
import { subscribeToContentTopic, processStoreMessagesFromContentTopic } from './subscribeWithCallback.mjs';
import { postUpdateContentTopic, getLatestPortraitContentTopic } from './contentTopics.mjs';
import { store } from '../store.mjs';

export async function subscribeToHostedPortraitsTopics() {
  const subscribedPortraits = store.get('subscribedPortraits') || [];
  // For every portraitId in the subscribedPortraits array, subscribe to the topic
  for (const portraitId of subscribedPortraits as any) {
    // To subscribe to updates from all Portraits
    const updatesTopic = postUpdateContentTopic(portraitId);
    // Obtain the latest Portrait for a specific Portrait (existing one)
    const latestTopic = getLatestPortraitContentTopic(portraitId);
    await subscribeToContentTopic(updatesTopic);
    // await processStoreMessagesFromContentTopic(latestTopic);
  }
}

// Every 30 minutes, restart the Waku node
export const restartWakuNodePeriodically = () => {
  setInterval(() => {
    restartWakuNode();
  }, 1000 * 60 * 30);
};

export const restartWakuNode = () => {
  store.set('waku.ready', false);
  initWakuNode().then(() => {
    subscribeToHostedPortraitsTopics();
  });
  store.set('waku.ready', true);
  setLastUpdateTimestamp();
};
