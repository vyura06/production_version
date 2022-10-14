"use strict";

const Router = require("express");
const router = new Router();
const itemsController = require("../controllers/items.controller");

router.get("/", itemsController.getItems.bind(itemsController));
router.get("/:id/likes", itemsController.getItemLikes);
router.post("/:id/likes", itemsController.createItemLike);
router.delete("/:item_id/likes/:id", itemsController.removeItemLike);
router.get("/:id/comments", itemsController.getItemComments);
router.post("/:id/comments", itemsController.createItemComment);
router.delete("/:item_id/comments/:id", itemsController.removeItemComment);
router.post("/:id", itemsController.editItem.bind(itemsController));
router.delete("/:id", itemsController.removeItem.bind(itemsController));
router.post("/", itemsController.createItem.bind(itemsController));
router.get("/optional_fields", itemsController.generateItemOptionalFields);

module.exports = router;
