import {Router} from "express";
import * as asyncHandler from "express-async-handler";
import {GameHttpController} from "./GameHttpController";
import {AuthMiddleware} from "../../auth/AuthMiddleware";

export const GameHttpRouter = Router();

GameHttpRouter.route("/")
    .get(asyncHandler(GameHttpController.getGames))
    .post(asyncHandler(AuthMiddleware.httpVerifyAuth), asyncHandler(GameHttpController.createGame));

GameHttpRouter.route("/:gameId/join-to-game").post(
    asyncHandler(AuthMiddleware.httpVerifyAuth),
    asyncHandler(GameHttpController.joinToGame)
);

GameHttpRouter.route("/:gameId/moves").get(
    asyncHandler(AuthMiddleware.httpVerifyAuth),
    asyncHandler(GameHttpController.getGameMoves)
);
