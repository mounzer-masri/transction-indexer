import {FetchAccountHistoryJob} from '../models/FetchAccountHistoryJob';
import {EVMGateway} from '../evm_gateway/EVMGateway';
import {getProvider} from '../evm_gateway/EvmGatewayFactory';
import { Transactional } from 'typeorm-transactional';
import {AppDataSource, getDataSource} from '../repositories/DataSource';
import { TrackedAccount } from '../models/TrackedAccount';
import {AccountHistoryFetcher} from './AccountHistoryFetcher';
import log from '../Logging';

require('dotenv').config()
const NAMESPACE = 'Tracking-Account-Service'

/** Service Layer */
export class TrackedAccountsService {
    
    private static instance: TrackedAccountsService;
    private constructor() { }
    public static getInstance(): TrackedAccountsService {
        if (!TrackedAccountsService.instance) {
            TrackedAccountsService.instance = new TrackedAccountsService();
        }

        return TrackedAccountsService.instance;
    }

    //@Transactional() 
    async startTrackingAccount(address : string, networks : number[], startFromBlock : number){
        log.info(NAMESPACE, 'startTrackingAccount called');
        const historyJobs :  FetchAccountHistoryJob[] = [];

        //loop over networks
        for(let i = 0; i < networks.length; i++){
            //factory get evm-gateway
            let providor = getProvider(networks[i]);
            let evm : EVMGateway  = new EVMGateway(providor);
            //getTransactionCount of account (on-chain)
            let transactionCount = await evm.getTransactionCount(address);
            
            //getCurrentBlock (on-chain)
            let currentBlockNum = await evm.getBlockNumber();
                
            //prepare fetch-account-history-job.  
            const instanceId : number = ((process.env.micorservice_instance_id as any) as number);
            let fetchHistoryJob : FetchAccountHistoryJob = new FetchAccountHistoryJob(address, new Date(),
                                                                            transactionCount, startFromBlock, currentBlockNum,
                                                                            networks[i], instanceId);
            
            historyJobs.push(fetchHistoryJob);
        }

        //insert row into tracked_account
        await (await getDataSource()).manager.transaction(async (transactionalEntityManager) => {
            for(let job of historyJobs){
                await transactionalEntityManager.save(job);
            }

            let newAccount : TrackedAccount = new TrackedAccount(address, new Date(), networks.toString());
            await transactionalEntityManager.save(newAccount);
        });

        //trigger fetch-worker.for every network. 
        for(let job of historyJobs){
            AccountHistoryFetcher.getInstance().fetchAccountHistory(job);
        }

        return;
    }
}
