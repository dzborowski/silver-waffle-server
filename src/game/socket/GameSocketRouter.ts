import {Server, Socket} from "socket.io";
import {GameFactory} from "../core/GameFactory";
import {GameService} from "../core/GameService";

export class GameSocketRouter {
    public static register(server: Server, socket: Socket) {
        socket.on("create-game", async (gameSize: number) => {
            await GameFactory.crateGame(socket.data.user.id, gameSize);
            socket.broadcast.emit("new-game-created");
        });

        socket.on("join-to-game", async (gameId: string) => {
            const gameService = new GameService(gameId);
            await gameService.joinGame(socket.data.user.id);
        });

        socket.on("move", async () => {});
    }
}
