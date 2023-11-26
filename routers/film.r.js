const express = require("express");
const routers = express.Router();

const filmController = require("../controllers/film.c");
routers.get("/", filmController.getAllFilms);
// routers.get("/addUser", userController.addUserGet);
// routers.get("/user/:id", userController.getUserInfo);
// routers.get("/edit/:id", userController.editUser);
// routers.get("/delete/:id", userController.deleteUser);
// routers.post("/", userController.searchUser);
// routers.post("/addUser", userController.addUserPost);
// routers.post("/edit/:id", userController.updateUser);

module.exports = routers;
