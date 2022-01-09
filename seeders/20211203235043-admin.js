"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("users", [
      {
        fullname: "Akhmad Syaifudin",
        email: "admin@mail.com",
        password:
          "$2a$10$w5fzoPf1lPHQDFhHvmAJ4OTZPKdp0BbTqQvMoHBaUJ//YigUYlpre",
        phone: "0895377004051",
        address: "jl. KH Abu Su'ud",
        picture: "profile.jpg",
        status: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
