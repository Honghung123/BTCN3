module.exports = {
  badRequest: (req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  },
  middleware: (error, req, res, next) => {
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  },
};
