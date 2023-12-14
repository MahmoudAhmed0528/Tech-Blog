// server.js

const path = require("path");
const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const helpers = require("./utils/helpers");

const sequelize = require("./config/connection");
const routes = require("./controllers");

// Load environment variables from .env file
require("dotenv").config();

const app = express();

// Set the port directly or use process.env.PORT if available
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined")); // Logging

// Handlebars
const hbs = exphbs.create({ helpers });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Sessions
const sess = {
  secret: process.env.DB_SESSION_SECRET,
  cookie: {
    maxAge: 7200000, // 2 hours
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};
app.use(session(sess));

// Routes
app.use(routes);

// Error Handling
app.use((err, req, res, next) => {
  console.log(err);
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Database Synchronization
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});
