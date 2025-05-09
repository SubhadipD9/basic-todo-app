async function displayTodo() {
  try {
    const responseWithTodo = await axios.get("http://localhost:3000/todos", {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    const todoDisplay = document.querySelector(".todo-container");
    todoDisplay.innerHTML = "";

    responseWithTodo.data.forEach((items) => {
      const id = items.id;
      const todo = items.todo;

      const todolist = document.createElement("div");
      todolist.classList.add("todo-item");

      const checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.classList.add("checkbox");
      checkBox.addEventListener("click", () => completeTask(id));

      const todoText = document.createTextNode(todo);

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "Delete";
      deleteBtn.classList.add("delete");
      deleteBtn.addEventListener("click", () => deletetodo(id));

      const editBtn = document.createElement("button");
      editBtn.innerHTML = "Edit";
      editBtn.classList.add("edit");
      editBtn.addEventListener("click", () => editTodo(id, todo));

      if (items.completed === true) {
        checkBox.checked = true;
        checkBox.disabled = true;
        deleteBtn.disabled = true;
        deleteBtn.style.pointerEvents = "none";
        deleteBtn.style.backgroundColor = "grey";
        checkBox.style.pointerEvents = "none";
        todolist.style.backgroundColor = "green";
      }

      todolist.appendChild(checkBox);
      todolist.appendChild(todoText);
      todolist.appendChild(deleteBtn);
      todoDisplay.appendChild(todolist);
    });
  } catch (e) {
    console.error("Failed to fetch todos:", e);
  }
}

async function completeTask(id) {
  try {
    const data = await axios.post(
      "http://localhost:3000/done",
      { id: id },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    if (data.status === 200) {
      alert("Todo marked as complete");
      displayTodo(); // better UX than reload
    }
  } catch (e) {
    alert("Something went wrong: " + e.message);
  }
}

async function deletetodo(id) {
  try {
    const response = await axios.delete(
      `http://localhost:3000/delete-todo/${id}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    if (response.status === 200) {
      alert("Todo deleted successfully");
      displayTodo(); // Refresh the todo list
    }
  } catch (e) {
    alert("Failed to delete todo: " + e.message);
  }
}

const form = document.querySelector(".input-box");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const todoInput = document.querySelector(".todo-input");
  const todo = todoInput.value.trim();

  if (!todo) {
    alert("Empty fields");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/add-todo",
      { todo: todo },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );

    if (response.status === 201) {
      alert("Todo created successfully");
      displayTodo();
    }
  } catch (e) {
    if (e.response && e.response.status === 400) {
      alert("Todo field is empty");
    } else {
      alert("Something went wrong: " + e.message);
    }
  }

  todoInput.value = "";
});

async function editTodo(id, oldTodo) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User not signed in");
    return;
  }

  const newTodo = prompt("Edit your todo")
  
  try {
    const response = await axios.get("http://localhost:3000/me", {
      headers: {
        token: token,
      },
    });
  }
}

async function displayProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User not signed in");
    return;
  }

  try {
    const response = await axios.get("http://localhost:3000/me", {
      headers: {
        token: token,
      },
    });

    const username =
      response.data.username ||
      response.data.name ||
      response.data.user ||
      "User";

    document.querySelector(".status").innerHTML = `Hello, ${username}`;
    displayTodo();
  } catch (e) {
    document.querySelector(".todo-input").disabled = true;
    document.querySelector(".add-todo").disabled = true;
    document.querySelector(".add-todo").style.pointerEvents = "none";
    document.querySelector(".add-todo").style.backgroundColor = "grey";
    document.querySelector(".logout-btn").innerHTML = "Main Page";
    document.querySelector(".logout-btn").setAttribute("href", "../index.html");
  }
}

document.querySelector(".logout-btn").addEventListener("click", (event) => {
  event.preventDefault();
  localStorage.removeItem("token");
  alert("User logged out successfully");
  window.location.href = "../home/index.html";
});

window.onload = displayProfile();
