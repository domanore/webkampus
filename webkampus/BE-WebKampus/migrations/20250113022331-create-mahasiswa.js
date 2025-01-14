'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Mahasiswas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      NIM: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.TEXT
      },
      telepon: {
        type: Sequelize.STRING
      },
      fakultas: {
        type: Sequelize.STRING
      },
      prodi: {
        type: Sequelize.STRING
      },
      fotoURL: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Mahasiswas');
  }
};