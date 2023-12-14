const router = require("express").Router();

const usersRoutes = require("./users-routes");
const postsRoutes = require("./posts-routes");
const commentsRoutes = require("./comments-routes");

router.use("/users", usersRoutes);
router.use("/posts", postsRoutes);
router.use("/comments", commentsRoutes);

module.exports = router;
