const Film = require("../models/film.m");

async function getAllFilms(req, res, next) {
  try {
    await Film.getAll();
    res.render("index", {
      a: 4,
      b: 5,
      x: "Hoang",
      y: true,
      student: { name: "Hung", age: 18 },
      arr: [
        { prop1: "Hoang", prop2: "image2" },
        { prop1: "Cute", prop2: "image" },
      ],
      arrs: [
        [{ prop1: "Hoang", prop2: "image2" }],
        [{ prop1: "Hoang1", prop2: "image23" }],
        [
          { prop1: "Hoang2", prop2: "image3" },
          { prop1: "Hoang4", prop2: "image5" },
        ],
      ],
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
