import {FetchAccountHistoryJob} from '../models/FetchAccountHistoryJob';
import {Transaction} from '../models/Transaction';
import {EVMGateway} from '../evm_gateway/EVMGateway';
import {getProvider} from '../evm_gateway/EvmGatewayFactory';
import { Transactional } from 'typeorm-transactional';
import { ethers } from 'ethers';
import {AppDataSource, getDataSource} from '../repositories/DataSource';
import log from '../Logging';

require('dotenv').config()
const NAMESPACE = 'AccountHistoryFetcher-JobExecutor'

/** Job Executor */
export class AccountHistoryFetcher {
       
    private static instance: AccountHistoryFetcher;
    private constructor() { }
    public static getInstance(): AccountHistoryFetcher {
        if (!AccountHistoryFetcher.instance) {
            AccountHistoryFetcher.instance = new AccountHistoryFetcher();
        }

        return AccountHistoryFetcher.instance;
    }

    async fetchAccountHistory(job : FetchAccountHistoryJob){
        log.info(NAMESPACE, 'FetchAccountHistoryJob executing started..');
        let providor = getProvider(job.networkId);
        let evm : EVMGateway  = new EVMGateway(providor);
        let startBlock = job.mostRecentSyncedBlock;
        let endBlock = job.subscription_started_at_block;
        
        let myTrnasactions : Transaction[] = [];
        let totalFoundTransactions = 0;

        if(job.historyTransactionCount == 0){
            return;
        }

        while(startBlock <= endBlock){
            let block = await evm.getBlock(startBlock);
            log.info(NAMESPACE,`startBlock ${startBlock} -- tx : ${block.transactions.length}` );
            for(let txHash of block.transactions){
                log.info(NAMESPACE, `JOB-id ${job.id} - Checking-tx : ${txHash}`);
                let tx : ethers.providers.TransactionResponse = await evm.getTransaction(txHash);
                if(tx.from.toLowerCase() == job.address.toLowerCase()){
                    log.info(NAMESPACE,`tx detected \n ${tx}`);
                    totalFoundTransactions++;
                    let myTx : Transaction = new Transaction(tx.hash, tx.chainId, tx.from, tx, block.number, block.timestamp);
                    myTrnasactions.push(myTx);
                }
            }
            
            if(startBlock % 12 == 0){
                //flush to db. 
                await this.flushTransactions(job, startBlock, myTrnasactions);
                myTrnasactions = [];
            }

            if(totalFoundTransactions == job.historyTransactionCount){
                await this.flushTransactions(job, startBlock, myTrnasactions);
                return;
            }

            startBlock++;
        }
    }

    async flushTransactions(job : FetchAccountHistoryJob, atBlock : number, myTrnasactions : Transaction[]){
        //insert transactions
        await (await getDataSource()).manager.transaction(async (transactionalEntityManager) => {
            //update JOB progress
            job.mostRecentSyncedBlock = atBlock;
            await transactionalEntityManager.save(job);

            for(let tx of myTrnasactions){
                await transactionalEntityManager.save(tx);
            } 
        });
    }

}
