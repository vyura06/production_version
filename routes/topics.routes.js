"use strict";

const Router = require("express");
const router = new Router();
const topicController = require("../controllers/topics.controller");

router.get("/", topicController.getTopics);

module.exports = router;
