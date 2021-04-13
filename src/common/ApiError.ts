import {HttpCode} from "./HttpCode";

interface IApiErrorData {
    message:string;
    httpCode: HttpCode
}

export class ApiError extends Error {
    public errorData: IApiErrorData;

    constructor(errorData:IApiErrorData) {
      super(errorData.message);

      this.errorData = errorData;
    }
}
