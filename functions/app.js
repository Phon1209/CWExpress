const express = require("express");
const morgan = require("morgan");
const router = require("./routes/router");
const connectDatabase = require("./database/connect");
const { initializeClient } = require("./utils/mqtt");
const cors = require("cors");
const compression = require("compression");

const app = express();

app.use(compression());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));

connectDatabase();
initializeClient();

const routeAddress = "/cwex/" + process.env.VERSION;

// Routers
app.use(routeAddress, router);

module.exports = app;
