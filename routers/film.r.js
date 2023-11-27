const express = require("express");
const routers = express.Router();

const filmController = require("../controllers/film.c");
routers.get("/", filmController.getAllFilms);
routers.get("/movie/:id", filmController.getMovieInfo);

module.exports = routers;
