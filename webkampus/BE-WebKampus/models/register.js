const { DataTypes } = require('sequelize');
const sequelize = require('../dbConfig');

const CreateRegisterModel = (identifier, tableName) => {
  const model = sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    [identifier]: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
    },
    telepon : {
      type: DataTypes.STRING,
    },
    fakultas: {
      type: DataTypes.STRING,
    },
    prodi: {
      type: DataTypes.STRING,
    },
    fotoURL: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: tableName,
    timestamps: true,
  });

  model.sync({ alter: true })
    .then(() => {
      console.log(`Table ${tableName} has been created or updated successfully.`);
    })
    .catch((error) => {
      console.error(`Error creating or updating table ${tableName}:`, error);
    });

  return model;
}

module.exports = CreateRegisterModel;