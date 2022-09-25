import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
class ProcessedBlockLog {
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    createTime : number;
    @Column()
    chainId : number;
    @Column()
    block : number;
    @Column()
    status : string;
    @Column()
    note : string;    

    constructor(_block : number, _chainId : number, _status : string, _note : string){
      this.block = _block;
      this.createTime = (new Date()).getDate();
      this.chainId = _chainId;
      this.status = _status;
      this.note = _note;
    }
}
 

export {ProcessedBlockLog};
