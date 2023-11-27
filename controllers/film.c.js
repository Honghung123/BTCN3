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
      favourites
    });
  } catch (error) {
    next(error);
  }
}

// async function addUserGet(req, res, next) {
//   try {
//     res.render("addUser");
//   } catch (error) {
//     next(error);
//   }
// }
// async function editUser(req, res, next) {
//   try {
//     const id = parseInt(req.params.id);
//     const user = await User.findById(id);
//     res.render("editUser", { user });
//   } catch (error) {
//     next(error);
//   }
// }
// async function deleteUser(req, res) {
//   try {
//     const id = parseInt(req.params.id);
//     const status = await User.deleteById(id);
//     console.log(status);
//     res.redirect("./..");
//   } catch (error) {
//     next(error);
//   }
// }
// async function getUserInfo(req, res, next) {
//   try {
//     const id = req.params.id || 0;
//     const user = await User.findById(id);
//     res.render("index", { user: user, home: false });
//   } catch (error) {
//     next(error);
//   }
// }
// async function searchUser(req, res, next) {
//   try {
//     const id = req.body.userId || 0;
//     const user = await User.findById(id);
//     res.render("index", { user: user, home: false });
//   } catch (error) {
//     next(error);
//   }
// }
// // POST
// async function addUserPost(req, res, next) {
//   try {
//     await User.add(req.body);
//     res.redirect("..");
//   } catch (error) {
//     next(error);
//   }
// }
// async function updateUser(req, res, next) {
//   try {
//     req.body.id = parseInt(req.body.id);
//     await User.update(req.body);
//     res.redirect("./..");
//   } catch (error) {
//     next(error);
//   }
// }

module.exports = {
  // GET
  getAllFilms,
  // addUserGet,
  // editUser,
  // deleteUser,
  // getUserInfo,

  // // POST
  // addUserPost,
  // searchUser,
  // updateUser,
};
