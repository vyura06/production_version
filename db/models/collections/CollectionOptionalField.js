/* eslint-disable camelcase */
"use strict";

const { DataTypes } = require("sequelize");

module.exports = function(sequelize) {
  return sequelize.define("collection_optional_fields", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    timestamps: false,
    freezeTableName: true
  });
};
