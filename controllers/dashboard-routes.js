const router = require("express").Router();
const { User, Post, Comment } = require("../models");
const bcrypt = require("bcrypt");
const withAuth = require("../utils/auth");

// Homepage route
router.get("/", withAuth, async (req, res) => {
  res.render("home", {
    logged_in: req.session.logged_in,
    username: req.session.username,
  });
});

// Render the login page
router.get("/login", (req, res) => {
  res.render("login", { logged_in: req.session.logged_in });
});

// Handle login form submission
router.post("/login", async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!dbUserData) {
      res.status(400).json({ message: "No user with that email address!" });
      return;
    }

    const validPassword = bcrypt.compareSync(
      req.body.password,
      dbUserData.password
    );

    if (!validPassword) {
      res.status(400).json({ message: "Incorrect password!" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.logged_in = true;

      res.redirect("/dashboard"); // Redirect to the dashboard after a successful login
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Render the signup page
router.get("/signup", (req, res) => {
  res.render("signup", { logged_in: req.session.logged_in });
});

// Handle signup form submission
router.post("/signup", async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.logged_in = true;

      res.redirect("/dashboard"); // Redirect to the dashboard after successful signup
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Render the dashboard
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      attributes: ["id", "post_text", "title", "created_at"],
      include: [
        {
          model: User,
          attributes: ["id", "username"],
        },
        {
          model: Comment,
          attributes: ["id", "comment_text", "user_id", "created_at"],
          include: {
            model: User,
            attributes: ["id", "username"],
          },
        },
      ],
    });

    // serialize data before passing to template
    const posts = dbPostData.map((post) => {
      const plainPost = post.get({ plain: true });

      plainPost.canEditPost =
        req.session.user_id === plainPost.user.id ? true : false;
      plainPost.comments = plainPost.comments.map((comment) => {
        comment.canEditComment =
          req.session.user_id === comment.user_id ? true : false;
        return comment;
      });

      return plainPost;
    });

    res.render("dashboard", {
      posts,
      logged_in: req.session.logged_in,
      user: req.session.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// // Render the page to add a new post
router.get("/add-post", (req, res) => {
  res.render("add-post");
});

// Render the page to edit an existing post
router.get("/edit-post/:id", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "post_text", "title", "created_at"],
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "created_at",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    // serialize data before passing to template
    const post = dbPostData.get({ plain: true });
    res.render("edit-post", { post, logged_in: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Render the page to add a new comment to a post
router.get("/add-comment/:post_id", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findByPk(req.params.post_id);

    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    res.render("add-comment", {
      post: dbPostData.get({ plain: true }),
      logged_in: req.session.logged_in,
      post_id: req.params.post_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Render the page to edit an existing comment
router.get("/edit-comment/:id", withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.findByPk(req.params.id);

    if (!dbCommentData) {
      res.status(404).json({ message: "No comment found with this id" });
      return;
    }

    res.render("edit-comment", {
      comment: dbCommentData.get({ plain: true }),
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
