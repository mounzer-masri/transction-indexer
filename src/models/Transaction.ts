import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { ethers } from 'ethers';

@Entity()
class Transaction {
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    hash : string;
    @Column()
    createTime : number;
    @Column()
    chainId : number;
    @Column()
    block : number;
    @Column()
    from : string;
    @Column({ type: 'json' })
    content : ethers.providers.TransactionResponse;
    
    constructor(_hash : string, _chainId : number, _from : string, _content : ethers.providers.TransactionResponse, _blockNo : number, _timeStamp : number){
      this.hash = _hash;
      this.chainId = _chainId;
      this.block = _blockNo;
      this.from = _from;
      this.createTime = _timeStamp;
      this.content = _content;
    }
}
 

export {Transaction};
