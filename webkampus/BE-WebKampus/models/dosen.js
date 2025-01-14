'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Dosen.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    NIDN: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.TEXT,
    telepon: DataTypes.STRING,
    fakultas: DataTypes.STRING,
    prodi: DataTypes.STRING,
    fotoURL: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Dosen',
  });
  return Dosen;
};