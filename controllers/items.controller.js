/* eslint-disable camelcase */
"use strict";

const {
  Items,
  ItemOptionalFields,
  CollectionOptionalFields,
  OptionalFieldTypes,
  Tags,
  ItemTags,
  Collections,
  Likes,
  Comments
} = require("../db/db");
const sequelize = require("sequelize");

class ItemsController {
  async getCollectionItems(collection_id) {
    const dbItems = await Items.findAll({
      where: { collection_id },
    });

    const items = [];
    for (const dbItem of dbItems) {
      const item = Object.assign({}, dbItem.dataValues);

      const dbFields = await ItemOptionalFields.findAll({
        where: { item_id: item.id }
      });
      const dbItemTags = await ItemTags.findAll({
        where: { itemId: dbItem.id }
      });

      const fields = [];
      for (const dbField of dbFields) {
        const field = Object.assign({}, dbField.dataValues);

        const collectionField = await CollectionOptionalFields.findOne({
          where: { id: field.collection_optional_field_id }
        });
        const name = collectionField.name;
        const type = await OptionalFieldTypes.findOne({
          where: { id: collectionField.type_id }
        });

        field.name = name;
        field.type_name = type.name;

        fields.push(field);
      }

      const itemTags = [];
      for (const dbItemTag of dbItemTags) {
        const dbTag = await Tags.findOne({
          where: { id: dbItemTag.tagId }
        });

        const itemTag = Object.assign({}, dbItemTag.dataValues, { name: dbTag.name });
        itemTags.push(itemTag);
      }

      item.optionalFields = fields;
      item.tags = itemTags;
      items.push(item);
    }

    return items;
  }

  async getItems(req, res) {
    const url = new URL(req.url, "https://baseurl.com/");
    const collection_id = +url.searchParams.get("collection_id");
    const limit = +url.searchParams.get("limit");
    const offset = +url.searchParams.get("offset") || 0;
    const order_by = url.searchParams.get("order_by") || "id";
    const order = url.searchParams.get("order") || "ASC";

    let items = [];
    if (collection_id) {
      items = await this.getCollectionItems(collection_id);
    } else {
      const dbItems = await Items.findAll({
        limit,
        offset,
        order: [[order_by, order]],
      });

      for (const dbItem of dbItems) {
        const dbItemTags = await ItemTags.findAll({
          where: { itemId: dbItem.id }
        });
        const dbItemFields = await ItemOptionalFields.findAll({
          where: { item_id: dbItem.id }
        });

        const itemTags = [];
        for (const dbItemTag of dbItemTags) {
          const dbTag = await Tags.findOne({
            where: { id: dbItemTag.tagId }
          });

          const itemTag = Object.assign({}, dbItemTag.dataValues, { name: dbTag.name });
          itemTags.push(itemTag);
        }

        const itemFields = [];
        for (const dbItemField of dbItemFields) {
          const dbField = await CollectionOptionalFields.findOne({
            where: { id: dbItemField.collection_optional_field_id }
          });
          const type = await OptionalFieldTypes.findOne({
            where: { id: dbField.type_id }
          });

          const itemField =
            Object.assign({}, dbItemField.dataValues,
              { name: dbField.name, type_name: type.name });
          itemFields.push(itemField);
        }

        const collection = await Collections.findOne({
          where: { id: dbItem.collection_id }
        });

        const item =
          Object.assign({}, dbItem.dataValues,
            {
              tags: itemTags,
              optionalFields: itemFields,
              collection_name: collection.name
            });
        items.push(item);
      }
    }

    res.json({ items });
  }

