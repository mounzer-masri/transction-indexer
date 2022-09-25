import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import logging from './Logging';
import config from './Config';
import trackingAccountRouter from './routes/TrackingAccountRouter';
import AccountsReaderRouter from './routes/AccountsReaderRouter';
import {processLiveChainBlocks} from './services/LiveBlockTracker'
import { initializeTransactionalContext } from 'typeorm-transactional';
initializeTransactionalContext() // Initialize cls-hooked

const NAMESPACE = 'Server';
export const app = express();


/* Logging */
app.use ((req, res, next) => {
    logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
         /** Log the res */
         logging.info(NAMESPACE, `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    })

    next();
})

/** Parse the request */
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

/** Rules of API */
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
        return res.status(200).json({});
    }
    next();
});


/** Routes */
app.use('/accounts-tracker', trackingAccountRouter);
app.use('/accounts-reader', AccountsReaderRouter);

/** Error Handling */
app.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message : error.message
    })
}) 

/** create server */
const httpSerer = http.createServer(app);
httpSerer.listen(config.config.server.port, () => logging.info(NAMESPACE, `Server running ${config.config.server.hostname}:${config.config.server.port}`));



/** Run Live Listener for chain blocks */
processLiveChainBlocks(1);