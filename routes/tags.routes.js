"use strict";

const Router = require("express");
const router = new Router();
const tagsController = require("../controllers/tags.controller");

router.get("/", tagsController.getTags);

module.exports = router;
