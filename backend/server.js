const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const users = [];
let todos = [];
const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

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

app.use(function auth(req, res, next) {
  const token = req.headers.token;

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, data) => {
      if (err) {
        res.status(401).send({
          message: "Unauthorize",
        });
      } else {
        req.username = data.username;
        next();
      }
    });
  } else {
    res.status(403).send({
      message: "Unauthorize",
    });
  }
});

app.get("/todos", (req, res) => {
  res.status(201).json(todos);
});

app.post("/add-todo", (req, res) => {
  const { todo } = req.body;

  if (!todo) {
    return res.status(400).json({
      message: "todo field is empty",
    });
  }

  todos.push(
    (newTodo = {
      todo: todo,
      completed: false,
      id: uuidv4,
    })
  );

  res.status(201).json({
    message: "Todo created successfully",
    id: newTodo.id,
  });
});

app.put("/update-todo", (req, res) => {
  const { todo, updated_todo } = req.body;

  if (!updated_todo) {
    res.status(400).json({
      messgae: "Empty Update Todo Field",
    });
    return;
  }

  const todoForUpdate = todos.find((t) => t.todo === todo);
  todoForUpdate.todo = updated_todo;

  res.status(200).json({
    message: "Todo updated successfully",
    todos,
  });
});

app.delete("/delete-todo", (req, res) => {
  const { id } = req.body;

  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }

  todos.splice(index, 1);

  res.status(200).json({
    message: "Todo deleted successfully",
  });
});

app.post("/done", (req, res) => {
  const { id } = req.body;

  const todo = todos.find((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Todo not found",
    });
  }
  todo.completed = true;

  res.status(200).json({
    message: "Todo completed",
  });
});

app.get("/me", (req, res) => {
  res.status(201).json({
    username: req.username,
  });
});

function startServer(PORT) {
  if (!PORT) {
    console.log("Port is not define");
  } else {
    app.listen(PORT, () =>
      console.log(`Server is started at http://localhost:${PORT}`)
    );
  }
}

startServer(PORT);
