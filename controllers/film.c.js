const Film = require("../models/film.m");
async function getAllFilms(req, res, next) {
  try {
    const top5Rating = await Film.getTopRating();
    // BoxOffice
    const topBoxOffice = await Film.getTopBoxOffice();
    // Favourites
    const favouriteList = await Film.getFavourites();
    const boxoffList = [];
    for (let i = 0; i < topBoxOffice.items.length; i += 3) {
      boxoffList.push(topBoxOffice.items.slice(i, i + 3));
    }
    const favList = [];
    for (let i = 0; i < favouriteList.items.length; i += 3) {
      favList.push(favouriteList.items.slice(i, i + 3));
    }
    // console.log(topBoxOffice);
    const tops = { total: top5Rating.total, film: top5Rating.items };
    const boxoffice = { totalBox: boxoffList.length, boxoffList };
    const favourites = { totalFav: favList.length, favList };
    // console.log(top5Rating);
    res.render("index", {
      tops,
      boxoffice,
      favourites,
      current: 1,
    });
  } catch (error) {
    next(error);
  }
}

async function getMovieInfo(req, res, next) {
  try {
    const id = req.params.id;
    const data = await Film.getMovieInfoById(id);
    res.render("movieinfopage", { movieInfos: data.items });
  } catch (error) {
    next(error);
  }
}
module.exports = {
  // GET
  getAllFilms,
  getMovieInfo,
};
