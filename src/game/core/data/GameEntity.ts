import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {UserEntity} from "../../../auth/UserEntity";
import {MoveEntity} from "./MoveEntity";
import {GameState} from "../GameState";

@Entity({name: "game"})
export class GameEntity extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({type: "int"})
    public size: number;

    @Column({type: "enum", enum: GameState, default: GameState.CREATED})
    public state: GameState;

    @Column()
    public creatorId: string;

    @ManyToOne(() => UserEntity, (user) => user.gamesAsCreator)
    public creator: UserEntity;

    @Column({nullable: true})
    public oponentId: string;

    @ManyToOne(() => UserEntity, (user) => user.gamesAsOponent)
    public oponent: UserEntity;

    @OneToMany(() => MoveEntity, (move) => move.game)
    public moves: MoveEntity[];

    @Column({nullable: true})
    public winnerId: string;

    @ManyToOne(() => UserEntity)
    public winner: UserEntity;

    @CreateDateColumn({type: "timestamp"})
    public createdAt: Date;

    @UpdateDateColumn({type: "timestamp"})
    public updatedAt: Date;
}
