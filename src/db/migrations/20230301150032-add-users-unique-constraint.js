"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("users", {
      fields: ["username", "email_id", "mobile_no"],
      type: "unique",
      name: "custom_unique_users",
    });
  },

  async down(queryInterface, Sequelize) {
    return Promise.resolve(true);
  },
};
