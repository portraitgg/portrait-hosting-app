import protobuf from 'protobufjs';
import { createEncoder } from '@waku/sdk';
import { wakuNode } from './initWaku.mjs';

export const sendMessage = async (contentTopic: string, messageFormat: protobuf.Type, messageContents: object) => {
  const encoder = createEncoder({ contentTopic });
  const protoMessage = messageFormat.create(messageContents);
  const serialisedMessage = messageFormat.encode(protoMessage).finish();

  await wakuNode.lightPush.send(encoder, {
    payload: serialisedMessage,
  });
};
