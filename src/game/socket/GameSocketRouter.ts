import {Server, Socket} from "socket.io";
import {GameMoveService} from "../core/GameMoveService";

export class GameSocketRouter {
    public static registerEvents(server: Server, socket: Socket) {
        socket.on("join-to-game", (gameId: string) => {
            socket.join(gameId);
            socket.to(gameId).emit("player-joined-to-game");
        });

        socket.on("leave-game", (gameId: string) => {
            socket.leave(gameId);
            socket.to(gameId).emit("player-leave-game");
        });

        socket.on("move", async ({gameId, movePosition}) => {
            const gameMoveService = new GameMoveService(gameId, socket.data.user.id, movePosition);
            await gameMoveService.move();
            socket.to(gameId).emit("move-was-made");
        });
    }
}
