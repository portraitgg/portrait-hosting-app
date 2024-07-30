import { Contract, ethers, JsonRpcProvider } from 'ethers';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { store } from './store.mjs';
import {
  PORTRAITACCESSREGISTRY_ADDRESS,
  PORTRAITIDREGISTRY_ADDRESS,
  PORTRAITNAMEREGISTRY_ADDRESS,
  PORTRAITNODEREGISTRY_ADDRESS,
  PORTRAITSIGVALIDATOR_L2_ADDRESS,
  PORTRAITSTATEREGISTRY_ADDRESS,
  RPC_ENDPOINT,
} from '../globals.mjs';

export const provider = new JsonRpcProvider(RPC_ENDPOINT);
export const wallet = () => new ethers.Wallet(store.get('ethereumPrivateKey') as string, provider);

export const chainTimestamp = async () => {
  const block = await provider.getBlock('latest');
  return block.timestamp;
};

export const getCurrentBlockNumber = async () => {
  const block = await provider.getBlockNumber();
  return block;
};

const filename = fileURLToPath(import.meta.url);
const parentDir = dirname(dirname(filename));

export const getContractForName = (_contractName) => {
  const contractAbi = fs.readFileSync(`${parentDir}/contracts/${_contractName}.sol/${_contractName}.json`);
  const contractAbiJSON = JSON.parse(contractAbi as any);
  const contractAbiParsed = contractAbiJSON.abi;

  const nameToAddress = {
    PortraitIdRegistry: PORTRAITIDREGISTRY_ADDRESS,
    PortraitStateRegistry: PORTRAITSTATEREGISTRY_ADDRESS,
    PortraitNameRegistry: PORTRAITNAMEREGISTRY_ADDRESS,
    PortraitAccessRegistry: PORTRAITACCESSREGISTRY_ADDRESS,
    PortraitNodeRegistry: PORTRAITNODEREGISTRY_ADDRESS,
    PortraitSigValidator: PORTRAITSIGVALIDATOR_L2_ADDRESS,
  };

  const contract = new Contract(nameToAddress[_contractName], contractAbiParsed, wallet());
  return contract;
};

export const executeCall = async (contractName, methodName, args) => {
  const contract = getContractForName(contractName);

  try {
    const result = await contract[methodName](...args);

    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
};
