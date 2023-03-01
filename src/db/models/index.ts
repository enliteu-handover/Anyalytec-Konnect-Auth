"use strict";

const Sequelize = require("sequelize");
const config = require("./../config/config");

let sequelize: any = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export { Sequelize, sequelize };
