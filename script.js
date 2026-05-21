const API_URL = "https://yuuno-backend-mimicajk.onrender.com/api";

let loadedPostIds = new Set();

document.addEventListener("DOMContentLoaded", () => {

    // =============================
    // VERIFICAR SESIÓN
    // =============================
    const usuario = localStorage.getItem("yuunoUser");

    if (
        !usuario &&
        window.location.pathname.includes("home.html")
    ) {
        window.location.href = "login.html";
    }

    // =============================
    // CARGAR POSTS
    // =============================
    if (window.location.pathname.includes("home.html")) {

        cargarPosts();

        setInterval(() => {
            actualizarFeed();
        }, 5000);

    }

    // =============================
    // LOGIN
    // =============================
    const loginForm = document.getElementById("loginForm");

    if(loginForm){

        loginForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const email = document.querySelector('input[type="email"]').value;

            const password = document.querySelector('input[type="password"]').value;

            if(email && password){

                // guardar sesión
                localStorage.setItem("yuunoUser", email);

                // entrar a la app
                window.location.href = "home.html";

            } else {

                alert("Completa los campos");

            }

        });

    }

    // =============================
    // LOGOUT
    // =============================
    const logoutBtn = document.getElementById("logoutBtn");

    if(logoutBtn){

        logoutBtn.addEventListener("click", () => {

            localStorage.removeItem("yuunoUser");

            localStorage.removeItem("yuunoToken");

            window.location.href = "login.html";

        });

    }

});

// =============================
// CREAR POST
// =============================
async function crearPost() {

    const token = localStorage.getItem("yuunoToken");

    const input = document.getElementById("postInput");

    const content = input.value.trim();

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

        input.value = "";

        insertarPost(newPost);

        loadedPostIds.add(newPost._id);

    } catch {

        alert("Error creando post");

    }

}

// =============================
// CARGAR POSTS
// =============================
async function cargarPosts() {

    const token = localStorage.getItem("yuunoToken");

    const response = await fetch(`${API_URL}/posts`, {
        headers: {
            "Authorization": "Bearer " + token
        },
    });

    const posts = await response.json();

    const feed = document.getElementById("feed");

    if(!feed) return;

    feed.innerHTML = "";

    posts.forEach(post => {

        insertarPost(post);

        loadedPostIds.add(post._id);

    });

}

// =============================
// ACTUALIZAR FEED
// =============================
async function actualizarFeed() {

    const token = localStorage.getItem("yuunoToken");

    const response = await fetch(`${API_URL}/posts`, {
        headers: {
            "Authorization": "Bearer " + token
        },
    });

    const posts = await response.json();

    posts.forEach(post => {

        if (!loadedPostIds.has(post._id)) {

            insertarPost(post);

            loadedPostIds.add(post._id);

        }

    });

}

// =============================
// INSERTAR POST
// =============================
function insertarPost(post) {

    const feed = document.getElementById("feed");

    if(!feed) return;

    // usuario actual
    const currentUser = localStorage.getItem("yuunoUser");

    // likes temporales
    const liked = false;

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

        <div class="post-content">
            ${post.content}
        </div>

        <div class="post-actions">

            <div class="post-action like-btn ${liked ? "liked" : ""}">

                <span class="emoji">
                    ${liked ? "❤️" : "🤍"}
                </span>

                <span class="like-count">
                    ${post.likes.length}
                </span>

            </div>

        </div>
    `;

    const likeBtn = postElement.querySelector(".like-btn");

    likeBtn.addEventListener("click", () => toggleLike(post._id));

    feed.prepend(postElement);

}

// =============================
// LIKE
// =============================
async function toggleLike(postId) {

    const token = localStorage.getItem("yuunoToken");

    const postElement = document.querySelector(`[data-id="${postId}"]`);

    const likeBtn = postElement.querySelector(".like-btn");

    const emoji = likeBtn.querySelector(".emoji");

    const likeCount = likeBtn.querySelector(".like-count");

    const isLiked = likeBtn.classList.contains("liked");

    let count = parseInt(likeCount.textContent);

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
                "Authorization": "Bearer " + token
            },
        });

    } catch {}

}