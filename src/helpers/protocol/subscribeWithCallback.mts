import { createDecoder } from '@waku/sdk';
import { store } from '../store.mjs';
import { setLastUpdateTimestamp } from '../lastUpdate.mjs';
import { wakuNode } from './initWaku.mjs';
import {
  // updatesAllCallbackValidator,
  updatesNumberedCallbackValidator,
  latestNumberedCallbackValidator,
  requestsNumberedCallbackValidator,
  pingNumberedCallbackValidator,
} from './messageCallbackValidators.mjs';

import {
  // updatesAllCallbackProcessor,
  updatesNumberedCallbackProcessor,
  latestNumberedCallbackProcessor,
  requestsNumberedCallbackProcessor,
  pingNumberedCallbackProcessor,
} from './messageCallbackProcessors.mjs';

///////////////////
// BASIC HELPERS
///////////////////

const extractTopicName = (topic: string) => {
  const topicParts = topic.split('/');
  return topicParts[topicParts.length - 2];
};

const isNumberedTopic = (topic: string) => {
  const topicParts = topic.split('-');
  return !isNaN(Number(topicParts[topicParts.length - 1]));
};

const selectCallback = (topic: string) => {
  try {
    const typeOfTopic = getType(topic);

    if (typeOfTopic === 'updates') {
      if (isNumberedTopic(topic)) {
        return updatesNumberedCallback;
      }
      // For now, we only support hosting Portraits by their portraitId
      throw new Error('Invalid topic');
      // return updatesAllCallback;
    }

    if (typeOfTopic === 'latest') {
      if (isNumberedTopic(topic)) {
        return latestNumberedCallback;
      }
      // TO-DO: Refactor this, as all latest topics does not exist, refer to the contentTopics.mjs file
      throw new Error('Invalid topic');
    }

    if (typeOfTopic === 'requests') {
      return requestsNumberedCallback;
    }

    if (typeOfTopic === 'ping') {
      if (isNumberedTopic(topic)) {
        return pingNumberedCallback;
      }
    }

    return (msg: any) => {
      console.log('No callback for this topic');
    };
  } catch (e) {
    console.error(e);
  }
};

const getType = (topic: string) => {
  const topicParts = topic.split('-');
  return topicParts[0];
};

///////////////////
// MAIN EXPORT
///////////////////

export const subscribeToContentTopic = async (ContentTopic: any) => {
  console.log(`Subscribing to ${ContentTopic}`);
  const decoder = createDecoder(ContentTopic);
  const extractedTopicName = extractTopicName(ContentTopic);
  const callback = selectCallback(extractedTopicName);

  const { error, subscription } = await wakuNode.filter.createSubscription({ contentTopics: [ContentTopic] });
  await subscription.subscribe([decoder], callback);

  // await wakuNode.filter.subscribe([decoder], callback);
  // console.log(`Subscribed to ${extractedTopicName}`);
  // setLastUpdateTimestamp();
  return `Subscribed to ${extractedTopicName}`;
};

export const getSubscription = async (ContentTopic: any) => {
  const { _, subscription } = await wakuNode.filter.createSubscription({ contentTopics: [ContentTopic] });
  return subscription;
};

export const processStoreMessagesFromContentTopic = async (ContentTopic: any) => {
  // const peers = await wakuNode.libp2p.peerStore.all();
  // console.log('Peers:' + peers.length);

  const decoder = createDecoder(ContentTopic);
  const extractedTopicName = extractTopicName(ContentTopic);
  const callback = selectCallback(extractedTopicName);
  // console.log(callback);
  // const queryOptions = {
  //   pageDirection: PageDirection.BACKWARD,
  // };
  // const messageReceivedCallback = (wakuMessage) => {
  //   console.log('hi');
  // };

  await wakuNode.store.queryWithOrderedCallback([decoder], callback);

  return `Processed store messages from ${ContentTopic}`;
};

///////////////////
// CALLBACKS
///////////////////

// const updatesAllCallback = (msg: any) => {
//   try {
//     updatesAllCallbackValidator(msg).then(() => {
//       updatesAllCallbackProcessor(msg);
//     });
//   } catch (e) {
//     console.error(e);
//   }
// };

const updatesNumberedCallback = (msg: any) => {
  try {
    updatesNumberedCallbackValidator(msg).then(({ decodedMessage, portraitId }) => {
      updatesNumberedCallbackProcessor({ decodedMessage, portraitId });
    });
  } catch (e) {
    console.error(e);
  }
};

const latestNumberedCallback = (msg: any) => {
  try {
    // console.log('latestNumberedCallback');
    // console.log(msg);
    latestNumberedCallbackValidator(msg).then(({ decodedMessage, portraitId }) => {
      console.log('latest numbered validated successfully');
      latestNumberedCallbackProcessor({ decodedMessage, portraitId });
    });
  } catch (e) {
    console.error(e);
  }
};

const requestsNumberedCallback = (msg: any) => {
  try {
    requestsNumberedCallbackValidator(msg).then(({ decodedMessage, portraitId }) => {
      requestsNumberedCallbackProcessor({ decodedMessage, portraitId });
    });
  } catch (e) {
    console.error(e);
  }
};

const pingNumberedCallback = (msg: any) => {
  try {
    pingNumberedCallbackValidator(msg).then(() => {
      pingNumberedCallbackProcessor(msg);
    });
  } catch (e) {
    console.error(e);
  }
};
