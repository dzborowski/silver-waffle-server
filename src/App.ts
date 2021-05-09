import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";
import {Server, Socket} from "socket.io";
import ormConfig from "./OrmConfig";
import {AuthRouter} from "./auth/AuthRouter";
import {ErrorHandler} from "./common/ErrorHandler";
import {AppConfig} from "./AppConfig";
import {GameSocketRouter} from "./game/socket/GameSocketRouter";
import {GameHttpRouter} from "./game/http/GameHttpRouter";

require("dotenv").config();

class App {
    public static async init() {
        try {
            await App.initDataBaseConnection();
            const httpServer = await App.initHttpServer();
            await App.initWebsocketServer(httpServer);
        } catch (error) {
            console.log("error:", error);
        }
    }

    protected static async initDataBaseConnection() {
        await createConnection(ormConfig);
    }

    protected static async initHttpServer(): Promise<http.Server> {
        const app = express();
        const server = http.createServer(app);

        app.use(cors({origin: AppConfig.getClientUrl()}));
        app.use(helmet());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));

        app.use("/api/auth", AuthRouter);
        app.use("/api/game", GameHttpRouter);

        app.use(ErrorHandler.handleError);

        const appPort = AppConfig.getAppPort();

        server.listen(appPort, () => {
            console.log(`Http server listening at http://localhost:${appPort}`);
        });

        return server;
    }

    protected static async initWebsocketServer(server) {
        const io = new Server(server, {
            cors: {origin: AppConfig.getClientUrl()},
        });

        io.on("connection", (socket: Socket) => {
            console.log("connected: ", socket.id);
            GameSocketRouter.register(io, socket);
        });
    }
}

App.init();
