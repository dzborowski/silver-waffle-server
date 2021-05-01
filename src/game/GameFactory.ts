import {getManager} from "typeorm";
import {GameEntity} from "./data/GameEntity";
import {UserEntity} from "../auth/UserEntity";

export class GameFactory {
    public static async crateGame(creatorId: string, gameSize: number): Promise<void> {
        const manager = getManager();
        const game = new GameEntity();

        game.size = gameSize;
        game.creator = await manager.findOneOrFail(UserEntity, creatorId);
        await manager.save(game);
    }
}
