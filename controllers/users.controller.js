/* eslint-disable camelcase */
"use strict";

const { Users, Likes, Collections } = require("../db/db");
const collectionsController = require("./collections.controller");

class UsersController {
  async getUser(req, res) {
    const { email, password } = this.getDataFromUrl(req.url);

    if (!email && !password) {
      const users = await Users.findAll({ order: [["id", "ASC"]] });
      res.json({ users });
    }

    const user = await Users.findOne({
      where: { email, password }
    });

    if (user === null) {
      res.status(400);
      res.end("User not found!");
    } else if (user.is_blocked) {
      res.status(400);
      res.end("User was blocked!");
    } else {
      user.last_visit = new Date();
      await user.save();
      res.json({ user });
    }
  }

  getDataFromUrl(baseUrl) {
    const url = new URL(baseUrl, "http://sample.url/");
    const email = url.searchParams.get("email");
    const password = url.searchParams.get("password");

    return { email, password };
  }

  async createUser(req, res) {
    const {
      first_name,
      last_name,
      email,
      password
    } = req.body;

    const isExistingEmail =
      (await Users.findOne({ where: { email } })) !== null;

    if (isExistingEmail) {
      res.status(400);
      res.end("Users with such email already exist!");
    } else {
      const user = await Users.create({
        first_name,
        last_name,
        email,
        password,
        is_blocked: false,
        is_admin: false,
        created_date: new Date(),
        last_visit: null
      });

      res.json(user);
    }
  }

  async getUserLikes(req, res) {
    const id = +req.params.id;
    const likes = await Likes.findAll({
      where: { user_id: id }
    });

    res.json({ likes });
  }

  async changeUserData(req, res) {
    const id = +req.params.id;
    const url = new URL(req.url, "http://base.url/");
    const is_blocked = url.searchParams.get("is_blocked");
    const is_admin = url.searchParams.get("is_admin");

    if (is_blocked !== null) {
      await Users.update({
        is_blocked
      },
      {
        where: { id }
      });
    }

    if (is_admin !== null) {
      await Users.update({
        is_admin
      },
      {
        where: { id }
      });
    }

    const user = await Users.findOne({
      where: { id }
    });

    res.json({ user });
  }

  async removeUser(req, res) {
    const id = +req.params.id;

    await this.removeUserCollections(id);
    await Users.destroy({
      where: { id }
    });

    res.status(200).end();
  }

  async removeUserCollections(user_id) {
    const collections = await Collections.findAll({
      where: { user_id }
    });

    for (const collection of collections) {
      await collectionsController
        .removeCollectionItems
        .call(collectionsController, collection.id);

      await collectionsController
        .removeCollectionOptionalFields
        .call(collectionsController, collection.id);
    }

    await Collections.destroy({
      where: { user_id }
    });
  }
}

module.exports = new UsersController();
