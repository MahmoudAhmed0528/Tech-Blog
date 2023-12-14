// commentController.js
const express = require("express");
const { Comment, Post, User } = require("../../models");
const withAuth = require("../../utils/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const dbCommentData = await Comment.findAll();

    res.json(dbCommentData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// add comment to a post
router.post("/add-comment/:post_id", withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.create({
      comment_text: req.body.comment_text,
      user_id: req.session.user_id,
      post_id: req.params.post_id,
    });

    res.json(dbCommentData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Handle the form submission for editing an existing comment
router.put("/edit-comment/:id", withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.update(
      {
        comment_text: req.body.comment_text,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!dbCommentData[0]) {
      res.status(404).json({ message: "No comment found with this id" });
      return;
    }

    res.json(dbCommentData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Handle the form submission for deleting an existing comment
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const dbCommentData = await Comment.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!dbCommentData) {
      res.status(404).json({ message: "No comment found with this id" });
      return;
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
