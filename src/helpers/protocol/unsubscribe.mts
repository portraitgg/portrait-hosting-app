import { wakuNode } from './initWaku.mjs';
import { setLastUpdateTimestamp } from '../lastUpdate.mjs';
import { getSubscription } from './subscribeWithCallback.mjs';

// Unsubscribe Waku light node from a specific topic
export const unsubscribeFromContentTopic = async (ContentTopic: any) => {
  const subscription = await getSubscription(ContentTopic);

  await subscription.unsubscribe([ContentTopic]);

  // console.log(wakuNode.filter.subscribe);
  // console.log(wakuNode.filter.unsubscribe);
  // await wakuNode.filter.unsubscribe([ContentTopic]);
  // console.log(`Unsubscribed from ${ContentTopic}`);
  setLastUpdateTimestamp();
  console.log(`Unsubscribed from ${ContentTopic}`);
};
