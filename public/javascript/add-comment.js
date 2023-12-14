// new comment.js
async function newFormHandler(event) {
  event.preventDefault();

  const comment_text = document.getElementById("comment_text").value;
  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  const response = await fetch(`/api/comments/add-comment/${post_id}`, {
    method: "POST",
    body: JSON.stringify({
      comment_text,
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
  .getElementById("add-comment-form")
  .addEventListener("submit", newFormHandler);
