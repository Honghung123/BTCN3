const db = require("./../../db/db21461s.js");
console.log(await db.fetch("get/movie/top5"));
