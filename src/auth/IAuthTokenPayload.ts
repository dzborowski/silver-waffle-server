import {AuthTokenType} from "./AuthTokenType";

export interface IAuthTokenPayload {
    userId:string;
    type: AuthTokenType;
}
