
        // Funksioni për të fshehur/shfaqur fjalëkalimin
        function togglePasswordVisibility(inputId, icon) {
            const input = document.getElementById(inputId);
            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        }

        // Menaxhimi i dërgimit të formës
        function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById("loginEmail").value;
            console.log("Tentim kyçjeje me:", email);
            // Këtu mund të shtosh redirect-in pas login-it të suksesshëm:
            // window.location.href = "dashboard.html";
            return false;
        }
    