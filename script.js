const API_URL = "https://yuuno-backend-mimicajk.onrender.com/api";

document.addEventListener("DOMContentLoaded", function () {

    const token = localStorage.getItem("yuunoToken");

    // =============================
    // LOGIN & REGISTER (si existen)
    // =============================

    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const username = registerForm.querySelector("input[type='text']").value;
            const email = registerForm.querySelector("input[type='email']").value;
            const password = registerForm.querySelector("input[type='password']").value;

            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Cuenta creada ✅");
            window.location.href = "login.html";
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = loginForm.querySelector("input[type='email']").value;
            const password = loginForm.querySelector("input[type='password']").value;

            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("yuunoToken", data.token);
            localStorage.setItem("yuunoUser", JSON.stringify(data.user));

            window.location.href = "home.html";
        });
    }

    // =============================
    // HOME
    // =============================

    if (window.location.pathname.includes("home.html")) {

        if (!token) {
            window.location.href = "login.html";
            return;
        }

        cargarPosts();
    }
});


// =============================
// CREAR POST
// =============================

async function crearPost() {
    const token = localStorage.getItem("yuunoToken");
    const content = document.getElementById("postInput").value.trim();

    if (!content) return;

    const response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ content }),
    });

    const newPost = await response.json();
    document.getElementById("postInput").value = "";

    agregarPost(newPost);
}


// =============================
// CARGAR POSTS
// =============================

async function cargarPosts() {
    const token = localStorage.getItem("yuunoToken");

    const response = await fetch(`${API_URL}/posts`, {
        headers: {
            "Authorization": "Bearer " + token,
        },
    });

    const posts = await response.json();

    const feed = document.getElementById("feed");
    feed.innerHTML = "";

    posts.forEach(post => agregarPost(post));
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
// LIKE SIN REFRESH REAL
// =============================

async function toggleLike(postId) {

    const token = localStorage.getItem("yuunoToken");
    const postElement = document.querySelector(`[data-id="${postId}"]`);
    const likeBtn = postElement.querySelector(".like-btn");
    const emoji = likeBtn.querySelector(".emoji");
    const likeCount = likeBtn.querySelector(".like-count");

    const isLiked = likeBtn.classList.contains("liked");
    let count = parseInt(likeCount.textContent);

    // ✅ CAMBIO INMEDIATO
    if (isLiked) {
        likeBtn.classList.remove("liked");
        emoji.textContent = "🤍";
        likeCount.textContent = count - 1;
    } else {
        likeBtn.classList.add("liked");
        emoji.textContent = "❤️";
        likeCount.textContent = count + 1;
    }

    // ✅ BACKEND EN SEGUNDO PLANO
    await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token,
        },
    });
}