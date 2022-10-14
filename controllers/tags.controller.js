"use strict";

const { Tags } = require("../db/db.sequelize");

class TagsController {
  async getTags(req, res) {
    const tags = await Tags.findAll();
    res.json({ tags });
  }
}

module.exports = new TagsController();
