require("dotenv").config();

export class AppConfig {
    public static getAppPort(): number {
        return Number.parseInt(process.env.APP_PORT) || 3000;
    }

    public static getJwtSecret(): string {
        return process.env.JWT_SECRET || "JAuYsEfPoX0qSUcRXAQ7JhgP0QlIp25BbA30URabeBNygEs2E7i9w8wAYS88C3x";
    }

    public static getDatabaseHost(): string {
        return process.env.POSTGRES_HOST || "postgres";
    }

    public static getDatabasePort(): number {
        return Number.parseInt(process.env.POSTGRES_PORT) || 5432;
    }

    public static getDatabaseUser(): string {
        return process.env.POSTGRES_USER || "postgres";
    }

    public static getDatabasePassword(): string {
        return process.env.POSTGRES_PASSWORD || "postgres";
    }

    public static getDatabaseName(): string {
        return process.env.POSTGRES_DB || "silver_waffle_db";
    }

    public static isDevelopment(): boolean {
        return process.env.NODE_ENV === "development";
    }
}
