/* eslint-disable camelcase */
"use strict";

const {
  OptionalFieldTypes,
  Collections,
  CollectionOptionalFields,
  Items,
  ItemOptionalFields,
  ItemTags,
  Likes,
  Comments,
} = require("../db/db");
const sequelize = require("sequelize");

class CollectionsController {
  async getOptionalFieldTypes(req, res) {
    const types = await OptionalFieldTypes.findAll();
    res.json({ types });
  }

  async createCollection(req, res) {
    const {
      name,
      user_id,
      topic_id,
      description,
      image_link,
      optionalFields
    } = req.body;

    const newCollection = await Collections.create({
      name,
      description,
      image_link,
      created_date: new Date(),
      user_id,
      topic_id,
    });

    const collection = await Collections.findOne({
      where: { id: newCollection.id },
      attributes: {
        include: [
          [
            sequelize.literal(`(
                SELECT collection_topics.name
                FROM collection_topics
                WHERE collection_topics.id = collections.topic_id
            )`),
            "topic_name"
          ],
          [
            sequelize.literal(`(
                SELECT COUNT(*)
                FROM items
                WHERE items.collection_id = collections.id
            )`),
            "items_count"
          ],
          [
            sequelize.literal(`(
                SELECT
                  users.last_name || ' ' || users.first_name
                FROM users
                WHERE users.id = collections.user_id
            )`),
            "author"
          ],
        ]
      }
    });

    for (const { name, type_id } of optionalFields) {
      await CollectionOptionalFields.create({
        name,
        collection_id: collection.id,
        type_id,
      });
    }

    res.json({ collection });
  }

  async getCollections(req, res) {
    const url = new URL(req.url, "https://baseurl.com/");
    const user_id = +url.searchParams.get("user_id");
    const limit = +url.searchParams.get("limit");
    const order_by = url.searchParams.get("order_by") || "id";
    const order = url.searchParams.get("order") || "ASC";

    let collections = [];
    if (user_id) {
      collections = await Collections.findAll({
        where: { user_id },
        attributes: {
          include: [
            [
              sequelize.literal(`(
                  SELECT collection_topics.name
                  FROM collection_topics
                  WHERE collection_topics.id = collections.topic_id
              )`),
              "topic_name"
            ],
            [
              sequelize.literal(`(
                  SELECT COUNT(*)
                  FROM items
                  WHERE items.collection_id = collections.id
              )`),
              "items_count"
            ],
            [
              sequelize.literal(`(
                  SELECT
                    users.last_name || ' ' || users.first_name
                  FROM users
                  WHERE users.id = collections.user_id
              )`),
              "author"
            ],
          ]
        },
        order: [
          [order_by, order]
        ],
      });
    } else {
      collections = await this.getTopBiggestCollections(limit, order);
    }

    res.json({ collections });
  }

  async getTopBiggestCollections(limit, order) {
    const collections = await Collections.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
                SELECT COUNT(*)
                FROM items
                WHERE items.collection_id = collections.id
            )`),
            "items_count"
          ],
          [
            sequelize.literal(`(
                SELECT
                  users.last_name || ' ' || users.first_name
                FROM users
                WHERE users.id = collections.user_id
            )`),
            "author"
          ],
          [
            sequelize.literal(`(
                SELECT collection_topics.name
                FROM collection_topics
                WHERE collection_topics.id = collections.topic_id
            )`),
            "topic_name"
          ]
        ]
      },
      order: [
        [sequelize.literal("items_count"), order]
      ],
      limit
    });

    return collections;
  }

  async removeCollection(req, res) {
    const id = +req.params.id;

    await this.removeCollectionItems(id);
    await this.removeCollectionOptionalFields(id);

    await Collections.destroy({
      where: { id }
    });

    res.status(200);
    res.end();
  }

  async removeCollectionItems(id) {
    const collectionItems = await Items.findAll({
      where: {
        collection_id: id
      }
    });

    for (const item of collectionItems) {
      await this.removeItem(item.id);
    }
  }

  async removeItem(item_id) {
    const relatedTables = [
      ItemOptionalFields,
      Likes,
      Comments
    ];

    for (const relatedTable of relatedTables) {
      await relatedTable.destroy({
        where: { item_id }
      });
    }

    await ItemTags.destroy({
      where: { itemId: item_id }
    });

    await Items.destroy({
      where: { id: item_id }
    });
  }

  async removeCollectionOptionalFields(id) {
    await CollectionOptionalFields.destroy({
      where: {
        collection_id: id
      }
    });
  }

  async getCollectionOptionalFields(req, res) {
    const collection_id = +req.params.collection_id;

    const fields = await CollectionOptionalFields.findAll({
      where: { collection_id }
    });

    res.json({ fields });
  }

  async editCollection(req, res) {
    const {
      id,
      name,
      description,
      image_link,
      topic_id,
      optionalFields
    } = req.body;

    await this.editOptionalFields(id, optionalFields);

    const collection = await Collections.update({
      name,
      description,
      topic_id,
      image_link
    },
    {
      where: { id }
    });

    res.json({ collection });
  }

  async editOptionalFields(collection_id, optionalFields) {
    const dbFields = await CollectionOptionalFields.findAll({
      where: { collection_id }
    });
    const newFields = optionalFields.filter(field => !("id" in field));

    for (const field of dbFields) {
      const collectionField = optionalFields.find(f => f.id === field.id);
      if (collectionField) {
        await CollectionOptionalFields.update({
          name: collectionField.name,
          type_id: collectionField.type_id
        },
        {
          where: { id: field.id }
        });
      } else {
        await CollectionOptionalFields.destroy({
          where: { id: field.id }
        });
      }
    }

    for (const newField of newFields) {
      await CollectionOptionalFields.create({
        name: newField.name,
        collection_id,
        type_id: newField.type_id,
      });
    }
  }
}

module.exports = new CollectionsController();
