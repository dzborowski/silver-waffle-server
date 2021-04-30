import {ApiError} from "../common/ApiError";
import {HttpCode} from "../common/HttpCode";
import {GameService} from "./GameService";
import {getManager} from "typeorm";
import {GameEntity} from "./GameEntity";
import {MoveEntity} from "./MoveEntity";
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

        move.user = await manager.findOneOrFail(UserEntity, this.userId);
        move.position = this.movePosition;
        await manager.save(move);
    }

    protected async canMakeMove(): Promise<boolean> {
        const gameService = new GameService(this.gameId);
        const isGameAlreadyFinished = await gameService.isGameAlreadyFinished();
        const isUserBelongsToGame = await gameService.isUserBelongsToGame(this.userId);
        const isUserTurn = await this.isUserTurn();
        const isMoveMadeToCorrectPlace = await this.isMoveMadeToCorrectPlace();

        return !isGameAlreadyFinished && isUserBelongsToGame && isUserTurn && isMoveMadeToCorrectPlace;
    }

    protected async isUserTurn(): Promise<boolean> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);
        return true; // todo
    }

    protected async isMoveMadeToCorrectPlace(): Promise<boolean> {
        const game = await getManager().findOneOrFail(GameEntity, this.gameId);

        return this.movePosition >= 0 && this.movePosition < game.size ** 2;
    }
}
