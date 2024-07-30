import protobuf from 'protobufjs';

export const PortraitUpdateMessage = new protobuf.Type('PortraitUpdateMessage')
  .add(new protobuf.Field('portraitObject', 1, 'string'))
  .add(new protobuf.Field('portraitSigner', 2, 'string'))
  .add(new protobuf.Field('portraitSignature', 3, 'string'));

export const PortraitLatestMessage = new protobuf.Type('PortraitLatestMessage')
  .add(new protobuf.Field('portraitObject', 1, 'string'))
  .add(new protobuf.Field('portraitSigner', 2, 'string'))
  .add(new protobuf.Field('portraitSignature', 3, 'string'))
  .add(new protobuf.Field('nodeBlockNumber', 4, 'uint64'))
  .add(new protobuf.Field('nodeAddress', 5, 'string'))
  .add(new protobuf.Field('nodeSignature', 6, 'string'));

export const PortraitRequestMessage = new protobuf.Type('PortraitRequestMessage')
  .add(new protobuf.Field('portraitId', 1, 'uint64'))
  .add(new protobuf.Field('requestBlockNumber', 2, 'uint64'));

export const PortraitPingMessage = new protobuf.Type('PortraitPingMessage')
  .add(new protobuf.Field('nodeState', 1, 'string'))
  .add(new protobuf.Field('hostedPortraitIds', 2, 'string'))
  .add(new protobuf.Field('nodeBlockNumber', 3, 'uint64'))
  .add(new protobuf.Field('nodeAddress', 4, 'string'))
  .add(new protobuf.Field('nodeSignature', 5, 'string'));
