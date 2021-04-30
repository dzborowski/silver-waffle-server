import {getManager} from "typeorm";
import {UserEntity} from "../auth/UserEntity";
import {ApiError} from "../common/ApiError";
import {HttpCode} from "../common/HttpCode";
import {GameEntity} from "./GameEntity";

export class GameService {
    public async crateGame(creatorId: string, gameSize: number): Promise<void> {
        const manager = getManager();
        const game = new GameEntity();

        game.size = gameSize;
        game.creator = await manager.findOneOrFail(UserEntity, {id: creatorId});
        await manager.save(game);
    }

    public async joinGame(gameId: string, oponentId: string): Promise<void> {
        const manager = getManager();

        const game = await manager.findOneOrFail(GameEntity, {id: gameId});
        const oponent = await manager.findOneOrFail(UserEntity, {id: oponentId});

        if (await this.isGameAlreadyFinished(gameId)) {
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

    public async isGameAlreadyFinished(gameId: string): Promise<boolean> {
        return false; // todo
    }
}
