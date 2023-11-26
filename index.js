// Import module
require("dotenv").config();
const port = process.env.PORT | 3000;
const hostname = process.env.HOST | "localhost";
const express = require("express");
const app = express();
const fs = require("fs/promises");

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

const customTemplateEngine = require("./21461");
app.engine("html", customTemplateEngine);

app.set("views", "./views");
app.set("view engine", "html");

// Routing
const filmRouter = require("./routers/film.r");
app.use("/", filmRouter);

// Middleware
const middleware = require("./middlewares/mdw");
app.use(middleware.middleware);

// Connection
app.listen(port, hostname, () => {
  console.log(`Server running at ${port}`);
});
