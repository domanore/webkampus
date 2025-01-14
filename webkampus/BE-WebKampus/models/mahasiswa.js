'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mahasiswa.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    NIM: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.TEXT,
    telepon: DataTypes.STRING,
    fakultas: DataTypes.STRING,
    prodi: DataTypes.STRING,
    fotoURL: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Mahasiswa',
  });
  return Mahasiswa;
};