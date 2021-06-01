import {Server, Socket} from "socket.io";
import {GameMoveService} from "../core/GameMoveService";
import {EntityManager, getManager} from "typeorm";
import {IsolationLevel} from "../../common/IsolationLevel";

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
            try {
                await getManager().transaction(IsolationLevel.SERIALIZABLE, async (manager: EntityManager) => {
                    const gameMoveService = new GameMoveService(gameId, socket.data.user.id, movePosition, manager);
                    await gameMoveService.move();
                });

                server.to(gameId).emit("move-was-made");
            } catch (error) {
                server.to(socket.id).emit("custom-error", {errorMessage: error?.message ?? error});
            }
        });
    }
}
