'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nim: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },
      nidn: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
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
      role: {
        type: Sequelize.ENUM('mahasiswa', 'dosen'),
        allowNull: false
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
    await queryInterface.dropTable('user');
  }
};