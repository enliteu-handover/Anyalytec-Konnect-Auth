"use strict";
/** @type {import('sequelize-cli').Migration} */
let { DB_SCHEMA } = process.env;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { schema: DB_SCHEMA ?? "public", tableName: "users" },
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        username: {
          type: Sequelize.STRING,
        },
        email_id: {
          type: Sequelize.STRING,
        },
        mobile_no_std_code: {
          type: Sequelize.INTEGER,
        },
        mobile_no: {
          type: Sequelize.BIGINT,
        },
        password: {
          type: Sequelize.STRING,
        },
        is_active: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        is_deleted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn("now"),
        },
      }
    );
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable("users");
  },
};
