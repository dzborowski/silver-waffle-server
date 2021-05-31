import {EntityManager} from "typeorm";
import {UserEntity} from "../../auth/UserEntity";
import {ApiError} from "../../common/ApiError";
import {HttpCode} from "../../common/HttpCode";
import {GameEntity} from "./data/GameEntity";
import {MoveEntity} from "./data/MoveEntity";
import {GameState} from "./GameState";

export class GameService {
    protected gameId: string;
    protected manager: EntityManager;

    public constructor(gameId: string, manager: EntityManager) {
        this.gameId = gameId;
        this.manager = manager;
    }

    public async joinToGame(oponentId: string): Promise<void> {
        if (await this.gameWasFinished()) {
            throw new ApiError({message: "Cannot join to finished game", httpCode: HttpCode.BAD_REQUEST});
        }

        const game = await this.manager.findOneOrFail(GameEntity, this.gameId);

        if (game.creatorId === oponentId) {
            throw new ApiError({
                message: "Cannot join to game as oponent when you are creator of the game",
                httpCode: HttpCode.BAD_REQUEST,
            });
        }

        if (game.oponentId) {
            throw new ApiError({
                message: "Cannot join to game which have already all players",
                httpCode: HttpCode.BAD_REQUEST,
            });
        }

        game.oponent = await this.manager.findOneOrFail(UserEntity, oponentId);
        game.state = GameState.STARTED;
        await this.manager.save(game);
    }

    public async gameWasStarted(): Promise<boolean> {
        const game = await this.manager.findOneOrFail(GameEntity, this.gameId);
        return game.state === GameState.STARTED;
    }

    public async gameWasFinished(): Promise<boolean> {
        const game = await this.manager.findOneOrFail(GameEntity, this.gameId);
        return game.state === GameState.FINISHED;
    }

    public async doesUserBelongToGame(userId: string): Promise<boolean> {
        const game = await this.manager.findOneOrFail(GameEntity, this.gameId);
        return game.creatorId === userId || game.oponentId === userId;
    }

    public async getStartingPlayer(): Promise<UserEntity> {
        const game = await this.manager.findOneOrFail(GameEntity, this.gameId, {relations: ["oponent"]});
        return game.oponent; // todo optionally starting player can be random
    }

    public async getChronologicallyCreatedMoves(): Promise<MoveEntity[]> {
        return this.manager.find(MoveEntity, {
            where: {gameId: this.gameId},
            order: {createdAt: "ASC"},
        });
    }

    public async getLastMove(): Promise<MoveEntity> {
        return this.manager.findOne(MoveEntity, {
            where: {gameId: this.gameId},
            order: {createdAt: "DESC"},
        });
    }
}
