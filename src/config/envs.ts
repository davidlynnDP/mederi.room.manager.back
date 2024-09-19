import 'dotenv/config';

import * as Joi from 'joi';

interface EnvVars {
  PORT: number;

  JWT_CONSTANT_SECRET: string;

  DATABASE_URL: string;

  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_ROOT_PASSWORD: string;
  MYSQL_DATABASE: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
}


const envsSchema = Joi.object({
  PORT: Joi.number().required(),

  JWT_CONSTANT_SECRET: Joi.string().required(),

  DATABASE_URL: Joi.string().required(),

  MYSQL_HOST: Joi.string().required(),
  MYSQL_PORT: Joi.number().required(),
  MYSQL_ROOT_PASSWORD: Joi.string().required(),
  MYSQL_DATABASE: Joi.string().required(),
  MYSQL_USER: Joi.string().required(),
  MYSQL_PASSWORD: Joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate({ 
  ...process.env,
});

if ( error ) {
  throw new Error(`Config validation error: ${ error.message }`);
}


const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,

  jwtConstantSecret: envVars.JWT_CONSTANT_SECRET,

  databaseUrl: envVars.DATABASE_URL,

  mysqlHost: envVars.MYSQL_HOST,
  mysqlPort: envVars.MYSQL_PORT,
  mysqlRootPassword: envVars.MYSQL_ROOT_PASSWORD,
  mysqlDatabase: envVars.MYSQL_DATABASE,
  mysqlUser: envVars.MYSQL_USER,
  mysqlPassword: envVars.MYSQL_PASSWORD,
};