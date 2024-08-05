import { store } from './store.mjs';
import { API_URL } from '../globals.mjs';
const callHome = () => {
  try {
    const endpoint = `${API_URL}/node/ping/post`;
    const nodeAddress = store.get('ethereumAddress');

    if (!nodeAddress) {
      console.log('No node address');
      return;
    }

    const data = {
      nodeAddress,
    };

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    // console.error(error);
  }
};

/*
 * We call home to monitor the health of the nodes in the network.
 * Similar information can be obtained from the network directly.
 * This call does not contain any sensitive information, nor any information which can not be obtained from the network.
 *
 * We're implementing this for the following reasons:
 * - To monitor and find discrepancies between the network and the actual nodes.
 * - The node and network are in early development, it helps us track down bugs and issues.
 *
 * This call is made every minute.
 */
const callHomePeriodically = () => {
  // On boot, call home directly
  if (store.get('ethereumAddress')) {
    console.log('Calling home on boot');
    callHome();
  }

  // After run, every minute
  setInterval(() => {
    console.log('Calling home');
    callHome();
  }, 60000);
};

export { callHomePeriodically };
