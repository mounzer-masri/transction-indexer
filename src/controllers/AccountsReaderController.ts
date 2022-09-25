import {Request, Response, NextFunction} from 'express';
import logging from '../Logging';
import {AccountTransactionHistoryDto} from './dto/AccountTransactionHistoryDto';
import {getTransactionHistory} from '../services/AccountsReaderService';

const NAMESPACE = 'Account-Reader-Controller'


const getTransactionHistoryApi = async (req : Request,  res : Response, next : NextFunction) => {
    logging.info(NAMESPACE, `getTransactionHistoryApi called`);

    if(req.body.addresses === undefined){
    res.status(400).send('Addresses parameter is missing!');
    }

    let result : AccountTransactionHistoryDto[] = await getTransactionHistory(req.body.addresses);
    logging.info(NAMESPACE, `getTransactionHistoryApi Response is ready: \n`, result);
    return res.status(200).json(result);
}


export default{getTransactionHistoryApi};