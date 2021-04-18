import {BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {UserEntity} from "../auth/UserEntity";

@Entity({name: "move"})
export class MoveEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @ManyToOne(() => UserEntity)
    public user: UserEntity;

    @CreateDateColumn({type: "timestamp"})
    public createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    public updatedAt: Date;
}
