async function displayTodo() {
  const responseWithTodo = await axios.get("http://localhost:3000/todos", {
    Headers: {
      token: localStorage.getItem("token"),
    },
  });

  const todoDisplay = document.querySelector(".todo-container");
  todoDisplay.innerHTML = "";

  responseWithTodo.data.forEach((items) => {
    const id = items.id;
    const todo = items.todo;

    const todolist = document.createElement("div");
    todolist.classList.add(".todo-list");

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.classList.add(".checkbox");
    checkBox.addEventListener("click", () => complete(id));

    const todoText = document.createTextNode(todo);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "delete";
    deleteBtn.classList.add(".delete");
    deleteBtn.addEventListener("click", () => delete id);

    if (items.complete === true) {
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
}
