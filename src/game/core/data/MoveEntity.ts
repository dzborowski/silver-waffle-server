import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {UserEntity} from "../../../auth/UserEntity";
import {GameEntity} from "./GameEntity";

@Entity({name: "move"})
export class MoveEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({type: "int"})
    public position: number;

    @Column()
    public userId: string;

    @ManyToOne(() => UserEntity)
    public user: UserEntity;

    @Column()
    public gameId: string;

    @ManyToOne(() => GameEntity, (game) => game.moves)
    public game: GameEntity;

    @CreateDateColumn({type: "timestamp"})
    public createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    public updatedAt: Date;
}
