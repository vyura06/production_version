/* eslint-disable camelcase */
"use strict";

const { CollectionTopics } = require("../db/db");

class CollectionTopicsController {
  async getTopics(req, res) {
    const topics = await CollectionTopics.findAll();
    res.json({ topics });
  }
}

module.exports = new CollectionTopicsController();
