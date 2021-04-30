import {getManager} from "typeorm";
import {GameEntity} from "./GameEntity";
import {UserEntity} from "../auth/UserEntity";

export class GameFactory {
    public async crateGame(creatorId: string, gameSize: number): Promise<void> {
        const manager = getManager();
        const game = new GameEntity();

        game.size = gameSize;
        game.creator = await manager.findOneOrFail(UserEntity, {id: creatorId});
        await manager.save(game);
    }
}
