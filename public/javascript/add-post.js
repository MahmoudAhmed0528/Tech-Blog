// new post form.js
async function newFormHandler(event) {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const post_text = document.getElementById("post_text").value;

  const response = await fetch(`/api/posts/add-post`, {
    method: "POST",
    body: JSON.stringify({
      title,
      post_text,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace("/dashboard");
  } else {
    alert(response.statusText);
  }
}

document
  .getElementById("add-post-form")
  .addEventListener("submit", newFormHandler);
