import "reflect-metadata"
import { DataSource, Repository } from "typeorm"
import { FetchAccountHistoryJob } from "../models/FetchAccountHistoryJob"
import {TrackedAccount} from "../models/TrackedAccount";
import {Transaction} from "../models/Transaction";
import {ProcessedBlockLog} from "../models/ProcessedBlockLog";

import { initializeTransactionalContext, addTransactionalDataSource } from 'typeorm-transactional';

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "12345",
  database: "tx_indexer_db",
  synchronize: true,
  logging: true,
  entities: [FetchAccountHistoryJob, TrackedAccount, Transaction, ProcessedBlockLog],
  subscribers: [],
  migrations: []
})

AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};

initializeTransactionalContext();
addTransactionalDataSource(AppDataSource);
console.log('Datasource is prepared');

