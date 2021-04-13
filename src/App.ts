import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import ormConfig from "./OrmConfig";
import {AuthRouter} from "./auth/AuthRouter";
import {ErrorHandler} from "./common/ErrorHandler";
import {AppConfig} from "./AppConfig";

require("dotenv").config();

createConnection(ormConfig)
    .then(() => {
      const app = express();

      app.use(cors());
      app.use(helmet());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({extended: false}));

      app.use("/api/auth", AuthRouter);

      app.use(ErrorHandler.handleError);

      const appPort = AppConfig.getAppPort();

      app.listen(appPort, () => {
        console.log(`App listening at http://localhost:${appPort}`);
      });
    })
    .catch((err) => console.error(`Database connection error: ${err}`));
