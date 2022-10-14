/* eslint-disable camelcase */
"use strict";

const { DataTypes } = require("sequelize");

module.exports = function(sequelize) {
  return sequelize.define("collections", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    timestamps: false,
    freezeTableName: true
  });
};
