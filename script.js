const API_URL = "https://yuuno-backend-mimicajk.onrender.com/api";

document.addEventListener("DOMContentLoaded", () => {

    if (window.location.pathname.includes("home.html")) {
        cargarPosts();
    }

});


// =============================
// CREAR POST
// =============================
async function crearPost() {
    const token = localStorage.getItem("yuunoToken");
    const contentInput = document.getElementById("postInput");
    const content = contentInput.value.trim();

    if (!content) return;

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({ content }),
        });

        const newPost = await response.json();

        // ✅ volver a traerlo populado desde el servidor
        const fullPostResponse = await fetch(`${API_URL}/posts`, {
            headers: {
                "Authorization": "Bearer " + token,
            },
        });

        const posts = await fullPostResponse.json();
        const postCompleto = posts.find(p => p._id === newPost._id);

        agregarPost(postCompleto);

        contentInput.value = "";

    } catch {
        alert("Error creando post");
    }
}


// =============================
// CARGAR POSTS
// =============================
async function cargarPosts() {
    const token = localStorage.getItem("yuunoToken");

    try {
        const response = await fetch(`${API_URL}/posts`, {
            headers: {
                "Authorization": "Bearer " + token,
            },
        });

        const posts = await response.json();
        const feed = document.getElementById("feed");
        feed.innerHTML = "";

        posts.forEach(post => agregarPost(post));

    } catch {
        console.log("Error cargando posts");
    }
}


// =============================
// AGREGAR POST AL DOM
// =============================
function agregarPost(post) {

    const feed = document.getElementById("feed");
    const currentUser = JSON.parse(localStorage.getItem("yuunoUser"));
    const liked = post.likes?.includes(currentUser?.id);

    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.setAttribute("data-id", post._id);

    postElement.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">
                ${post.user.username.charAt(0).toUpperCase()}
            </div>
            <div class="post-info">
                <h4>${post.user.username}</h4>
                <span>${new Date(post.createdAt).toLocaleString()}</span>
            </div>
        </div>
        <div class="post-content">${post.content}</div>
        <div class="post-actions">
            <div class="post-action like-btn ${liked ? "liked" : ""}">
                <span class="emoji">${liked ? "❤️" : "🤍"}</span>
                <span class="like-count">${post.likes.length}</span>
            </div>
        </div>
    `;

    const likeBtn = postElement.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => toggleLike(post._id));

    feed.prepend(postElement);
}


// =============================
// LIKE INSTANTÁNEO
// =============================
async function toggleLike(postId) {

    const token = localStorage.getItem("yuunoToken");
    const postElement = document.querySelector(`[data-id="${postId}"]`);
    const likeBtn = postElement.querySelector(".like-btn");
    const emoji = likeBtn.querySelector(".emoji");
    const likeCount = likeBtn.querySelector(".like-count");

    const isLiked = likeBtn.classList.contains("liked");
    let count = parseInt(likeCount.textContent);

    // ✅ UI inmediata
    if (isLiked) {
        likeBtn.classList.remove("liked");
        emoji.textContent = "🤍";
        likeCount.textContent = count - 1;
    } else {
        likeBtn.classList.add("liked");
        emoji.textContent = "❤️";
        likeCount.textContent = count + 1;
    }

    try {
        await fetch(`${API_URL}/posts/${postId}/like`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
            },
        });
    } catch {
        console.log("Error al hacer like");
    }
}