// Import module
require("dotenv").config();
const port = process.env.PORT | 3000;
const hostname = process.env.HOST | "localhost";
const express = require("express");
const app = express();
const fs = require("fs/promises");

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

const arrSkip = ["settings", "_locals", "cache"];
app.engine("html", async (filePath, options, callback) => {
  // define the template engine
  const content = await fs.readFile(filePath, { encoding: "utf-8" });
  let rendered = content;
  for (const key in options) {
    if (options.hasOwnProperty(key) && arrSkip.indexOf(key) == -1) {
      rendered = rendered.replace(`{{${key}}}`, options[key]);
    }
  }
  return callback(null, rendered);
});

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
