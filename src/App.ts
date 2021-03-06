import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import {Express} from "express";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";
import {Server, Socket} from "socket.io";
import ormConfig from "./OrmConfig";
import {AuthRouter} from "./auth/AuthRouter";
import {HttpErrorHandler} from "./common/HttpErrorHandler";
import {AppConfig} from "./AppConfig";
import {GameSocketRouter} from "./game/socket/GameSocketRouter";
import {GameHttpRouter} from "./game/http/GameHttpRouter";
import {AuthMiddleware} from "./auth/AuthMiddleware";
import {GameSocketConfig} from "./game/socket/GameSocketConfig";
import {Logger} from "./common/Logger";

require("dotenv").config();

class App {
    public static async init() {
        try {
            await App.initDataBaseConnection();
            const [httpServer, app] = await App.initHttpServer();
            const io = await App.initWebsocketServer(httpServer);

            app.set("socket.io", io);
        } catch (error) {
            Logger.log(`error: ${error}`);
        }
    }

    protected static async initDataBaseConnection() {
        await createConnection(ormConfig);
    }

    protected static async initHttpServer(): Promise<[http.Server, Express]> {
        const app = express();
        const server = http.createServer(app);

        app.use(cors({origin: AppConfig.getClientUrl()}));
        app.use(helmet());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));

        app.use("/api/auth", AuthRouter);
        app.use("/api/game", GameHttpRouter);

        app.use(HttpErrorHandler.handleError);

        const appPort = AppConfig.getAppPort();

        server.listen(appPort, () => {
            Logger.log(`Http server listening at http://localhost:${appPort}`);
        });

        return [server, app];
    }

    protected static async initWebsocketServer(server): Promise<Server> {
        const io = new Server(server, {
            cors: {origin: AppConfig.getClientUrl()},
        });

        io.use(AuthMiddleware.socketVerifyAuth);

        io.on("connection", (socket: Socket) => {
            Logger.log(`connected: ${socket.id}`);
            socket.join(GameSocketConfig.GENERAL_ROOM);
            GameSocketRouter.registerEvents(io, socket);
        });

        return io;
    }
}

App.init();
