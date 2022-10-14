"use strict";

const { host, user, pass, dbname, port } = require("./db.constants");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(dbname, user, pass, {
  host,
  port,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    }
  }
});

const Users = require("./models/User")(sequelize);
const CollectionTopics =
  require("./models/collections/CollectionTopic")(sequelize);
const Collections =
  require("./models/collections/Collection")(sequelize);
const OptionalFieldTypes =
  require("./models/collections/OptionalFieldType")(sequelize);
const CollectionOptionalFields =
  require("./models/collections/CollectionOptionalField")(sequelize);
const Items = require("./models/collections/items/Item")(sequelize);
const ItemOptionalFields =
  require("./models/collections/items/ItemOptionalField")(sequelize);
const ItemTags = require("./models/collections/items/ItemTag")(sequelize);
const Tags = require("./models/collections/items/Tag")(sequelize);
const Comments =
  require("./models/collections/items/Comment")(sequelize);
const Likes = require("./models/collections/items/Like")(sequelize);

Users.hasMany(Collections, { foreignKey: "user_id" });
Collections.belongsTo(Users, { foreignKey: "user_id" });

CollectionTopics.hasMany(Collections, { foreignKey: "topic_id" });
Collections.belongsTo(CollectionTopics, { foreignKey: "topic_id" });

Collections.hasMany(CollectionOptionalFields, { foreignKey: "collection_id" });
CollectionOptionalFields.belongsTo(Collections, { foreignKey: "collection_id" });

OptionalFieldTypes.hasMany(CollectionOptionalFields, { foreignKey: "type_id" });
CollectionOptionalFields.belongsTo(OptionalFieldTypes, { foreignKey: "type_id" });

Collections.hasMany(Items, { foreignKey: "collection_id" });
Items.belongsTo(Collections, { foreignKey: "collection_id" });

Items.hasMany(ItemOptionalFields, { foreignKey: "item_id" });
ItemOptionalFields.belongsTo(Items, { foreignKey: "item_id" });

CollectionOptionalFields.hasMany(ItemOptionalFields, {
  foreignKey: "collection_optional_field_id"
});
ItemOptionalFields.belongsTo(CollectionOptionalFields, {
  foreignKey: "collection_optional_field_id"
});

Tags.belongsToMany(Items, {
  through: ItemTags,
  uniqueKey: "item_id"
});

Items.belongsToMany(Tags, {
  through: ItemTags,
  uniqueKey: "tag_id"
});

Items.hasMany(Comments, { foreignKey: "item_id" });
Users.hasMany(Comments, { foreignKey: "user_id" });
Comments.belongsTo(Items, { foreignKey: "item_id" });
Comments.belongsTo(Users, { foreignKey: "user_id" });

Items.hasMany(Likes, { foreignKey: "item_id" });
Users.hasMany(Likes, { foreignKey: "user_id" });
Likes.belongsTo(Items, { foreignKey: "item_id" });
Likes.belongsTo(Users, { foreignKey: "user_id" });

(async () => {
  // await sequelize.sync({ alter: true });
  await sequelize.authenticate();
  console.log("Connected!");
})();


module.exports = {
  sequelize,
  Users,
  CollectionTopics,
  Collections,
  OptionalFieldTypes,
  CollectionOptionalFields,
  Items,
  ItemOptionalFields,
  Tags,
  ItemTags,
  Comments,
  Likes,
};
