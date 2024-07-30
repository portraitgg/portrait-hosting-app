import { getContractForName } from './contractHelpers.mjs';

const portraitIdRegistry = getContractForName('PortraitIdRegistry');
const portraitNameRegistry = getContractForName('PortraitNameRegistry');

async function getPrimaryPortraitHandleForEthereumAddress(ethereumAddress: string) {
  // Get the primary portrait ID for the ethereum address
  try {
    const primaryPortraitId = await portraitIdRegistry.ownerToPrimaryPortraitId(ethereumAddress);

    const primaryPortraitName = await portraitNameRegistry.portraitIdToName(primaryPortraitId);

    return primaryPortraitName;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function getPrimaryPortraitIdForEthereumAddress(ethereumAddress: string) {
  // Get the primary portrait ID for the ethereum address
  try {
    const primaryPortraitId = await portraitIdRegistry.ownerToPrimaryPortraitId(ethereumAddress);

    return primaryPortraitId;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export { getPrimaryPortraitHandleForEthereumAddress, getPrimaryPortraitIdForEthereumAddress };
