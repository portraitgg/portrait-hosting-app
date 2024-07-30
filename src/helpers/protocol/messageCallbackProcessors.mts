import { store } from '../store.mjs';
import { PortraitLatestMessage } from './messageFormats.mjs';
import { getLatestPortraitContentTopic } from './contentTopics.mjs';
import { sendMessage } from './sendMessage.mjs';
import { getCurrentBlockNumber } from '../contractHelpers.mjs';
import { wallet } from '../contractHelpers.mjs';
import { ethers } from 'ethers';
import { CHAIN_ID } from '../../globals.mjs';

// export const updatesAllCallbackProcessor = async (msg: UpdatesMessage) => {
// };

export const updatesNumberedCallbackProcessor = async ({ decodedMessage, portraitId }) => {
  console.log('updatesNumberedCallbackProcessor!');

  const { portraitObject, portraitSigner, portraitSignature } = decodedMessage;
  const portraits: any = store.get('portraits');

  const portraitIndex = portraits.findIndex((portrait) => portrait.portraitId === portraitId);
  if (portraitIndex === -1) {
    portraits.push({
      portraitId: Number(portraitId),
      portraitObject,
      portraitSigner,
      portraitSignature,
    });
  } else {
    portraits[portraitIndex] = {
      portraitId: Number(portraitId),
      portraitObject,
      portraitSigner,
      portraitSignature,
    };
  }

  store.set('portraits', portraits);

  console.log('Stored portrait' + portraitId);
};

export const latestNumberedCallbackProcessor = async ({ decodedMessage, portraitId }) => {
  console.log('latestNumberedCallbackProcessor');

  const { portraitObject, portraitSigner, portraitSignature } = decodedMessage;
  const portraits: any = store.get('portraits');
  const portraitIndex = portraits.findIndex((portrait) => portrait.portraitId === portraitId);
  if (portraitIndex === -1) {
    portraits.push({
      portraitId: Number(portraitId),
      portraitObject,
      portraitSigner,
      portraitSignature,
    });
  } else {
    portraits[portraitIndex] = {
      portraitId: Number(portraitId),
      portraitObject,
      portraitSigner,
      portraitSignature,
    };
  }

  store.set('portraits', portraits);
};

export const requestsNumberedCallbackProcessor = async ({ decodedMessage, portraitId }) => {
  const topic = getLatestPortraitContentTopic(portraitId);

  const portraitsFromStore: any = store.get('portraits');
  const portrait = portraitsFromStore.find((portrait) => portrait.portraitId === portraitId);

  const nodeBlockNumber = await getCurrentBlockNumber();

  const nodeMessage = ethers.solidityPackedKeccak256(
    ['string', 'uint256', 'uint256'],
    [portrait.portraitObject, nodeBlockNumber, CHAIN_ID],
  );

  const signature = await wallet().signMessage(nodeMessage);

  const message = {
    portraitObject: portrait.portraitObject,
    portraitSigner: portrait.portraitSigner,
    portraitSignature: portrait.portraitSignature,
    nodeBlockNumber: nodeBlockNumber,
    nodeAddress: store.get('ethereumAddress'),
    nodeSignature: signature,
  };

  await sendMessage(topic, PortraitLatestMessage, message);
};

export const pingNumberedCallbackProcessor = async (msg: any) => {};

export const pingAllCallbackProcessor = async (msg: any) => {};
