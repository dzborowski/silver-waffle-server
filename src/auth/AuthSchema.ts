import * as Joi from "joi";

export class AuthSchema {
    public static registerUserBody = Joi.object().keys({
      firstName: Joi.string()
          .alphanum()
          .min(2)
          .max(30)
          .required(),
      lastName: Joi.string()
          .alphanum()
          .min(2)
          .max(30)
          .required(),
      email: Joi.string()
          .email()
          .required(),
      password: Joi.string()
          .min(6)
          .max(30)
          .required(),
    });

    public static loginUserBody = Joi.object().keys({
      email: Joi.string()
          .email()
          .required(),
      password: Joi.string()
          .min(6)
          .max(30)
          .required(),
    });

    public static getUserParams = Joi.object().keys({
      userId: Joi.string().uuid().required(),
    });

    public static refreshUserBody = Joi.object().keys({
      refreshToken: Joi.string()
          .required(),
    });
}
