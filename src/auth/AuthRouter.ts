import {Router} from "express";
import {celebrate} from "celebrate";
import * as asyncHandler from "express-async-handler";
import {AuthSchema} from "./AuthSchema";
import {AuthController} from "./AuthController";
import {AuthService} from "./AuthService";

export const AuthRouter = Router();

AuthRouter
    .route("/register")
    .post(celebrate({
      body: AuthSchema.registerUserBody,
    }), asyncHandler(AuthController.register));

AuthRouter
    .route("/login")
    .post(celebrate({
      body: AuthSchema.loginUserBody,
    }), asyncHandler(AuthController.login));

AuthRouter
    .route("/refresh")
    .post(celebrate({
      body: AuthSchema.refreshUserBody,
    }), asyncHandler(AuthController.refresh));

AuthRouter
    .route("/logged-user")
    .get(asyncHandler(AuthService.verifyAuth), asyncHandler(AuthController.getLoggedUser));
