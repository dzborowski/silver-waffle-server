import {Server, Socket} from "socket.io";
import {GameFactory} from "./GameFactory";

export class GameSocketRouter {
    public static register(server: Server, socket: Socket) {
        socket.on("create-game", async () => {
            await GameFactory.crateGame("", 3);
            socket.broadcast.emit("new-game-created");
        });

        socket.on("join-to-game", () => {});

        socket.on("move", () => {});
    }
}
