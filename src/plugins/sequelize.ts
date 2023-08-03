import { FastifyPluginCallback } from "fastify";
import { Dialect, Sequelize } from "sequelize";
import fp from "fastify-plugin";
import { initModels } from "../db/models/init-models";

const config = require("./../db/config/config");

export interface SequelizeOptions {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: Dialect;
  port: number;
  schema: string | "public";
}

declare module "fastify" {
  interface FastifyInstance {
    sequelize: Sequelize;
  }
}

const sequelizePlugin: FastifyPluginCallback<SequelizeOptions> = async (
  fastify: any,
  _
) => {
  let dbConfig: SequelizeOptions = config;

  const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      logging: false,
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      port: dbConfig.port,
    }
  );
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });

  initModels(sequelize);
  fastify.decorate("sequelize", sequelize);
};

export default fp(sequelizePlugin);
