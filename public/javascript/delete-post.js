document.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-post-btn")) {
    const postId = event.target.dataset.postId;
    deleteFormHandler(postId);
  }
});

async function deleteFormHandler(id) {
  try {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}
