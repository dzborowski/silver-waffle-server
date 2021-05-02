import {Request, Response} from "express";
import {getManager} from "typeorm";
import {GameEntity} from "../core/data/GameEntity";
import {MoveEntity} from "../core/data/MoveEntity";
import {GameService} from "../core/GameService";
import {ApiError} from "../../common/ApiError";
import {HttpCode} from "../../common/HttpCode";

export class GameHttpController {
    public static async getGames(req: Request, res: Response): Promise<void> {
        const games = await getManager().find(GameEntity);
        res.json(games);
    }

    public static async getGameMoves(req: Request, res: Response): Promise<void> {
        const manager = getManager();
        const gameService = new GameService(req.params.gameId);
        const isUserBelongsToGame = await gameService.isUserBelongsToGame(req.user.id);

        if (!isUserBelongsToGame) {
            throw new ApiError({
                message: "Cannot get moves from game where you didn't belong",
                httpCode: HttpCode.FORBIDDEN,
            });
        }

        const game = await manager.findOneOrFail(GameEntity, req.params.gameId);
        const moves = await manager.find(MoveEntity, {where: {game}, order: {createdAt: "ASC"}});
        res.json(moves);
    }
}
