const form = document.querySelector(".signin-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  const errorSection = document.querySelector(".error-message");

  try {
    const response = await axios.post("http://localhost:3000/signin", {
      username,
      password,
    });

    const { data, status } = response;

    if (status === 200) {
      localStorage.setItem("token", data.token);
      alert("User signed in successfully!!");
      // form.style.display = "none";
      document.querySelector(".container").style.display = "none";
      document.querySelector(".result-div").style.display = "block";
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        errorSection.innerHTML = "Invalid credentials.";
      } else if (error.response.status === 500) {
        errorSection.innerHTML =
          "Internal server error. Please try again later.";
      } else {
        errorSection.innerHTML = "An unexpected error occurred.";
      }
    } else if (error.request) {
      errorSection.innerHTML =
        "Failed to make a request. Please check your network.";
      document.querySelector("#username").value = "";
      document.querySelector("#password").value = "";
    } else {
      errorSection.innerHTML = "Some error occurred: " + error.message;
      document.querySelector("#username").value = "";
      document.querySelector("#password").value = "";
    }
  }
});
