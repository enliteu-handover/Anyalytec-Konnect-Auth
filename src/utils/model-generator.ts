import { AutoOptions, SequelizeAuto } from "sequelize-auto";
import { SequelizeOptions } from "./../plugins/sequelize";

const config: SequelizeOptions = require("./../db/config/config");

const autoOptions: AutoOptions = {
  ...config,
  directory: "./src/db/models",
  additional: {
    timestamps: false,
  },
  schema: "public",
  caseModel: "p",
  skipTables: ["SequelizeMeta"],
  singularize: true,
  useDefine: false,
  lang: "ts",
};

const auto = new SequelizeAuto(
  config.database,
  config.username,
  config.password,
  autoOptions
);

auto
  .run()
  .then((_) => {
    console.log(`Model Generation Completed!`);
  })
  .catch((err: any) => console.log(err));
