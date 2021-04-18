import {getRepository} from "typeorm";
import {UserEntity} from "../auth/UserEntity";
import {ApiError} from "../common/ApiError";
import {HttpCode} from "../common/HttpCode";
import {GameEntity} from "./GameEntity";

export class GameService {
  public async crateGame(creatorId: string, gameSize: number) {
    const userRepository = getRepository(UserEntity);
    const creator = await userRepository.findOne({id: creatorId});

    if (!creator) {
      throw new ApiError({message: "User didn't exist", httpCode: HttpCode.NOT_FOUND});
    }

    const gameRepository = getRepository(GameEntity);
    await gameRepository.save({creator, size: gameSize});
  }

  public async joinGame(gameId: string, oponentId: string) {
    const userRepository = getRepository(UserEntity);
    const oponent = await userRepository.findOne({id: oponentId});

    if (!oponent) {
      throw new ApiError({message: "User didn't exist", httpCode: HttpCode.NOT_FOUND});
    }

    const gameRepository = getRepository(GameEntity);
    const game = await gameRepository.findOne({id: gameId});

    if (!game) {
      throw new ApiError({message: "Game didn't exist", httpCode: HttpCode.NOT_FOUND});
    }

    if (await this.isGameFinished(gameId)) {
      throw new ApiError({message: "Cannot join to finished game", httpCode: HttpCode.BAD_REQUEST});
    }

    if (game.creator && game.creator.id !== oponentId) {
      throw new ApiError({
        message: "Cannot join to game which have already all players",
        httpCode: HttpCode.BAD_REQUEST,
      });
    }

    await gameRepository.update({id: gameId}, {oponent});
  }

  public async isGameFinished(gameId:string):Promise<boolean> {
    return false; // todo
  }
}
