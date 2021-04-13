import {Request, Response} from "express";
import {AuthService} from "./AuthService";
import {HttpCode} from "../common/HttpCode";

export class AuthController {
    public static register = async (req: Request, res: Response) => {
      const authService = new AuthService();
      const user = await authService.register(req.body);

      delete user.password;
      res.status(HttpCode.CREATED_SUCCESS).json(user);
    }

    public static login = async (req: Request, res: Response) => {
      const authService = new AuthService();
      const authTokens = await authService.login(req.body.email, req.body.password);

      res.json(authTokens);
    }

    public static refresh = async (req: Request, res: Response) => {
      const refreshToken = req.body.refreshToken;
      const authService = new AuthService();
      const authTokens = await authService.refreshAccessToken(refreshToken);

      res.json(authTokens);
    }

    public static getLoggedUser = async (req: Request, res: Response) => {
      const user = req.user;
      delete req.user.password;

      res.json(user);
    }
}
