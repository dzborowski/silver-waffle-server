declare namespace Express {
    export interface Request {
        user: null | import("../src/auth/UserEntity").UserEntity
    }
}
