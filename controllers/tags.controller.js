"use strict";

const { Tags } = require("../db/db");

class TagsController {
  async getTags(req, res) {
    const tags = await Tags.findAll();
    res.json({ tags });
  }
}

module.exports = new TagsController();
