"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _Sequelize) {
    await queryInterface.addConstraint("users", {
      fields: ["username", "email_id", "mobile_no"],
      type: "unique",
      name: "custom_unique_users",
    });
  },

  async down(_queryInterface, _Sequelize) {
    return Promise.resolve(true);
  },
};
