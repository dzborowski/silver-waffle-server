import {Router} from "express";
import * as asyncHandler from "express-async-handler";
import {GameHttpController} from "./GameHttpController";
import {AuthService} from "../../auth/AuthService";

export const GameHttpRouter = Router();

GameHttpRouter.route("/").get(asyncHandler(GameHttpController.getGames));

GameHttpRouter.route("/:gameId/moves").get(
    asyncHandler(AuthService.verifyAuth),
    asyncHandler(GameHttpController.getGameMoves)
);
