// Login form handler
async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (email && password) {
    const response = await fetch("/api/users/login", {
      method: "post",
      loggedIn: true,
      body: JSON.stringify({
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      let result = await response.json();
      alert(result.message);
    }
  }
}

document
  .getElementById("login-form")
  .addEventListener("submit", loginFormHandler);
