import {EVMGateway} from '../evm_gateway/EVMGateway';
import {getProvider} from '../evm_gateway/EvmGatewayFactory';
import { ethers } from 'ethers';
import {Transaction} from '../models/Transaction';
import { TrackedAccount } from '../models/TrackedAccount';
import { DataSource, Repository } from "typeorm";
import {ProcessedBlockLog} from "../models/ProcessedBlockLog";
import {AppDataSource, getDataSource} from '../repositories/DataSource';
require('dotenv').config()

/** LiveBlockListener works automatically once APP startup*/

async function processLiveChainBlocks(network : number){
    //get provider of network.  
    let provider = getProvider(network);
    let evm : EVMGateway  = new EVMGateway(provider);
    let blockTrnasactions : Transaction[] = [];
    let watchList: Set<string> = new Set<string>();

    // subscribe to block 
    provider.on("block", async (blockNumber) => {
        console.log(`new block ${blockNumber}`)
        //Refresh AccountWatchList.
        await refreshWatchListAccounts(watchList);
        //Execute out-of-sync detector. 
        //todo >> checkOutOfSync();

        //Get block info.
        let block = await evm.getBlock(blockNumber);
        //Loop on tx and extract useful ones/
        for(let txHash of block.transactions){
            let tx : ethers.providers.TransactionResponse = await evm.getTransaction(txHash);
            if(watchList.has(tx.from.toLowerCase())){
                console.log(`Transaction detected >> \n ${tx}`);
                let myTx : Transaction = new Transaction(tx.hash, tx.chainId, tx.from, tx, block.number, block.timestamp);
                blockTrnasactions.push(myTx);
            }
        }
        //Flush tx to storage. 
        flushTransactions(blockNumber, network, blockTrnasactions);
    });
}

async function flushTransactions( atBlock : number, chainId : number, myTrnasactions : Transaction[]){
    //insert transactions
    await (await getDataSource()).manager.transaction(async (transactionalEntityManager) => {
        //write down syncing progress.
        let newBlock : ProcessedBlockLog = new ProcessedBlockLog(atBlock, chainId, 'DONE', 'OK');
        await transactionalEntityManager.save(newBlock);            

        for(let tx of myTrnasactions){
            await transactionalEntityManager.save(tx);
        } 
    });
}

async function refreshWatchListAccounts(watchList : Set<string>) {
    let ds : DataSource = await getDataSource();
    let accountRepo = ds.getRepository(TrackedAccount);
    let watchListAccounts = await accountRepo.find();
    watchListAccounts.map(w => w.address.toLowerCase()).forEach(addr => watchList.add(addr));
}

async function checkOutOfSync(detectedBlock : number){
    /*
    let mostRecentBlock = get most recent processed block from DB
    if((detectedBlock - mostRecentBlock) > 1){
        //out of sync detected.
        backfillOutofSyncBlocks(mostRecentBlock, detectedBlock - 1);
    }
    */
}

async function backfillOutofSyncBlocks(startBlock:number, endBlock : number) {
    /*
        - scan blocks.
        - loop over transactions.
        - get transaction info 
        - if (tx.from in watchList){
            - add tx to list
        }
        - flush tx to DB.
        - close job.
    */
}
export {processLiveChainBlocks};