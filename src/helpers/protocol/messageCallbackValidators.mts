import { ethers } from 'ethers';
import { CHAIN_ID } from '../../globals.mjs';
import { getCurrentBlockNumber } from '../contractHelpers.mjs';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { bases } from 'multiformats/basics';
import { store } from '../store.mjs';
import {
  PortraitUpdateMessage,
  PortraitLatestMessage,
  PortraitRequestMessage,
  PortraitPingMessage,
} from './messageFormats.mjs';
import { getContractForName } from '../contractHelpers.mjs';

function createIpfsHash(buffer) {
  // Compute the SHA-256 hash of the content
  const hash = sha256.digest(buffer);

  // CID code for raw (0x55)
  const code = 0x55;

  // Create a CIDv1
  const cid = CID.createV1(code, hash as any);

  // Encode the CID to a string using the base32 encoding
  const cidString = cid.toString(bases.base32);

  return cidString;
}

const getPortraitIdFromTopic = (topic: string) => {
  const topicParts = topic.split('/');
  const secondLastPart = topicParts[topicParts.length - 2];
  const match = secondLastPart.match(/\d+/); // Extract the numeric part
  return match ? parseInt(match[0]) : NaN; // Parse to integer and return
};

// export const updatesAllCallbackValidator = async (msg: any) => {
//   return await updatesCallbackValidator(msg, true);
// };

export const updatesNumberedCallbackValidator = async (msg: any) => {
  return await updatesCallbackValidator(msg, false);
};

const updatesCallbackValidator = async (msg: any, isAll: boolean) => {
  const decodedMessage = PortraitUpdateMessage.decode(msg.proto.payload) as any;

  const { portraitObject, portraitSigner, portraitSignature } = decodedMessage;

  const portraitObjectAsJson = JSON.parse(portraitObject);

  const portraitIdFromTopic = getPortraitIdFromTopic(msg.proto.contentTopic);

  const portraitId = portraitObjectAsJson.metadata.portraitId;

  if (!isAll) {
    if (portraitId != portraitIdFromTopic) {
      throw new Error('Invalid portraitId');
    }
  }

  const currentBlockNumber = await getCurrentBlockNumber();
  const portraitBlockNumber = parseInt(portraitObjectAsJson.metadata.blockNumber);

  // Portrait must be on the same chain as the node
  const portraitChainId = portraitObjectAsJson.metadata.chainId;

  if (portraitChainId != CHAIN_ID) {
    console.log('Invalid chain id');
    throw new Error('Invalid chain id');
  }

  // The portraitSigner must have signed the portraitSignature.
  const foundPortraitSigner = ethers.verifyMessage(portraitObject, portraitSignature);

  if (foundPortraitSigner != portraitSigner) {
    console.log('Invalid portraitSigner');
    throw new Error('Invalid portraitSigner');
  }

  // The portraitSigner must be the owner or delegate of the portraitId at the portraitObject.metadata.blockNumber.
  const PortraitAccessRegistry = getContractForName('PortraitAccessRegistry');

  const isDelegateOrOwner = await PortraitAccessRegistry.isDelegateOrOwnerOfPortraitId(portraitId, portraitSigner, {
    blocktag: portraitBlockNumber,
  });

  if (!isDelegateOrOwner) {
    console.log('Signer is not the owner or delegate of the portrait');
    throw new Error('Signer is not the owner or delegate of the portrait');
  }

  const PortraitStateRegistry = getContractForName('PortraitStateRegistry');

  // Wait 10s for the portrait to be mined (inefficient, but works for now)
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // The CID of the portraitObject must be equal to the CID of the portraitId stored in the PortraitStateRegistry contract.
  const onchainCID = await PortraitStateRegistry.portraitIdToPortraitHash(portraitId);

  const portraitBuffer = Buffer.from(JSON.stringify(portraitObjectAsJson));

  const computedCID = createIpfsHash(portraitBuffer);

  if (onchainCID != computedCID) {
    console.log('Invalid CID');
    throw new Error('Invalid CID');
  }

  console.log('finished updatesCallbackValidator');
  return { decodedMessage, portraitId };
};

export const latestNumberedCallbackValidator = async (msg: any) => {
  console.log('latestNumberedCallbackValidator');
  return await latestCallbackValidator(msg, false);
};

