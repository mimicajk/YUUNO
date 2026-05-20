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
    // REGISTRO
    // =============================

    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const username = registerForm.querySelector("input[type='text']").value;
            const email = registerForm.querySelector("input[type='email']").value;
            const password = registerForm.querySelector("input[type='password']").value;

            const user = {
                username,
                email,
                password
            };

            localStorage.setItem("yuunoUser", JSON.stringify(user));

            alert("Cuenta creada correctamente ✅");

            window.location.href = "login.html";
        });
    }

    // =============================
    // LOGIN
    // =============================

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = loginForm.querySelector("input[type='email']").value;
            const password = loginForm.querySelector("input[type='password']").value;

            const savedUser = JSON.parse(localStorage.getItem("yuunoUser"));

            if (!savedUser) {
                alert("No existe una cuenta registrada.");
                return;
            }

            if (email === savedUser.email && password === savedUser.password) {

                localStorage.setItem("yuunoSession", "active");

                alert("Bienvenido " + savedUser.username + " 🚀");

                window.location.href = "home.html";

            } else {
                alert("Correo o contraseña incorrectos ❌");
            }
        });
    }

});
