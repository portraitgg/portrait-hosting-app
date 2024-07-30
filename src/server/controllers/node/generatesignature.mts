import { ethers } from 'ethers';
import { FRONTEND_URL } from '../../../globals.mjs';
import { getContractForName, wallet, chainTimestamp } from '../../../helpers/contractHelpers.mjs';

export default async (req, res) => {
  try {
    const { portraitId } = req.body;

    const deadline = (await chainTimestamp()) + 300;

    const PortraitSigValidator = getContractForName('PortraitSigValidator');

    const keccak256 = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256'],
      [wallet().address, portraitId, deadline],
    );

    const message = await PortraitSigValidator.createMessage({
      action: 'registerNodeToPortraitId',
      target: 'PortraitNodeRegistry',
      targetType: 'Contract',
      version: 1,
      params: keccak256,
      expirationTime: deadline,
    });

    res.setHeader('Access-Control-Allow-Origin', `${FRONTEND_URL}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const sig = await wallet().signMessage(message);

    return res.status(200).json({ sig, nodeAddress: wallet().address, portraitId: portraitId, deadline: deadline });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
