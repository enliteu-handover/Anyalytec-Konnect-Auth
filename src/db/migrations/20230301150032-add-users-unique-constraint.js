"use strict";

/** @type {import('sequelize-cli').Migration} */
let { DB_SCHEMA } = process.env;
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.addConstraint(
      { schema: DB_SCHEMA ?? "public", tableName: "users" },
      {
        fields: ["username", "email_id", "mobile_no"],
        type: "unique",
        name: "custom_unique_users",
      }
    );
  },

  async down(_queryInterface, _Sequelize) {
    return Promise.resolve(true);
  },
};
