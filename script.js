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
                    setTimeout(() => {
                        isDeleting = true;
                    }, 5000);
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
    // REGISTRO REAL (BACKEND)
    // =============================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const username = registerForm.querySelector("input[type='text']").value;
            const email = registerForm.querySelector("input[type='email']").value;
            const password = registerForm.querySelector("input[type='password']").value;

            try {
                const response = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
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
    // LOGIN REAL (BACKEND + JWT)
    // =============================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const email = loginForm.querySelector("input[type='email']").value;
            const password = loginForm.querySelector("input[type='password']").value;

            try {
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message);
                    return;
                }

                // Guardar token y usuario
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