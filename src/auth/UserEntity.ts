import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {GameEntity} from "../game/core/data/GameEntity";
import {MoveEntity} from "../game/core/data/MoveEntity";

@Entity({name: "user"})
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({type: "varchar", length: 255})
    public firstName: string;

    @Column({type: "varchar", length: 255})
    public lastName: string;

    @Column({type: "varchar", length: 255, unique: true})
    public email: string;

    @Column({type: "varchar", length: 255})
    public password: string;

    @OneToMany(() => GameEntity, (game) => game.creator)
    public gamesAsCreator: GameEntity[];

    @OneToMany(() => GameEntity, (game) => game.oponent)
    public gamesAsOponent: GameEntity[];

    @OneToMany(() => MoveEntity, (move) => move.user)
    public moves: MoveEntity[];

    @CreateDateColumn({type: "timestamp"})
    public createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    public updatedAt: Date;
}
