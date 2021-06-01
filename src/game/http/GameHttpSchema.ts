import * as Joi from "joi";

export class GameHttpSchema {
    public static joinToGameParams = Joi.object().keys({
        gameId: Joi.string().uuid().required(),
    });

    public static getGameParams = Joi.object().keys({
        gameId: Joi.string().uuid().required(),
    });

    public static getGameMovesParams = Joi.object().keys({
        gameId: Joi.string().uuid().required(),
    });
}
