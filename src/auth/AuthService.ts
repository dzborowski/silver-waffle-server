import {getRepository} from "typeorm";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import {UserEntity} from "./UserEntity";
import {IAuthLoginTokens} from "./IAuthLoginTokens";
import {AuthTokenType} from "./AuthTokenType";
import {IAuthTokenPayload} from "./IAuthTokenPayload";
import {ApiError} from "../common/ApiError";
import {HttpCode} from "../common/HttpCode";
import {AppConfig} from "../AppConfig";
import {AuthConfig} from "./AuthConfig";
import {AuthUtil} from "./AuthUtil";

export class AuthService {
    public async register(userData: any): Promise<UserEntity> {
        const userRepository = getRepository(UserEntity);
        const isUserAlreadyExist = await userRepository.findOne({email: userData.email});

        if (isUserAlreadyExist) {
            throw new ApiError({message: "User with provided email already exits.", httpCode: HttpCode.BAD_REQUEST});
        }

        const hashedPassword = await bcrypt.hash(userData.password, AuthConfig.USER_PASSWORD_SALT_ROUNDS);

        return userRepository.save({...userData, password: hashedPassword});
    }

    public async login(email: string, password: string): Promise<IAuthLoginTokens> {
        const userRepository = getRepository(UserEntity);
        const user = await userRepository.findOne({email});

        if (!user) {
            throw new ApiError({message: "User with provided email didn't exits.", httpCode: HttpCode.BAD_REQUEST});
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            throw new ApiError({message: "Password didn't match.", httpCode: HttpCode.BAD_REQUEST});
        }

        return this.generateLoginTokens(user);
    }

    public async refreshAccessToken(refreshToken: string): Promise<IAuthLoginTokens> {
        const parsedRefreshToken = AuthUtil.getParsedToken(refreshToken);
        const payload = jwt.verify(parsedRefreshToken.credentials, AppConfig.getJwtSecret()) as IAuthTokenPayload;
        const userRepository = getRepository(UserEntity);
        const user = await userRepository.findOne({id: payload.userId});

        if (!user) {
            throw new ApiError({message: "User didn't exits.", httpCode: HttpCode.NOT_FOUND});
        }

        return this.generateLoginTokens(user);
    }

    protected async generateLoginTokens(user: UserEntity): Promise<IAuthLoginTokens> {
        const userId = user.id;
        const jwtSecret = AppConfig.getJwtSecret();

        const accessTokenPayload: IAuthTokenPayload = {
            userId,
            type: AuthTokenType.ACCESS,
        };
        const accessToken = jwt.sign(accessTokenPayload, jwtSecret);

        const refreshTokenPayload: IAuthTokenPayload = {
            userId,
            type: AuthTokenType.REFRESH,
        };
        const refreshToken = jwt.sign(refreshTokenPayload, jwtSecret);

        return {
            accessToken: `${AuthConfig.AUTHORIZATION_TYPE} ${accessToken}`,
            refreshToken: `${AuthConfig.AUTHORIZATION_TYPE} ${refreshToken}`,
        };
    }
}
