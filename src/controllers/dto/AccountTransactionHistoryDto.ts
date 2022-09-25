import { ethers } from 'ethers';

 
class AccountTransactionHistoryDto{
    address : string;
    transactions : ethers.providers.TransactionResponse[]; 
    constructor(_address : string, _transactions : ethers.providers.TransactionResponse[]){
        this.address = _address;
        this.transactions = _transactions;
    }
}

export {AccountTransactionHistoryDto};
