import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  MONGO_URI: string;
  JWT_SEED: string;
}

const envsScheme = joi
  .object({
    PORT: joi.number().required(),
    MONGO_URI: joi.string().required(),
    JWT_SEED: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsScheme.validate({ ...process.env });

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  MONGO_URI: envVars.MONGO_URI,
  JWT_SEED: envVars.JWT_SEED,
};
