import {Request, Response} from "express";
import {getManager, Not} from "typeorm";
import {GameEntity} from "../core/data/GameEntity";
import {MoveEntity} from "../core/data/MoveEntity";
import {GameService} from "../core/GameService";
import {ApiError} from "../../common/ApiError";
import {HttpCode} from "../../common/HttpCode";
import {GameFactory} from "../core/GameFactory";
import {GameState} from "../core/GameState";
import {GameSocketConfig} from "../socket/GameSocketConfig";

export class GameHttpController {
    public static async createGame(req: Request, res: Response): Promise<void> {
        const game = await GameFactory.crateGame(req.user.id, req.body.gameSize);
        req.app.get("socket.io").to(GameSocketConfig.GENERAL_ROOM).emit("available-games-state-have-changed");
        res.json(game);
    }

    public static async joinToGame(req: Request, res: Response): Promise<void> {
        const gameId = req.params.gameId;
        const gameService = new GameService(gameId);
        await gameService.joinToGame(req.user.id);
        req.app.get("socket.io").to(GameSocketConfig.GENERAL_ROOM).emit("available-games-state-have-changed");
        res.end();
    }

    public static async getAvailableGames(req: Request, res: Response): Promise<void> {
        const games = await getManager().find(GameEntity, {
            where: {state: GameState.CREATED, creatorId: Not(req.user.id)},
        });
        res.json(games);
    }

    public static async getUserGames(req: Request, res: Response): Promise<void> {
        const games = await getManager().find(GameEntity, {where: [{creator: req.user}, {oponent: req.user}]});
        res.json(games);
    }

    public static async getGameMoves(req: Request, res: Response): Promise<void> {
        const manager = getManager();
        const gameService = new GameService(req.params.gameId);
        const doesUserBelongToGame = await gameService.doesUserBelongToGame(req.user.id);

        if (!doesUserBelongToGame) {
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
