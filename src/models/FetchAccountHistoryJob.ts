import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
class FetchAccountHistoryJob {
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    address : string;
    @Column()
    networkId : number;
    @Column()
    createTime : Date;
    @Column()
    subscription_started_at_block : number;
    @Column()
    historyTransactionCount: number;
    @Column()
    mostRecentSyncedBlock : number; 
    @Column()
    lastUpdateTime : Date = new Date(); 
    @Column()
    status : string;
    @Column()
    note :string;
    @Column()
    microserviceInstanceId : number;
    
    constructor(_address : string, _createTime : Date, hisTxCount : number, _mostRecentSyncedBlock : number, subscribedAtBlock : number, networkId : number, instanceId: number){
        this.address = _address;
        this.createTime = _createTime;
        this.historyTransactionCount = hisTxCount;
        this.subscription_started_at_block = subscribedAtBlock;
        this.mostRecentSyncedBlock = _mostRecentSyncedBlock;
        this.networkId = networkId;
        this.microserviceInstanceId = instanceId;
        this.status = 'CREATED'
        this.note = ''

    }
 
}
 

export {FetchAccountHistoryJob};
