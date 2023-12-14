const sequelize = require("../config/connection");
const { Comment, Post, User } = require("../models");

const commentData = require("./comments.json");
const postData = require("./posts.json");
const userData = require("./users.json");

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    const posts = await Post.bulkCreate(postData, {
      returning: true,
    });

    for (const comment of commentData) {
      await Comment.create({
        ...comment,
        user_id: users[Math.floor(Math.random() * users.length)].id,
        post_id: posts[Math.floor(Math.random() * posts.length)].id,
      });
    }

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
