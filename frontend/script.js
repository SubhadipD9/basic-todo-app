const todoBtn = document.querySelector(".todos");

todoBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const response = await axios.get("http://localhost:3000/todos", {
      Headers: {
        token: localStorage.getItem("token"),
      },
    });
    const { status } = response;
    if (status === 201) {
      alert("Redirecting to the todos page...");
      window.location.href = "../todos/index.html";
    }
  } catch (e) {
    if (e.response.status === 403) {
      alert("User not loged in");
    }
  }
});
