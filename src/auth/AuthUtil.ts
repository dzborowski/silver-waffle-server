import {ApiError} from "../common/ApiError";
import {HttpCode} from "../common/HttpCode";
import {AuthConfig} from "./AuthConfig";

export class AuthUtil {
    public static getParsedToken(token: string): {type: string; credentials: string} {
        if (!token) {
            throw new ApiError({message: "Auth token is missing.", httpCode: HttpCode.BAD_REQUEST});
        }

        const [type, credentials] = token.split(" ");

        if (type !== AuthConfig.AUTHORIZATION_TYPE) {
            throw new ApiError({
                message: `Invalid token authorization type, ${AuthConfig.AUTHORIZATION_TYPE} is required.`,
                httpCode: HttpCode.BAD_REQUEST,
            });
        }

        return {type, credentials};
    }
}
