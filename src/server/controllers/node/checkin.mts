import { store } from '../../../helpers/store.mjs';
import { updateCall } from '../../helpers/updateCall.mjs';
import { pingAllNodesContentTopic } from '../../../helpers/protocol/contentTopics.mjs';
import { sendMessage } from '../../../helpers/protocol/sendMessage.mjs';
import { PortraitPingMessage } from '../../../helpers/protocol/messageFormats.mjs';
import { getCurrentBlockNumber } from '../../../helpers/contractHelpers.mjs';
import { API_URL } from '../../../globals.mjs';
import { ethers } from 'ethers';
import { wallet } from '../../../helpers/contractHelpers.mjs';

export default async (req, res) => {
  try {
    const { portraitId } = req.body;

    const identifier = store.get('accounts.current.identifier') as string;

    const _portraitId = store.get('accounts.current.portraitId') as number;

    if (_portraitId !== portraitId) {
      return res.status(403).json({ message: 'Node not authenticated' });
    }

    const lastCheckIn = store.get('lastCheckIn.years') as number;
    const lastCheckInMonth = store.get('lastCheckIn.months') as number;
    const lastCheckInDay = store.get('lastCheckIn.days') as number;

    const now = new Date();

    // Extract the full date in UTC
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1; // Months are zero-indexed, so add 1
    const day = now.getUTCDate();

    // Check if the last check-in was today
    if (year === lastCheckIn && month === lastCheckInMonth && day === lastCheckInDay) {
      return res.status(403).json({ message: 'Node already checked in today' });
    }

    const nodeAddress = store.get('ethereumAddress') as string;
    const deviceName = store.get('accounts.current.deviceName') as string;
    const checkInTimestamp = now.getTime();
    const currentBlockNumber = await getCurrentBlockNumber();

    await fetch(`${API_URL}/node/checkin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ portraitId, identifier, nodeAddress, deviceName, checkInTimestamp }),
    });

    const portraits = store.get('portraits') as any[];
    let portraitIdArray = [];

    // add all portraitIds of the portraits to the portraitIdArray
    portraits.forEach((portrait) => {
      portraitIdArray.push(portrait.portraitId);
    });

    const keccak256 = ethers.solidityPackedKeccak256(
      ['string', 'string', 'uint256', 'string'],
      ['active', portraitIdArray.toString(), currentBlockNumber, store.get('ethereumAddress') as string],
    );

    const message = {
      nodeState: 'active',
      hostedPortraitIds: portraitIdArray.toString(),
      nodeBlockNumber: currentBlockNumber,
      nodeAddress: store.get('ethereumAddress') as string,
      signature: await wallet().signMessage(keccak256),
    };

    await sendMessage(pingAllNodesContentTopic, PortraitPingMessage, message);

    return res.status(200).json({ message: 'Node checked in' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
