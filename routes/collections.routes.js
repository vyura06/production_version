"use strict";

const Router = require("express");
const router = new Router();
const collectionsController = require("../controllers/collections.controller");

router.get("/optional-field-types", collectionsController.getOptionalFieldTypes);
router.post("/", collectionsController.createCollection);
router.get("/", collectionsController.getCollections.bind(collectionsController));
router.get("/:collection_id/fields", collectionsController.getCollectionOptionalFields);
router.post(
  "/:collection_id",
  collectionsController.editCollection.bind(collectionsController)
);
router.delete("/:id", collectionsController.removeCollection.bind(collectionsController));

module.exports = router;
