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

    public async joinGame(oponentId: string): Promise<void> {
        const manager = getManager();

        const game = await manager.findOneOrFail(GameEntity, this.gameId, {relations: ["creator", "oponent"]});
        const oponent = await manager.findOneOrFail(UserEntity, oponentId);

        if (await this.isGameAlreadyFinished()) {
            throw new ApiError({message: "Cannot join to finished game", httpCode: HttpCode.BAD_REQUEST});
        }

        if (game.creator.id === oponentId) {
            throw new ApiError({
                message: "Cannot join to game as oponent when you are creator of the game",
                httpCode: HttpCode.BAD_REQUEST,
            });
        }

        if (game.oponent) {
            throw new ApiError({
                message: "Cannot join to game which have already all players",
                httpCode: HttpCode.BAD_REQUEST,
            });
        }

        game.oponent = oponent;
        await manager.save(game);
    }

    public async isGameAlreadyFinished(): Promise<boolean> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);
        return game.state === GameState.FINISHED;
    }

    public async doesUserBelongToGame(userId: string): Promise<boolean> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId, {relations: ["creator", "oponent"]});
        return game.creator.id === userId || game.oponent?.id === userId;
    }

    public async getStartingPlayer(): Promise<UserEntity> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId, {relations: ["oponent"]});
        return game.oponent; // todo optionally starting player can be random
    }

    public async getChronologicallyCreatedMoves(): Promise<MoveEntity[]> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);
        return getManager().find(MoveEntity, {
            where: {game},
            order: {createdAt: "ASC"},
            relations: ["user"],
        });
    }

    public async getLastMove(): Promise<MoveEntity> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);
        return getManager().findOne(MoveEntity, {where: {game}, order: {createdAt: "DESC"}, relations: ["user"]});
    }
}
