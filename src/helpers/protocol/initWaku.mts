import { createLightNode, waitForRemotePeer, Protocols, DefaultShardInfo, waku } from '@waku/sdk';
import { store } from '../store.mjs';
import { setLastUpdateTimestamp } from '../lastUpdate.mjs';
import { dialog, app } from 'electron';
import { getAboutIcon } from '../../trayMenu/items/about/about.mjs';
import { loadingIcon } from '../../trayMenu/createTray.mjs';
export let wakuNode: any;

const showRetryDialog = async () => {
  const { response } = await dialog.showMessageBox({
    title: 'Portrait',
    message: 'Failed to connect to the network after multiple retries',
    type: 'info',
    icon: getAboutIcon(),
    detail: 'Please check your internet connection and restart the application, this often resolves the issue.',
    buttons: ['Retry', 'Quit'], // First button = index 0, second = index 1
    defaultId: 0, // default selected: Retry
    cancelId: 1, // ESC = Quit
  });

  if (response === 0) {
    // Retry
    console.log('Retrying to connect to the network');
    stopWakuNode();
    startWakuNode();
  } else {
    // Quit
    console.log('Quitting the app');
    app.quit();
  }
};

export const startWakuNode = async () => {
  try {
    console.log('Starting Waku node');

    // Animate
    loadingIcon(1);

    // If not ready after 32 seconds, return wakuNode (null)
    setTimeout(async () => {
      if (!isWakuNodeActive()) {
        await stopWakuNode(); // Ensure the node is stopped and set to null
        return wakuNode;
      }
    }, 32000);

    wakuNode = await createLightNode({
      shardInfo: DefaultShardInfo,
      defaultBootstrap: true,
      bootstrapPeers: [
        // ───────────── waku.test (3) ─────────────
        '/dns4/node-01.do-ams3.waku.test.status.im/tcp/8000/wss/p2p/16Uiu2HAkykgaECHswi3YKJ5dMLbq2kPVCo89fcyTd38UcQD6ej5W',
        '/dns4/node-01.ac-cn-hongkong-c.waku.test.status.im/tcp/8000/wss/p2p/16Uiu2HAkzHaTP5JsUwfR9NR8Rj9HC24puS6ocaU8wze4QrXr9iXp',
        '/dns4/node-01.gc-us-central1-a.waku.test.status.im/tcp/8000/wss/p2p/16Uiu2HAmDCp8XJ9z1ev18zuv8NHekAsjNyezAvmMfFEJkiharitG',

        // ───────────── waku.sandbox (3) ─────────────
        '/dns4/node-01.do-ams3.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmQSMNExfUYUqfuXWkD5DaNZnMYnigRxFKbk3tcEFQeQeE',
        '/dns4/node-01.gc-us-central1-a.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmRv1iQ3NoMMcjbtRmKxPuYBbF9nLYz2SDv9MTN8WhGuUU',
        '/dns4/node-01.ac-cn-hongkong-c.waku.sandbox.status.im/tcp/8000/wss/p2p/16Uiu2HAmQYiojgZ8APsh9wqbWNyCstVhnp9gbeNrxSEQnLJchC92',

        // ───────────── wakuv2.prod (1) ─────────────
        '/dns4/node-01.do-ams3.wakuv2.prod.status.im/tcp/8000/wss/p2p/16Uiu2HAmL5okWopX7NqZWBUKVqW8iUxCEmd5GMHLVPwCgzYzQv3e',

        // ───────────── status.prod (9) ─────────────
        // Amsterdam
        '/dns4/boot-01.do-ams3.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAmAR24Mbb6VuzoyUiGx42UenDkshENVDj4qnmmbabLvo31',
        '/dns4/store-01.do-ams3.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAmAUdrQ3uwzuE4Gy4D56hX6uLKEeerJAnhKEHZ3DxF1EfT',
        '/dns4/store-02.do-ams3.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAm9aDJPkhGxc2SFcEACTFdZ91Q5TJjp76qZEhq9iF59x7R',
        // US-Central
        '/dns4/boot-01.gc-us-central1-a.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAm8mUZ18tBWPXDQsaF7PbCKYA35z7WB2xNZH2EVq1qS8LJ',
        '/dns4/store-01.gc-us-central1-a.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAmMELCo218hncCtTvC2Dwbej3rbyHQcR8erXNnKGei7WPZ',
        '/dns4/store-02.gc-us-central1-a.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAmJnVR7ZzFaYvciPVafUXuYGLHPzSUigqAmeNw9nJUVGeM',
        // Hong Kong
        '/dns4/boot-01.ac-cn-hongkong-c.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAmGwcE8v7gmJNEWFtZtojYpPMTHy2jBLL6xRk33qgDxFWX',
        '/dns4/store-01.ac-cn-hongkong-c.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAm2M7xs7cLPc3jamawkEqbr7cUJX11uvY7LxQ6WFUdUKUT',
        '/dns4/store-02.ac-cn-hongkong-c.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAm9CQhsuwPR54q27kNj9iaQVfyRzTGKrhFmr94oD8ujU6P',

        // ───────────── status.staging (9) ─────────────
        // Amsterdam
        '/dns4/boot-01.do-ams3.status.staging.status.im/tcp/443/wss/p2p/16Uiu2HAmEqqio4UR1SWqAc7KY19t6qyDvtmyjreZpzUBJvb4u65R',
        '/dns4/store-01.do-ams3.status.staging.status.im/tcp/443/wss/p2p/16Uiu2HAm3xVDaz6SRJ6kErwC21zBJEZjavVXg7VSkoWzaV1aMA3F',
        '/dns4/store-02.do-ams3.status.staging.status.im/tcp/443/wss/p2p/16Uiu2HAmCDSnT8oNpMR9HH6uipD71KstYuDCAQGpek9XDAVmqdEr',
        // US-Central
        '/dns4/boot-01.gc-us-central1-a.status.staging.status.im/tcp/443/wss/p2p/16Uiu2HAmGAA54bBTE78MYidSy3P7Q9yAWFNTAEReJYD69VRvtL5r',
        '/dns4/store-01.gc-us-central1-a.status.staging.status.im/tcp/443/wss/p2p/16Uiu2HAmB7Ur9HQqo3cWDPovRQjo57fxWWDaQx27WxSzDGhN4JKg',
        '/dns4/store-02.gc-us-central1-a.status.staging.status.im/tcp/443/wss/p2p/16Uiu2HAmKBd6crqQNZ6nKCSCpHCAwUPn3DUDmkcPSWUTyVXpxKsW',
        // Hong Kong
        '/dns4/boot-01.ac-cn-hongkong-c.status.staging.status.im/tcp/443/wss/p2p/16Uiu2HAmNTpGnyZ8W1BK2sXEmgSCNWiyDKgRU3NBR2DXST2HzxRU',
        '/dns4/store-01.ac-cn-hongkong-c.status.staging.status.im/tcp/443/wss/p2p/16Uiu2HAmMU7Y29oL6DmoJfBFv8J4JhYzYgazPL7nGKJFBV3qcj2E',
        '/dns4/store-02.ac-cn-hongkong-c.status.staging.status.im/tcp/443/wss/p2p/16Uiu2HAmU7xtcwytXpGpeDrfyhJkiFvTkQbLB9upL5MXPLGceG9K',
      ],
    });

    await wakuNode.start();

    await waitForRemotePeer(wakuNode, [Protocols.Store]);

    // Wait for 2 seconds before setting the ready flag to make sure the node is fully ready
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    setLastUpdateTimestamp();
    return wakuNode;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const initWakuNode = async () => {
  wakuNode = await startWakuNode();

  if (!wakuNode) {
    await showRetryDialog();
  }

  return; // void
};

// A Waku node is started and connected to the network
export const isWakuNodeActive = () => wakuNode?.isStarted() && wakuNode?.isConnected();

export const stopWakuNode = async () => {
  if (!wakuNode) return;

  if (isWakuNodeActive()) {
    await wakuNode.stop();
  }

  wakuNode = null;
};
