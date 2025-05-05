const form = document.querySelector(".signin-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await axiox.post("http://localhost:3000/signin", {
      username: username,
      password: password,
    });

    const { data, status } = response;

    if (status === 200) {
      localStorage.setItem("token", data.token);
      alert("User signed in successfully!!");
      form.style.display = "none";
      document.querySelector(".result-div").style.display = "block";
    }
  } catch (e) {}
});
