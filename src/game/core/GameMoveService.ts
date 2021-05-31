import {GameService} from "./GameService";
import {EntityManager} from "typeorm";
import {GameEntity} from "./data/GameEntity";
import {MoveEntity} from "./data/MoveEntity";
import {GameStateCalculator} from "./GameStateCalculator";
import {HttpCode} from "../../common/HttpCode";
import {ApiError} from "../../common/ApiError";
import {UserEntity} from "../../auth/UserEntity";

export class GameMoveService {
    protected gameId: string;
    protected userId: string;
    protected movePosition: number;
    protected manager: EntityManager;

    public constructor(gameId: string, userId: string, movePosition: number, manager: EntityManager) {
        this.gameId = gameId;
        this.userId = userId;
        this.movePosition = movePosition;
        this.manager = manager;
    }

    public async move(): Promise<void> {
        const canMakeMove = await this.canMakeMove();

        if (!canMakeMove) {
            throw new ApiError({message: "Cannot make move", httpCode: HttpCode.BAD_REQUEST});
        }

        const move = new MoveEntity();

        move.game = await this.manager.findOneOrFail(GameEntity, this.gameId);
        move.user = await this.manager.findOneOrFail(UserEntity, this.userId);
        move.position = this.movePosition;
        await this.manager.save(move);

        const gameStateCalculator = new GameStateCalculator(this.gameId, this.manager);
        await gameStateCalculator.recalculateGameState();
    }

    protected async canMakeMove(): Promise<boolean> {
        const gameService = new GameService(this.gameId, this.manager);
        const gameWasStarted = await gameService.gameWasStarted();
        const gameWasFinished = await gameService.gameWasFinished();
        const doesUserBelongToGame = await gameService.doesUserBelongToGame(this.userId);
        const isUserTurn = await this.isUserTurn();
        const isMoveMadeToCorrectPlace = await this.isMoveMadeToCorrectPlace();
        const isPositionToWhichMoveWillBeMadeIsFree = await this.isPositionToWhichMoveWillBeMadeIsFree();

        return (
            gameWasStarted &&
            !gameWasFinished &&
            doesUserBelongToGame &&
            isUserTurn &&
            isMoveMadeToCorrectPlace &&
            isPositionToWhichMoveWillBeMadeIsFree
        );
    }

    protected async isUserTurn(): Promise<boolean> {
        const gameService = new GameService(this.gameId, this.manager);
        const lastMove = await gameService.getLastMove();

        if (lastMove) {
            return lastMove.userId !== this.userId;
        }

        const startingPlayer = await gameService.getStartingPlayer();

        return startingPlayer?.id === this.userId;
    }

    protected async isMoveMadeToCorrectPlace(): Promise<boolean> {
        const game = await this.manager.findOneOrFail(GameEntity, this.gameId);

        return this.movePosition >= 0 && this.movePosition < game.size ** 2;
    }

    protected async isPositionToWhichMoveWillBeMadeIsFree(): Promise<boolean> {
        const move = await this.manager.findOne(MoveEntity, {
            where: {gameId: this.gameId, position: this.movePosition},
        });
        return !move;
    }
}
