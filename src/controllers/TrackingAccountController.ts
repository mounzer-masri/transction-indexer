import {Request, Response, NextFunction} from 'express';
import logging from '../Logging';
import {TrackedAccountsService} from '../services/TrackingAccountsService';

const NAMESPACE = 'Tracking-Account-Controller'


const startTrackingAccountApi = async (req : Request,  res : Response, next : NextFunction) => {
    logging.info(NAMESPACE, `startTrackingAccount API called`);

     if(req.body.address === undefined){
        res.status(400).send('Address parameter is missing!');
     } 

     let address : string = req.body.address as string;

     if(address.length != 42 || !address.startsWith('0x')){
        res.status(400).send('Address value is incorrect!');
     }

     if(req.body.network === undefined){
      res.status(400).send('network parameter is missing!');
     } 
     
     if(req.body.startFromBlock === undefined){
      res.status(400).send('startFromBlock parameter is missing!');
     } 
     
    await TrackedAccountsService.getInstance().startTrackingAccount(address, req.body.network, req.body.startFromBlock);
    logging.info(NAMESPACE, `startTrackingAccount Response is ready: \n`);
    return res.status(200).json({status : 'ok', message : 'We recieved your request and its under processing.'});
}


export default{startTrackingAccountApi};