"use strict";
/** @type {import('sequelize-cli').Migration} */
let { DB_SCHEMA } = process.env;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { schema: DB_SCHEMA ?? "public", tableName: "logged_in_records" },
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        logger_details: {
          type: Sequelize.JSON,
        },
        logged_at: {
          type: Sequelize.DATE,
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("now"),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn("now"),
        },
      }
    );
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable("logged_in_records");
  },
};
