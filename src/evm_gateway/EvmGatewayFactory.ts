import { ethers } from 'ethers';

/** EVM-Provider-Factory */
const providerMap = {};

providerMap[1] = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth');
providerMap[4] = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_rinkeby');

function getProvider(networkId : number) : ethers.providers.JsonRpcProvider{
  return providerMap[networkId];
}


export {getProvider};