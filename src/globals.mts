import dotenv from 'dotenv';
dotenv.config();

export const isDev = process.env.NODE_ENV === 'development';

export const EXPRESS_PORT = 35927;
export const PORTRAITIDREGISTRY_ADDRESS = '0x3cDc03BEb79ba3b9FD3b687C67BFDE70AFf46eBF';
export const PORTRAITACCESSREGISTRY_ADDRESS = '0xa837e9C834f23b04061b901814Af872291883ee7';
export const PORTRAITNAMEREGISTRY_ADDRESS = '0xc788716466009AD7219c78d8e547819f6092ec8F';
export const PORTRAITSTATEREGISTRY_ADDRESS = '0x320C9E64c9a68492A1EB830e64EE881D75ac5efd';
export const PORTRAITSIGVALIDATOR_L2_ADDRESS = '0xD2407EBde1B1ffE19da02710446f1449C0669Df2';
export const PORTRAITNODEREGISTRY_ADDRESS = '0x935f45e99eA6EeFE4C86845C996e27630b31C5Bb';
export const RPC_ENDPOINT = 'https://sepolia.base.org';
export const FRONTEND_URL = isDev ? process.env.FRONTEND_URL : 'https://portrait.so';
export const API_URL = isDev ? process.env.API_URL : 'https://api.portrait.so/api/v2';
export const CHAIN_ID = 84532;
