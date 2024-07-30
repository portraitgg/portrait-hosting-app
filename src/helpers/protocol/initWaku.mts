import { createLightNode, waitForRemotePeer, Protocols, DefaultShardInfo } from '@waku/sdk';
import { store } from '../store.mjs';
import { setLastUpdateTimestamp } from '../lastUpdate.mjs';
import { dialog, app } from 'electron';
import { getAboutIcon } from '../../trayMenu/items/about/about.mjs';
export let wakuNode: any;

export const startWakuNode = async () => {
  try {
    console.log('Starting Waku node');
    const isReady = () => store.get('waku.ready');

    // If not ready after 12 seconds, show a dialog and quit the app
    setTimeout(() => {
      if (!isReady()) {
        dialog
          .showMessageBox({
            title: 'Portrait',
            message: 'Failed to connect to the network after multiple retries',
            type: 'info',
            icon: getAboutIcon(),
            detail: 'Please check your internet connection and restart the application, this often resolves the issue.',
            buttons: ['Quit Portrait'],
          })
          .then(() => {
            app.quit();
          });
      }
    }, 12000);

    wakuNode = await createLightNode({
      shardInfo: DefaultShardInfo,
      defaultBootstrap: true,
      bootstrapPeers: [
        '/dns4/node1.portrait.systems/tcp/8000/wss/p2p/16Uiu2HAmDoXWNwTxAyt6jQdRWZx5uzU99VWaC5xnDS85gm1o3SEV',
        '/dns4/node-01.do-ams3.waku.test.status.im/tcp/8000/wss/p2p/16Uiu2HAkykgaECHswi3YKJ5dMLbq2kPVCo89fcyTd38UcQD6ej5W',
        '/dns4/node-01.ac-cn-hongkong-c.waku.test.status.im/tcp/8000/wss/p2p/16Uiu2HAkzHaTP5JsUwfR9NR8Rj9HC24puS6ocaU8wze4QrXr9iXp',
        '/dns4/node-01.gc-us-central1-a.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmRv1iQ3NoMMcjbtRmKxPuYBbF9nLYz2SDv9MTN8WhGuUU',
        '/dns4/node-01.ac-cn-hongkong-c.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmQYiojgZ8APsh9wqbWNyCstVhnp9gbeNrxSEQnLJchC92',
        '/dns4/node-01.do-ams3.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmQSMNExfUYUqfuXWkD5DaNZnMYnigRxFKbk3tcEFQeQeE',
      ],
    });

    await wakuNode.start();
    await waitForRemotePeer(wakuNode, [Protocols.Store]);

    // Wait for 2 seconds before setting the ready flag to make sure the node is fully ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    store.set('waku.ready', true);

    setLastUpdateTimestamp();
    return wakuNode;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const initWakuNode = async () => {
  const wakuNode = await startWakuNode();

  if (!wakuNode) {
    dialog
      .showMessageBox({
        title: 'Portrait',
        message: 'Something went wrong while connecting to the network',
        type: 'info',
        icon: getAboutIcon(),
        detail: 'Please check your internet connection and restart the application, this often resolves the issue.',
        buttons: ['Quit'],
      })
      .then(() => {
        app.quit();
      });
  }

  return wakuNode;
};
