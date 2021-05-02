import {GameService} from "./GameService";
import {getManager} from "typeorm";
import {GameEntity} from "./data/GameEntity";
import {MoveEntity} from "./data/MoveEntity";
import {GameStateCalculator} from "./GameStateCalculator";
import {HttpCode} from "../common/HttpCode";
import {ApiError} from "../common/ApiError";
import {UserEntity} from "../auth/UserEntity";

export class GameMoveService {
    protected gameId: string;
    protected userId: string;
    protected movePosition: number;

    public constructor(gameId: string, userId: string, movePosition: number) {
        this.gameId = gameId;
        this.userId = userId;
        this.movePosition = movePosition;
    }

    public async move(): Promise<void> {
        const canMakeMove = await this.canMakeMove();

        if (!canMakeMove) {
            throw new ApiError({message: "Cannot make move", httpCode: HttpCode.BAD_REQUEST});
        }

        const manager = getManager();
        const move = new MoveEntity();

        move.game = await manager.findOneOrFail(GameEntity, this.gameId);
        move.user = await manager.findOneOrFail(UserEntity, this.userId);
        move.position = this.movePosition;
        await manager.save(move);

        const gameStateCalculator = new GameStateCalculator(this.gameId);
        await gameStateCalculator.recalculateGameState();
    }

    protected async canMakeMove(): Promise<boolean> {
        const gameService = new GameService(this.gameId);
        const isGameAlreadyFinished = await gameService.isGameAlreadyFinished();
        const isUserBelongsToGame = await gameService.isUserBelongsToGame(this.userId);
        const isUserTurn = await this.isUserTurn();
        const isMoveMadeToCorrectPlace = await this.isMoveMadeToCorrectPlace();
        const isPositionToWhichMoveWillBeMadeIsFree = await this.isPositionToWhichMoveWillBeMadeIsFree();

        return (
            !isGameAlreadyFinished &&
            isUserBelongsToGame &&
            isUserTurn &&
            isMoveMadeToCorrectPlace &&
            isPositionToWhichMoveWillBeMadeIsFree
        );
    }

    protected async isUserTurn(): Promise<boolean> {
        const gameService = new GameService(this.gameId);
        const lastMove = await gameService.getLastMove();

        if (lastMove) {
            return lastMove.user.id !== this.userId;
        }

        const startingPlayer = await gameService.getStartingPlayer();

        return startingPlayer.id === this.userId;
    }

    protected async isMoveMadeToCorrectPlace(): Promise<boolean> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);

        return this.movePosition >= 0 && this.movePosition < game.size ** 2;
    }

    protected async isPositionToWhichMoveWillBeMadeIsFree(): Promise<boolean> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId, {relations: ["moves"]});

        return !game.moves.find((move: MoveEntity) => move.position === this.movePosition);
    }
}
