"use strict";

const { DataTypes } = require("sequelize");

module.exports = function(sequelize) {
  return sequelize.define("collection_topics", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
    freezeTableName: true
  });
};
