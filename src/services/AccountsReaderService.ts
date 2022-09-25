import {AppDataSource, getDataSource} from '../repositories/DataSource';
import { DataSource, Repository } from "typeorm";
import {Transaction} from '../models/Transaction';
import * as dtos from '../controllers/dto/AccountTransactionHistoryDto'; 

/** Service Layer */
async function getTransactionHistory(addresses : string[]) : Promise<dtos.AccountTransactionHistoryDto[]>{
    var res : dtos.AccountTransactionHistoryDto[] = [];

    let ds : DataSource = await getDataSource();
    let transactionRepo = ds.getRepository(Transaction);
    for(let addr of addresses){
      let accountTransactions = await transactionRepo.findBy({from : addr});
      let etherTxList = accountTransactions.map(tx => tx.content);
      res.push(new dtos.AccountTransactionHistoryDto(addr, etherTxList));
    };

    return res; 
}
 


export {getTransactionHistory};