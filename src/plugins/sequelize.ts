import { FastifyPluginCallback } from "fastify";
import { Dialect, Sequelize } from "sequelize";
import fp from "fastify-plugin";
import { AutoOptions, SequelizeAuto } from "sequelize-auto";
import { initModels } from "../db/models/init-models";

const config = require("./../db/config/config");

interface SequelizeOptions {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: Dialect;
  port: number;
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

  const autoOptions: AutoOptions = {
    ...dbConfig,
    directory: "./src/db/models",
    additional: {
      timestamps: false,
    },
    schema: "public",
    caseModel: "c",
    skipTables: ["SequelizeMeta"],
    singularize: true,
    useDefine: false,
    lang: "ts",
  };
  const auto = new SequelizeAuto(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    autoOptions
  );
  await auto.run();

  initModels(sequelize);
  fastify.decorate("sequelize", sequelize);
};

export default fp(sequelizePlugin);
