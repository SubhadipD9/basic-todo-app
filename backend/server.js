const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const auth = require("./auth");

const users = [];
let todos = [];

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Empty input fields",
    });
  }
  const user = users.find((u) => u.username === username);

  if (user) {
    return res.status(409).json({
      message: "User already exist",
    });
  }

  users.push({
    username: username,
    password: password,
  });

  res.status(201).json({
    message: "User successfully signed up",
  });
});

app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Empty input fields",
    });
  }

  const user = users.find((u) => u.username === username);
  const registeredUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user || !registeredUser) {
    return res.status(403).json({
      message: "You are not signed up or wrong credentials",
    });
  }

  if (registeredUser) {
    const token = jwt.sign({ username: registeredUser.username }, JWT_SECRET);

    user.token = token;

    res.status(200).json({
      message: "User successfully signed in",
      token: token,
    });
  }
});

app.use(auth());

app.post("/todos", (req, res) => {});
app.post("/add-todo", (req, res) => {});
