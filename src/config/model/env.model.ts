import { IsEnum, IsIn, IsNumber, IsPositive, IsString } from 'class-validator';

enum Environment {
  Development = 'development',
  Test = 'test',
  Staging = 'staging',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  @IsIn(Object.values(Environment))
  NODE_ENV = Environment.Development;

  @IsNumber()
  @IsPositive()
  PORT: number;

  @IsString()
  MONGO_URI: string;

  @IsNumber()
  RATE_LIMIT: number;

  @IsString()
  GLOBAL_PREFIX: string;

  @IsString()
  API_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRY: string;

  @IsString()
  MAIL_FROM: string;

  @IsString()
  MAIL_PASSWORD: string;

  @IsString()
  LINKEDIN_CLIENT_ID: string;

  @IsString()
  LINKEDIN_CLIENT_SECRET: string;

  @IsString()
  LINKEDIN_CALLBACK_URL: string;
}