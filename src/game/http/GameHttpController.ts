import {Request, Response} from "express";
import {EntityManager, getManager, Not} from "typeorm";
import {GameEntity} from "../core/data/GameEntity";
import {MoveEntity} from "../core/data/MoveEntity";
import {GameService} from "../core/GameService";
import {ApiError} from "../../common/ApiError";
import {HttpCode} from "../../common/HttpCode";
import {GameFactory} from "../core/GameFactory";
import {GameState} from "../core/GameState";
import {GameSocketConfig} from "../socket/GameSocketConfig";
import {IsolationLevel} from "../../common/IsolationLevel";

export class GameHttpController {
    public static async createGame(req: Request, res: Response): Promise<void> {
        const game = await GameFactory.crateGame(req.user.id, req.body.gameSize);
        req.app.get("socket.io").to(GameSocketConfig.GENERAL_ROOM).emit("new-game-was-created");
        res.json(game);
    }

    public static async joinToGame(req: Request, res: Response): Promise<void> {
        await getManager().transaction(IsolationLevel.SERIALIZABLE, async (manager: EntityManager) => {
            const gameId = req.params.gameId;
            const gameService = new GameService(gameId, manager);
            await gameService.joinToGame(req.user.id);
        });

        req.app.get("socket.io").to(GameSocketConfig.GENERAL_ROOM).emit("player-joined-to-available-game");
        res.end();
    }

    public static async getAvailableGames(req: Request, res: Response): Promise<void> {
        const games = await getManager().find(GameEntity, {
            where: {state: GameState.CREATED, creatorId: Not(req.user.id)},
        });
        res.json(games);
    }

    public static async getUserGames(req: Request, res: Response): Promise<void> {
        const userId = req.user.id;
        const games = await getManager().find(GameEntity, {where: [{creatorId: userId}, {oponentId: userId}]});
        res.json(games);
    }

    public static async getGame(req: Request, res: Response): Promise<void> {
        const manager = getManager();
        const game = await manager.findOne(GameEntity, req.params.gameId);
        res.json(game);
    }

    public static async getGameMoves(req: Request, res: Response): Promise<void> {
        const manager = getManager();
        const gameId = req.params.gameId;
        const gameService = new GameService(gameId, manager);
        const doesUserBelongToGame = await gameService.doesUserBelongToGame(req.user.id);

        if (!doesUserBelongToGame) {
            throw new ApiError({
                message: "Cannot get moves from game where you didn't belong",
                httpCode: HttpCode.FORBIDDEN,
            });
        }

        const moves = await manager.find(MoveEntity, {where: {gameId}, order: {createdAt: "ASC"}});
        res.json(moves);
    }
}
