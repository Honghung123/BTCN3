require("dotenv").config();
const fs = require("fs");
const pathToFile = "./data/data.json";
const pgp = require("pg-promise")({ capSQL: true });
const cn = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DB,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  max: 30,
};

const db = pgp(cn);
console.log(cn);
module.exports = {
  findAll: async (tableName) => {
    const query = `SELECT * FROM ${tableName}`;
    const data = await db.any(query);
    return data;
  },
  findById: async (tableName, id) => {
    const query = `SELECT * FROM ${tableName} WHERE id = $1`;
    const data = await db.one(query, [id]);
    return data;
  },
  findOne: async (tableName, conditions) => {
    const numOfCon = Object.keys(conditions).length;
    let whereStatement;
    const query = pgp.helpers.concat([
      "SELECT * FROM",
      tableName,
      "WHERE",
      pgp.helpers.where(conditions),
    ]);
    const data = await db.one(query);
    return data;
  },
  saveAllToDatabase: async (tableName, entities) => {
    const columns = Object.keys(entities[0]);
    const query =
      pgp.helpers.insert(entities, columns, tableName) + " RETURNING *";
    const data = await db.any(query);
    return data;
  },
  loadAllJsonToDatabase: async function () {
    try {
      const jsonData = await fs.readFileSync(pathToFile);
      const jsonObject = await JSON.parse(jsonData);
      const { Movies, Names, Reviews } = jsonObject;

      Movies.forEach(async (movie) => {
        await this.save("movies", movie);
      });
      Names.forEach(async (name) => {
        await this.save("names", name);
      });
      Reviews.forEach(async (review) => {
        `z`;
        await this.save("reviews", review);
      });
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },
  save: async (tableName, entity) => {
    const columns = Object.keys(entity);
    const query =
      pgp.helpers.insert(entity, columns, tableName) +
      " ON CONFLICT (id) DO UPDATE SET " +
      columns.map((col) => `${col} = EXCLUDED.${col}`).join(", ") + // Update each column with the new value
      " RETURNING *";

    const data = await db.one(query);
    return data;
  },
  findBy: async (tableName, conditions) => {
    const query = `SELECT * FROM ${tableName} WHERE id BETWEEN ${conditions[0]} AND ${conditions[1]}`;
    const data = await db.any(query);
    return data;
  },
  deleteById: async (tableName, id) => {
    const query = `DELETE FROM ${tableName} WHERE id = $1 RETURNING *`;
    await db.any(query, [id]);
  },
  update: async (tableName, person) => {
    const condition = pgp.as.format(` WHERE id = ${person.id}`, person);
    const columns = ["first_name", "last_name", "avatar", "email"];
    const query = pgp.helpers.update(person, columns, tableName) + condition;
    //=> UPDATE "my-table" SET "val"=123,"msg"='hello' WHERE id = 1
    await db.query(query);
  },
  insert: async (tableName, person) => {
    const condition = " RETURNING id";
    const columns = ["id", "first_name", "last_name", "avatar", "email"];
    const query = pgp.helpers.insert(person, columns, tableName);
    //=> UPDATE "my-table" SET "val"=123,"msg"='hello' WHERE id = 1
    await db.query(query);
  },
};