const latestCallbackValidator = async (msg: any, isAll: boolean) => {
  const decodedMessage = PortraitLatestMessage.decode(msg.data) as any;

  const { portraitObject, portraitSigner, portraitSignature, nodeBlockNumber, nodeAddress, nodeSignature } =
    decodedMessage;

  const portraitObjectAsJson = JSON.parse(portraitObject);

  const portraitIdFromTopic = getPortraitIdFromTopic(msg.proto.contentTopic);

  const portraitId = portraitObjectAsJson.metadata.portraitId;

  if (!isAll) {
    if (portraitId != portraitIdFromTopic) {
      throw new Error('Invalid portraitId');
    }
  }

  // if nodeAddress is the ethereum address of the node, we can throw an error
  const ethereumAddress = store.get('ethereumAddress') as string;
  if (nodeAddress == ethereumAddress) {
    console.log('Message from self');
    throw new Error('Message from self');
  }

  const currentBlockNumber = await getCurrentBlockNumber();
  const portraitBlockNumber = parseInt(portraitObjectAsJson.metadata.blockNumber);

  // nodeBlockNumber must be bigger than the portraitBlockNumber, yet smaller than the currentBlockNumber
  // TO-DO: Validate if the nodeBlockNumber is higher than the latest Portrait in store.
  if (nodeBlockNumber != portraitBlockNumber) {
    if (nodeBlockNumber <= portraitBlockNumber || nodeBlockNumber > currentBlockNumber) {
      console.log('Invalid block number');
      throw new Error('Invalid block number');
    }
  }

  // Portrait must be on the same chain as the node
  const portraitChainId = portraitObjectAsJson.metadata.chainId;

  if (portraitChainId != CHAIN_ID) {
    console.log('Invalid chain id');
    throw new Error('Invalid chain id');
  }

  const nodeMessage = ethers.solidityPackedKeccak256(
    ['string', 'uint256', 'uint256'],
    [portraitObject, nodeBlockNumber, CHAIN_ID],
  );

  const foundNodeAddress = ethers.verifyMessage(nodeMessage, nodeSignature);

  if (foundNodeAddress != nodeAddress) {
    console.log('Invalid nodeAddress');
    throw new Error('Invalid nodeAddress');
  }

  // The portraitSigner must have signed the portraitSignature.
  const foundPortraitSigner = ethers.verifyMessage(portraitObject, portraitSignature);

  if (foundPortraitSigner != portraitSigner) {
    console.log('Invalid portraitSigner');
    throw new Error('Invalid portraitSigner');
  }

  // The portraitSigner must be the owner or delegate of the portraitId at the portraitObject.metadata.blockNumber.
  const PortraitAccessRegistry = getContractForName('PortraitAccessRegistry');

  const isDelegateOrOwner = await PortraitAccessRegistry.isDelegateOrOwnerOfPortraitId(portraitId, portraitSigner, {
    blocktag: portraitBlockNumber,
  });

  if (!isDelegateOrOwner) {
    console.log('Signer is not the owner or delegate of the portrait');
    throw new Error('Signer is not the owner or delegate of the portrait');
  }

  const PortraitStateRegistry = getContractForName('PortraitStateRegistry');

  // Wait 10s for the portrait to be mined (inefficient, but works for now)
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // The CID of the portraitObject must be equal to the CID of the portraitId stored in the PortraitStateRegistry contract.
  const onchainCID = await PortraitStateRegistry.portraitIdToPortraitHash(portraitId);

  const portraitBuffer = Buffer.from(JSON.stringify(portraitObjectAsJson));

  const computedCID = createIpfsHash(portraitBuffer);

  if (onchainCID != computedCID) {
    console.log('Invalid CID');
    throw new Error('Invalid CID');
  }

  return { decodedMessage, portraitId };
};

export const requestsNumberedCallbackValidator = async (msg: any) => {
  // TO-DO: Implement the validation of the request message

  const decodedMessage = PortraitRequestMessage.decode(msg.proto.payload) as any;

  const { portraitId, requestBlockNumber } = decodedMessage;

  // If the requestBlockNumber is more than 100 blocks behind the current block number, reject the request
  const currentBlockNumber = await getCurrentBlockNumber();

  if (currentBlockNumber - requestBlockNumber > 100) {
    throw new Error('Request is too old');
  }

  const portraitIdFromTopic = getPortraitIdFromTopic(msg.proto.contentTopic);

  if (portraitId != portraitIdFromTopic) {
    throw new Error('Invalid portraitId');
  }

  // If the portraitId is not in the store, reject the request
  const portraits: any = store.get('portraits');
  const portraitIndex = portraits.findIndex((portrait) => portrait.portraitId === portraitId);

  if (portraitIndex === -1) {
    throw new Error('Portrait not found');
  }

  return { decodedMessage, portraitId };
};

export const pingNumberedCallbackValidator = async (msg: any) => {
  let decodedMessage: any;
  try {
    decodedMessage = PortraitPingMessage.decode(msg.data);
  } catch (_) {}
};

export const pingAllCallbackValidator = async (msg: any) => {
  let decodedMessage: any;
  try {
    decodedMessage = PortraitPingMessage.decode(msg.data);
  } catch (_) {}
};
