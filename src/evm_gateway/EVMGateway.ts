import { ethers } from 'ethers';

/** EVM-Gateway */

class EVMGateway{
  provider : ethers.providers.JsonRpcProvider;
  constructor(_provider : ethers.providers.JsonRpcProvider /*ethers.providers.WebSocketProvider*/){
      this.provider = _provider;
  }

  async getTransactionCount(address : string)  : Promise<number> {
    return await this.provider.getTransactionCount(address);
  }
  
  async getBlockNumber()  : Promise<number> {
    return await this.provider.getBlockNumber();
  }

  async getBlock(blockTag : number) : Promise<ethers.providers.Block> {
    return await this.provider.getBlock(blockTag);
  }

  async getTransaction(txHash : string) : Promise<ethers.providers.TransactionResponse> {
    return await this.provider.getTransaction(txHash);
  }

}

export {EVMGateway};