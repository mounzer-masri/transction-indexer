import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
class TrackedAccount {
    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    address : string;
    @Column()
    createTime : Date;
    @Column()
    networks : string;

    constructor(_address : string, _createTime : Date, _networks : string){
        this.address = _address;
        this.createTime = _createTime;
        this.networks = _networks;
    }
}
 

export {TrackedAccount};
