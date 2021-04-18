import {BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {UserEntity} from "../auth/UserEntity";

@Entity({name: "game"})
export class GameEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @ManyToOne(() => UserEntity)
    public creator: UserEntity;

    @ManyToOne(() => UserEntity)
    public oponent: UserEntity;

    @CreateDateColumn({type: "timestamp"})
    public createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    public updatedAt: Date;
}
