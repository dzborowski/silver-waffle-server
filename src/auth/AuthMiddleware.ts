import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import {AppConfig} from "../AppConfig";
import {IAuthTokenPayload} from "./IAuthTokenPayload";
import {getManager} from "typeorm";
import {UserEntity} from "./UserEntity";
import {AuthUtil} from "./AuthUtil";
import {Socket} from "socket.io";

export class AuthMiddleware {
    public static async httpVerifyAuth(req: Request, res: Response, next: NextFunction) {
        const accessToken = req.headers.authorization;
        req.user = await AuthMiddleware.verifyAuth(accessToken);
        next();
    }

    public static async socketVerifyAuth(socket: Socket, next: Function) {
        const accessToken = socket.handshake.auth.token;

        try {
            socket.data.user = await AuthMiddleware.verifyAuth(accessToken);
            next();
        } catch (error) {
            next(error);
        }
    }

    protected static async verifyAuth(accessToken: string): Promise<UserEntity> {
        const parsedAccessToken = AuthUtil.getParsedToken(accessToken);
        const payload = jwt.verify(parsedAccessToken.credentials, AppConfig.getJwtSecret()) as IAuthTokenPayload;
        return getManager().findOneOrFail(UserEntity, {id: payload.userId});
    }
}
