const API_URL = "https://yuuno-backend-mimicajk.onrender.com/api";

document.addEventListener("DOMContentLoaded", function () {

    // =============================
    // TYPEWRITER LOOP
    // =============================

    const text = "Connect, share and discover your vibe in a new modern social experience.";
    const typingElement = document.querySelector(".typing-text");

    if (typingElement) {
        let index = 0;
        let isDeleting = false;

        function typeLoop() {
            if (!isDeleting) {
                typingElement.textContent = text.substring(0, index);
                index++;
                if (index > text.length) {
                    setTimeout(() => isDeleting = true, 5000);
                }
            } else {
                typingElement.textContent = text.substring(0, index);
                index--;
                if (index < 0) {
                    isDeleting = false;
                    index = 0;
                }
            }
            setTimeout(typeLoop, isDeleting ? 35 : 45);
        }

        typeLoop();
    }

    // =============================
    // REGISTRO
    // =============================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const username = registerForm.querySelector("input[type='text']").value;
            const email = registerForm.querySelector("input[type='email']").value;
            const password = registerForm.querySelector("input[type='password']").value;

            try {
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

                alert("Cuenta creada correctamente ✅");
                window.location.href = "login.html";

            } catch (error) {
                alert("Error conectando con el servidor");
            }
        });
    }

    // =============================
    // LOGIN
    // =============================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = loginForm.querySelector("input[type='email']").value;
            const password = loginForm.querySelector("input[type='password']").value;

            try {
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

                alert("Login exitoso ✅");
                window.location.href = "home.html";

            } catch (error) {
                alert("Error conectando con el servidor");
            }
        });
    }

});

// =============================
// CREAR POST
// =============================

async function crearPost() {
    const token = localStorage.getItem("yuunoToken");
    const postInput = document.getElementById("postInput");
    const content = postInput.value.trim();

    if (!content) {
        alert("Escribe algo antes de publicar");
        return;
    }

    try {
        await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({ content }),
        });

        postInput.value = "";
        cargarPosts();

    } catch (error) {
        alert("Error creando post");
    }
}

// =============================
// CARGAR POSTS
// =============================

let currentUserId = null;

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

        if (!currentUserId) {
            const user = JSON.parse(localStorage.getItem("yuunoUser"));
            if (user) currentUserId = user.id;
        }

        posts.forEach(post => {
            const liked = post.likes.some(
                id => id.toString() === currentUserId
            );

            const postElement = document.createElement("div");
            postElement.classList.add("post");

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
                    <div class="post-action like-btn ${liked ? 'liked' : ''}" 
                         data-id="${post._id}" 
                         onclick="toggleLike('${post._id}')">
                        ${liked ? '❤️' : '🤍'} 
                        <span class="like-count">${post.likes.length}</span>
                    </div>
                </div>
            `;

            feed.appendChild(postElement);
        });

    } catch (error) {
        console.log("Error cargando posts");
    }
}

// =============================
// TOGGLE LIKE (SIN REFRESH)
// =============================

async function toggleLike(postId) {
    const token = localStorage.getItem("yuunoToken");

    try {
        const response = await fetch(`${API_URL}/posts/${postId}/like`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token,
            },
        });

        const data = await response.json();
        if (!response.ok) return;

        const likeBtn = document.querySelector(`.like-btn[data-id="${postId}"]`);
        const likeCount = likeBtn.querySelector(".like-count");

        if (likeBtn.classList.contains("liked")) {
            likeBtn.classList.remove("liked");
            likeBtn.innerHTML = `🤍 <span class="like-count">${data.totalLikes}</span>`;
        } else {
            likeBtn.classList.add("liked");
            likeBtn.innerHTML = `❤️ <span class="like-count">${data.totalLikes}</span>`;
        }

    } catch (error) {
        console.log("Error al procesar like");
    }
}

// =============================
// CARGAR POSTS EN HOME
// =============================

if (window.location.pathname.includes("home.html")) {
    cargarPosts();
}