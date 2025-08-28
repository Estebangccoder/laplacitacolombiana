document.getElementById("registerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const form = e.target;

  if (!form.checkValidity()) {
    alert("Por favor completa todos los campos correctamente.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!name || !phone || !email || !password || !confirmPassword) {
    alert("Por favor completa todos los campos.");
    return;
  }


  const phoneRegex = /^[0-9]{7,15}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!phoneRegex.test(phone)) {
    alert("Número de teléfono inválido.");
    return;
  }

  if (!emailRegex.test(email)) {
    alert("Correo electrónico inválido.");
    return;
  }

  if (password.length < 6) {
    alert("La contraseña debe tener al menos 6 caracteres.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden.");
    return;
  }


  const newUser = { name, phone, email, password };

  const users = JSON.parse(localStorage.getItem("ecommerce_users")) || [];
  const exists = users.some(user => user.email === email);
  if (exists) {
    alert("Este correo ya está registrado.");
    return;
  }

  users.push(newUser);
  localStorage.setItem("ecommerce_users", JSON.stringify(users));

  alert("Usuario registrado exitosamente.");
  document.getElementById("registerForm").reset();
});


function togglePassword(id, iconElement) {
  const input = document.getElementById(id);

  if (input.type === "password") {
    input.type = "text";
    iconElement.classList.remove("fa-eye");
    iconElement.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    iconElement.classList.remove("fa-eye-slash");
    iconElement.classList.add("fa-eye");
  }
}



  document.getElementById("phone").addEventListener("input", function(e) {
    this.value = this.value.replace(/[^0-9]/g, "");
  });
document.getElementById("password").addEventListener("input", function () {
  const error = document.getElementById("passwordError");
  if (this.value.length < 6) {
    error.style.display = "block";
  } else {
    error.style.display = "none";
  }
});
document.getElementById("confirmPassword").addEventListener("input", function () {
  const password = document.getElementById("password").value.trim();
  const confirmPassword = this.value.trim();
  const errorMessage = document.getElementById("error-confirmPassword");
  const icon = document.getElementById("passwordMatchIcon");

  if (confirmPassword && password === confirmPassword) {
    errorMessage.textContent = "";
    icon.style.display = "block";
  } else {
    errorMessage.textContent = confirmPassword ? "Las contraseñas no coinciden." : "";
    icon.style.display = "none";
  }
});