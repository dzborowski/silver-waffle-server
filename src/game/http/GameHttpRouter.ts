import {Router} from "express";
import {celebrate} from "celebrate";
import * as asyncHandler from "express-async-handler";
import {GameHttpController} from "./GameHttpController";
import {AuthMiddleware} from "../../auth/AuthMiddleware";
import {GameHttpSchema} from "./GameHttpSchema";

export const GameHttpRouter = Router();

GameHttpRouter.route("/")
    .get(asyncHandler(AuthMiddleware.httpVerifyAuth), asyncHandler(GameHttpController.getUserGames))
    .post(asyncHandler(AuthMiddleware.httpVerifyAuth), asyncHandler(GameHttpController.createGame));

GameHttpRouter.route("/available-games").get(
    asyncHandler(AuthMiddleware.httpVerifyAuth),
    asyncHandler(GameHttpController.getAvailableGames)
);

GameHttpRouter.route("/:gameId/join-to-game").post(
    celebrate({
        params: GameHttpSchema.joinToGameParams,
    }),
    asyncHandler(AuthMiddleware.httpVerifyAuth),
    asyncHandler(GameHttpController.joinToGame)
);

GameHttpRouter.route("/:gameId").get(
    celebrate({
        params: GameHttpSchema.getGameParams,
    }),
    asyncHandler(AuthMiddleware.httpVerifyAuth),
    asyncHandler(GameHttpController.getGame)
);

GameHttpRouter.route("/:gameId/moves").get(
    celebrate({
        params: GameHttpSchema.getGameMovesParams,
    }),
    asyncHandler(AuthMiddleware.httpVerifyAuth),
    asyncHandler(GameHttpController.getGameMoves)
);
