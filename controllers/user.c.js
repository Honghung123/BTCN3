const User = require("./../models/user.m");

async function getAllUsers(req, res, next) {
  try {
    const per_page = 2;
    const page = req.query.page || 1;
    const conditions = [(page - 1) * per_page + 1, page * per_page];
    const length = await User.getCountAll();
    const total_pages =
      parseInt(length / per_page) + (length % per_page == 0 ? 0 : 1);
    const listPerson = await User.findAll(conditions);
    res.render("index", { listPerson, total_pages, page, home: true });
  } catch (error) {
    next(error);
  }
}

async function addUserGet(req, res, next) {
  try {
    res.render("addUser");
  } catch (error) {
    next(error);
  }
}
async function editUser(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const user = await User.findById(id);
    res.render("editUser", { user });
  } catch (error) {
    next(error);
  }
}
async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    const status = await User.deleteById(id);
    console.log(status);
    res.redirect("./..");
  } catch (error) {
    next(error);
  }
}
async function getUserInfo(req, res, next) {
  try {
    const id = req.params.id || 0;
    const user = await User.findById(id);
    res.render("index", { user: user, home: false });
  } catch (error) {
    next(error);
  }
}
async function searchUser(req, res, next) {
  try {
    const id = req.body.userId || 0;
    const user = await User.findById(id);
    res.render("index", { user: user, home: false });
  } catch (error) {
    next(error);
  }
}
// POST
async function addUserPost(req, res, next) {
  try {
    await User.add(req.body);
    res.redirect("..");
  } catch (error) {
    next(error);
  }
}
async function updateUser(req, res, next) {
  try {
    req.body.id = parseInt(req.body.id);
    await User.update(req.body);
    res.redirect("./..");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  // GET
  getAllUsers,
  addUserGet,
  editUser,
  deleteUser,
  getUserInfo,

  // POST
  addUserPost,
  searchUser,
  updateUser,
};
