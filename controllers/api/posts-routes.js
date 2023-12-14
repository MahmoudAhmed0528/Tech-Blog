// postController.js....
const express = require("express");
const { Post, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

const router = express.Router();

// get all posts
router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll();

    res.json(dbPostData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET a single post by id
router.get("/:id", async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Comment,
          attributes: ["id", "comment_text", "user_id", "created_at"],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
      ],
    });

    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    res.json(dbPostData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// create a new post
router.post("/add-post", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.create({
      title: req.body.title,
      post_text: req.body.post_text,
      user_id: req.session.user_id,
    });

    res.json(dbPostData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// update a post
router.put("/:id", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }
    // res.json(dbPostData);
    res.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    res.json(dbPostData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
