import {ApiError} from "../common/ApiError";
import {HttpCode} from "../common/HttpCode";
import {GameService} from "./GameService";
import {getRepository} from "typeorm";
import {GameEntity} from "./GameEntity";

export class GameMoveService {
    protected gameId: string;
    protected userId: string;
    protected x: number;

    public constructor(gameId: string, userId: string, x: number) {
        this.gameId = gameId;
        this.userId = userId;
        this.x = x;
    }

    public async move(): Promise<void> {
        const canMakeMove = await this.canMakeMove();

        if (!canMakeMove) {
            throw new ApiError({message: "Cannot make move", httpCode: HttpCode.BAD_REQUEST});
        }
    }

    protected async canMakeMove(): Promise<boolean> {
        const isGameAlreadyFinished = await new GameService().isGameAlreadyFinished(this.gameId);
        const isUserTurn = await this.isUserTurn();
        const isMoveMadeToCorrectPlace = await this.isMoveMadeToCorrectPlace();

        return !isGameAlreadyFinished && isUserTurn && isMoveMadeToCorrectPlace;
    }

    protected async isUserTurn(): Promise<boolean> {
        return true; // todo
    }

    protected async isMoveMadeToCorrectPlace(): Promise<boolean> {
        const gameRepository = getRepository(GameEntity);
        const game = await gameRepository.findOne({id: this.gameId});

        return this.x >= 0 && this.x < game.size ** 2;
    }
}
