"use strict";

const express = require("express");
const cors = require("cors");
const usersRoutes = require("./routes/users.routes");
const topicsRoutes = require("./routes/topics.routes");
const collectionsRoutes = require("./routes/collections.routes");
const itemsRoutes = require("./routes/items.routes");
const tagsRoutes = require("./routes/tags.routes");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use("/api/users", usersRoutes);
app.use("/api/topics", topicsRoutes);
app.use("/api/collections", collectionsRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/tags", tagsRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.listen(PORT, () => console.log(`App is running on ${PORT}`));
