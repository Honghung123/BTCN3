const DBProvider = require("../db/db21461s");
const tableName = "person";
module.exports = class User {
  static loadAPI = false;
  constructor({ movies, names, reviews }) {
    this.movies = movies;
    this.names = names;
    this.reviews = reviews;
  }
  static async getAll() {
    const data = await DBProvider.fetch("get/movie/top5?per_page=2&page=1");
    return data;
  }
  static async getTopRating() {
    const data = await DBProvider.fetch("get/movie/top5?per_page=2&page=1");
    return data;
  }
  // static async saveAll(people) {
  //   return await db.saveAll(tableName, people);
  // }
  // static async run() {
  //   const dataApi = await fetch(`${API_URI}?per_page=12&page=1`);
  //   const result = await dataApi.json();
  //   const listPerson = result.data.map((user) => {
  //     return new User(user);
  //   });
  //   const count = await User.getCountAll();
  //   if (count > 0) {
  //     return;
  //   } else {
  //     User.saveAll(listPerson);
  //   }
  // }

  // static async add(user) {
  //   let listAll = await User.getCountAll();
  //   const id = listAll + 1;
  //   const users = new User({ id, ...user });
  //   // User.save(users);
  //   User.insert(users);
  // }
  // static async findAll(conditions) {
  //   if (User.loadAPI == false) {
  //     User.loadAPI = true;
  //     await User.run();
  //   }
  //   const listPerson = await db.findBy(tableName, conditions);
  //   return listPerson;
  // }

  // static async findBy(conditions) {
  //   return await db.findBy(tableName, conditions);
  // }
  // static async findOne(conditions) {
  //   return await db.findOne(tableName, conditions);
  // }
  // static async getCountAll() {
  //   const count = await db.findAll(tableName);
  //   return count.length;
  // }
  // static async findById(id) {
  //   return await db.findById(tableName, id);
  // }
  // static async save(person) {
  //   return await db.save(tableName, person);
  // }
  // static async insert(person) {
  //   await db.insert(tableName, person);
  // }
  // static async update(person) {
  //   await db.update(tableName, person);
  // }
  // static async deleteById(id) {
  //   return await db.deleteById(tableName, id);
  // }
};
