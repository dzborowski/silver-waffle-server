import {getManager} from "typeorm";
import {UserEntity} from "../auth/UserEntity";
import {ApiError} from "../common/ApiError";
import {HttpCode} from "../common/HttpCode";
import {GameEntity} from "./GameEntity";

export class GameService {
    protected gameId: string;

    public constructor(gameId: string) {
        this.gameId = gameId;
    }

    public async joinGame(oponentId: string): Promise<void> {
        const manager = getManager();

        const game = await manager.findOneOrFail(GameEntity, this.gameId);
        const oponent = await manager.findOneOrFail(UserEntity, oponentId);

        if (await this.isGameAlreadyFinished()) {
            throw new ApiError({message: "Cannot join to finished game", httpCode: HttpCode.BAD_REQUEST});
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
        return false; // todo
    }

    public async isUserBelongsToGame(userId: string): Promise<boolean> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);
        return game.creator.id === userId || game.oponent?.id === userId;
    }

    public async getStartingPlayer(): Promise<UserEntity> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);
        return game.oponent;
    }
}
