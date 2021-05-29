import {getManager} from "typeorm";
import {UserEntity} from "../../auth/UserEntity";
import {ApiError} from "../../common/ApiError";
import {HttpCode} from "../../common/HttpCode";
import {GameEntity} from "./data/GameEntity";
import {MoveEntity} from "./data/MoveEntity";
import {GameState} from "./GameState";

export class GameService {
    protected gameId: string;

    public constructor(gameId: string) {
        this.gameId = gameId;
    }

    public async joinToGame(oponentId: string): Promise<void> {
        if (await this.isGameAlreadyFinished()) {
            throw new ApiError({message: "Cannot join to finished game", httpCode: HttpCode.BAD_REQUEST});
        }

        const manager = getManager();
        const game = await manager.findOneOrFail(GameEntity, this.gameId);
        const oponent = await manager.findOneOrFail(UserEntity, oponentId);

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

        game.oponent = oponent;
        game.state = GameState.STARTED;
        await manager.save(game);
    }

    public async isGameAlreadyFinished(): Promise<boolean> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);
        return game.state === GameState.FINISHED;
    }

    public async doesUserBelongToGame(userId: string): Promise<boolean> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);
        return game.creatorId === userId || game.oponentId === userId;
    }

    public async getStartingPlayer(): Promise<UserEntity> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId, {relations: ["oponent"]});
        return game.oponent; // todo optionally starting player can be random
    }

    public async getChronologicallyCreatedMoves(): Promise<MoveEntity[]> {
        return getManager().find(MoveEntity, {
            where: {gameId: this.gameId},
            order: {createdAt: "ASC"},
            relations: ["user"],
        });
    }

    public async getLastMove(): Promise<MoveEntity> {
        return getManager().findOne(MoveEntity, {
            where: {gameId: this.gameId},
            order: {createdAt: "DESC"},
            relations: ["user"],
        });
    }
}
