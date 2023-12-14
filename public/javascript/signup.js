// Sign up form handler
async function signupFormHandler(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username && email && password) {
    const response = await fetch("/signup", {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      alert("Account created! Logging you in now.");
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
}

document
  .getElementById("signup-form")
  .addEventListener("submit", signupFormHandler);
