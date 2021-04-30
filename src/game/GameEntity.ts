import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {UserEntity} from "../auth/UserEntity";

@Entity({name: "game"})
export class GameEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({type: "int"})
    public size: number;

    @ManyToOne(() => UserEntity, (user) => user.gamesAsCreator)
    public creator: UserEntity;

    @ManyToOne(() => UserEntity, (user) => user.gamesAsOponent)
    public oponent: UserEntity;

    @CreateDateColumn({type: "timestamp"})
    public createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    public updatedAt: Date;
}