  async generateItemOptionalFields(req, res) {
    const url = new URL(req.url, "https://baseurl.com/");
    const collection_id = +url.searchParams.get("collection_id");

    const fields = await CollectionOptionalFields.findAll({
      where: { collection_id },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT optional_field_types.name
              FROM optional_field_types
              WHERE optional_field_types.id = collection_optional_fields.type_id
            )`),
            "type_name"
          ],
        ]
      },
    });

    res.json({ fields });
  }

  async createItem(req, res) {
    const {
      name,
      collection_id,
      tags,
      optionalFields
    } = req.body;

    const newItem = await Items.create({
      name,
      collection_id,
      created_date: new Date(),
      last_edit: new Date(),
    });

    const itemTags = await this.handleNewItemTags(newItem.id, tags);
    const itemFields = await this.handleNewItemFields(newItem.id, optionalFields);

    const item = Object.assign({}, newItem.dataValues, {
      tags: itemTags,
      optionalFields: itemFields,
    });

    res.json({ item });
  }

  async handleNewItemTags(item_id, tags) {
    const itemTags = [];
    for (const tag of tags) {
      const dbTag = await Tags.findOne({
        where: { name: tag.name }
      });

      let newTag = {};
      if (!dbTag) {
        newTag = await Tags.create({
          name: tag.name
        });
      }

      const dbItemTag = await ItemTags.create({
        itemId: item_id,
        tagId: dbTag?.id || newTag.id
      });

      const itemTag = Object.assign({}, dbItemTag.dataValues, { name: tag.name });
      itemTags.push(itemTag);
    }

    return itemTags;
  }

  async handleNewItemFields(item_id, fields) {
    const itemFields = [];
    for (const field of fields) {
      const dbItemField = await ItemOptionalFields.create({
        value: field.value,
        item_id,
        collection_optional_field_id: field.id
      });

      const dbCollectionField = await CollectionOptionalFields.findOne({
        where: { id: field.id }
      });
      const type = await OptionalFieldTypes.findOne({
        where: { id: dbCollectionField.type_id }
      });

      const itemField = Object.assign(
        {}, dbItemField.dataValues, { name: dbCollectionField.name, type_name: type.name }
      );
      itemFields.push(itemField);
    }

    return itemFields;
  }

  async editItem(req, res) {
    const {
      id,
      name,
      tags,
      optionalFields
    } = req.body;

    const newTags = await this.updateItemTags(id, tags);
    const newOptionalFields = await this.updateOptionalFields(id, optionalFields);

    console.log("newTags", newTags);
    console.log("newOptionalFields", newOptionalFields);

    await Items.update({
      name,
      last_edit: new Date()
    }, { where: { id } });

    const dbItem = await Items.findOne({ where: { id } });
    const item = Object.assign({}, dbItem.dataValues, {
      tags: newTags,
      optionalFields: newOptionalFields
    });

    res.json({ item });
  }

  async updateItemTags(itemId, tags) {
    const dbItemTags = await ItemTags.findAll({
      where: { itemId }
    });
    const newTags = tags.filter(tag => !("id" in tag));
    const newItemTags = tags.filter(tag => !("tagId" in tag));
    const oldItemTags = tags.filter(tag => "tagId" in tag);

    for (const dbItemTag of dbItemTags) {
      const itemTag = oldItemTags.find(t => t.id === dbItemTag.id);
      if (!itemTag) {
        await ItemTags.destroy({
          where: { id: dbItemTag.id }
        });
      }
    }

    for (const tag of newItemTags) {
      const dbItemTag = await ItemTags.findOne({
        where: { tagId: tag.id, itemId }
      });

      const dbTag = await Tags.findOne({ where: { id: tag.id } });
      if (!dbItemTag) {
        const newItemTag = await ItemTags.create({
          tagId: tag.id,
          itemId,
        });

        oldItemTags.push(Object.assign({}, newItemTag.dataValues, { name: dbTag.name }));
      } else {
        oldItemTags.push(Object.assign({}, dbItemTag.dataValues, { name: dbTag.name }));
      }
    }

    for (const newTag of newTags) {
      const tag = await Tags.create({
        name: newTag.name,
      });

      const itemTag = await ItemTags.create({
        itemId,
        tagId: tag.id
      });
      oldItemTags.push(Object.assign({}, itemTag.dataValues, { name: tag.name }));
    }

    return oldItemTags;
  }

  async updateOptionalFields(item_id, optionalFields) {
    for (const field of optionalFields) {
      await ItemOptionalFields.update({
        value: field.value
      }, { where: { item_id, id: field.id } });
    }

    return optionalFields;
  }

  async removeItem(req, res) {
    const id = +req.params.id;

    await ItemTags.destroy({
      where: { itemId: id }
    });

    await ItemOptionalFields.destroy({
      where: { item_id: id }
    });

    await Items.destroy({
      where: { id }
    });

    res.status(200);
    res.end();
  }

  async getItemLikes(req, res) {
    const item_id = +req.params.id;
    const likes = await Likes.findAll({
      where: { item_id }
    });
    res.json({ likes });
  }

  async getItemComments(req, res) {
    const item_id = +req.params.id;
    const comments = await Comments.findAll({
      where: { item_id },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT users.last_name || ' ' || users.first_name
              FROM users
              WHERE users.id = comments.user_id
            )`),
            "user_name"
          ],
        ]
      },
    });
    res.json({ comments });
  }

  async createItemLike(req, res) {
    const item_id = +req.params.id;
    const { user_id } = req.body;
    const like = await Likes.create({
      user_id,
      item_id
    });

    res.json({ like });
  }

  async removeItemLike(req, res) {
    const item_id = +req.params.item_id;
    const id = +req.params.id;

    await Likes.destroy({
      where: { id, item_id, }
    });

    res.status(200).end();
  }

  async createItemComment(req, res) {
    const item_id = +req.params.id;
    const { user_id, body } = req.body;

    const newComment = await Comments.create({
      item_id,
      user_id,
      body,
      created_date: new Date()
    });

    const comment = await Comments.findOne({
      where: { id: newComment.id },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT users.last_name || ' ' || users.first_name
              FROM users
              WHERE users.id = comments.user_id
            )`),
            "user_name"
          ],
        ]
      },
    });

    res.json({ comment });
  }

  async removeItemComment(req, res) {
    const item_id = +req.params.item_id;
    const id = +req.params.id;

    await Comments.destroy({
      where: { id, item_id }
    });

    res.status(200).end();
  }
}

module.exports = new ItemsController();
