const form = document.querySelector(".signup-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const errorSection = document.querySelector(".error-message");

  try {
    const response = axios.post("http://localhost:3000/signup", {
      username: username,
      password: password,
    });

    if (username.length > 10 || password.length <= 6) {
      errorSection.innerHTML = "username limit 10 and password minimum 6";
      return;
    }

    const { data, status } = response;

    if (status === 201) {
      alert(data.message);
    }
    form.style.display = "none";
    document.querySelector(".result-div").style.display = "block";
  } catch (e) {
    if (error.response) {
      if (error.response.status === 409) {
        errorSection.innerHTML = "User already exist";
      } else if (error.response.status === 400) {
        errorSection.innerHTML = "Empty input fields";
      } else {
        errorSection.innerHTML = "Server error";
      }
      document.querySelector("#username").value = "";
      document.querySelector("#password").value = "";
    } else {
      alert("Some error happen" + error.message);
      document.querySelector("#username").value = "";
      document.querySelector("#password").value = "";
    }
  }
});
