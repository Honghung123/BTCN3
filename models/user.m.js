const db = require("../db/database");
let API_URI = "https://reqres.in/api/users";
const tableName = "person";
module.exports = class User {
  static loadAPI = false;
  constructor({ id, first_name, last_name, email, avatar }) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.avatar = avatar;
  }
  static async saveAll(people) {
    return await db.saveAll(tableName, people);
  }
  static async run() {
    const dataApi = await fetch(`${API_URI}?per_page=12&page=1`);
    const result = await dataApi.json();
    const listPerson = result.data.map((user) => {
      return new User(user);
    });
    const count = await User.getCountAll();
    if (count > 0) {
      return;
    } else {
      User.saveAll(listPerson);
    }
  }

  static async add(user) {
    let listAll = await User.getCountAll();
    const id = listAll + 1;
    const users = new User({ id, ...user });
    // User.save(users);
    User.insert(users);
  }
  static async findAll(conditions) {
    if (User.loadAPI == false) {
      User.loadAPI = true;
      await User.run();
    }
    const listPerson = await db.findBy(tableName, conditions);
    return listPerson;
  }

  // static async findBy(conditions) {
  //   return await db.findBy(tableName, conditions);
  // }
  static async findOne(conditions) {
    return await db.findOne(tableName, conditions);
  }
  static async getCountAll() {
    const count = await db.findAll(tableName);
    return count.length;
  }
  static async findById(id) {
    return await db.findById(tableName, id);
  }
  static async save(person) {
    return await db.save(tableName, person);
  }
  static async insert(person) {
    await db.insert(tableName, person);
  }
  static async update(person) {
    await db.update(tableName, person);
  }
  static async deleteById(id) {
    return await db.deleteById(tableName, id);
  }
};
