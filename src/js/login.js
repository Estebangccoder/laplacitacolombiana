const container = document.querySelector(".login-container");
const btnSignIn = document.getElementById("btn-sign-in");
const btnSignUp = document.getElementById("btn-sign-up");

if (btnSignIn && btnSignUp) {
  btnSignIn?.addEventListener("click", () => {
    container.classList.remove("toggle");
  });
  btnSignUp?.addEventListener("click", () => {
    container.classList.add("toggle");
  });

  document.addEventListener("DOMContentLoaded", () => {
    const canasta = document.querySelectorAll('.carrito-button');
    canasta.forEach(element => {
      element.classList.add('d-none');
    });
  });
}


document.addEventListener('DOMContentLoaded', () => { // esperar DOM listo
  // Toggle del UI
  const container = document.querySelector('.login-container');
  const btnSignIn = document.getElementById('btn-sign-in');
  const btnSignUp = document.getElementById('btn-sign-up');
  btnSignIn?.addEventListener('click', () => container?.classList.remove('toggle'));
  btnSignUp?.addEventListener('click', () => container?.classList.add('toggle'));

  //Toggle password
  const inputPass = document.getElementById("loginPass");
  const inputPass2 = document.getElementById("regPass");
  const togglePass = document.getElementById("toggle-pass");
  const togglePass2 = document.getElementById("toggle-pass-2");

  togglePass.addEventListener("click", () => {
    if (inputPass.type === "password") {
      inputPass.type = "text"; // muestra caracteres
      togglePass.innerHTML = `<i class="bi bi-eye-slash text-black fs-3"></i>`;
    } else {
      inputPass.type = "password"; // muestra puntos
      togglePass.innerHTML = `<i class="bi bi-eye text-black fs-3"></i>`;
    }
  });

  togglePass2.addEventListener("click", () => {
    if (inputPass2.type === "password") {
      inputPass2.type = "text"; // muestra caracteres
      togglePass2.innerHTML = `<i class="bi bi-eye-slash text-black fs-3"></i>`;
    } else {
      inputPass2.type = "password"; // muestra puntos
      togglePass2.innerHTML = `<i class="bi bi-eye text-black fs-3"></i>`;
    }
  });

  // Helpers de localStorage
  const LS_KEYS = { USERS: 'users', CURRENT: 'currentUser' }; // claves
  const getUsers = () => JSON.parse(localStorage.getItem(LS_KEYS.USERS) || '[]');
  const saveUsers = (users) => localStorage.setItem(LS_KEYS.USERS, JSON.stringify(users));
  const setCurrentUser = (u) => localStorage.setItem(LS_KEYS.CURRENT, JSON.stringify({ name: u.name, rol: u.rol }));
  const getCurrentUser = () => JSON.parse(localStorage.getItem(LS_KEYS.CURRENT) || 'null');
  const clearCurrentUser = () => localStorage.removeItem(LS_KEYS.CURRENT);

  // Registro
  const formRegister = document.getElementById('form-register');
  liveValidationsRegister(inputsRegister())
  // Elementos del formulario
  const phoneField = document.getElementById('mobile_code');
  const iti = window.intlTelInput(phoneField, {
    initialCountry: "co",                // Colombia
    separateDialCode: true,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // opcional, para formateo/validación
  });

  formRegister?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const invalidText = document.querySelectorAll('.invalid-feedback')
    invalidText.forEach(text => {
      text.remove();
    });

    if (!validateFormRegister(inputsRegister())) {
      Swal.fire({
        icon: "error",
        title: "Hay campos incorrectos",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    const userData = {
      nombre: document.getElementById("regName").value,
      apellido: document.getElementById("regLastName").value,
      email: document.getElementById("regEmail").value,
      password: document.getElementById("regPass").value,
      telefono: document.getElementById("mobile_code").value,
      rol: { "id": 2 }
    };

    try {
      const data = await crearUsuario(userData);
      Swal.fire({
        title: 'Registro exitoso',
        text: 'Redirigiendo al catálogo...',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.href = '../pages/catalogo.html';
      });
    } catch (error) {
      console.error("=== ERROR COMPLETO ===");
      console.log("error.status:", error.status);
      console.log("error.errors:", error.errors);
      console.log("error.message:", error.message);
      console.log("typeof error:", typeof error);
      console.log("error completo:", error);

      if (error.status === 400 && error.errors) {
        console.log("ENTRANDO A VALIDACION 400");
        handleValidationErrors(error.errors);

        Swal.fire({
          icon: "error",
          title: "Error de validación",
          text: "Revisa los campos marcados en rojo",
          showConfirmButton: true,
        });
      } else {
        console.log("ENTRANDO A ERROR GENERICO");
        Swal.fire({
          icon: "error",
          title: "Error al registrar",
          text: error.message || "No se pudo completar el registro. Inténtalo de nuevo.",
          showConfirmButton: true,
        });
      }
    }
  });

  // Login (este bloque faltaba)
  const API_URL = 'http://localhost:8080/auth';
  const formLogin = document.getElementById('form-login');
  formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const current = JSON.parse(localStorage.getItem('currentUser') || 'null'); // [4]
    if (current) {
      Swal.fire({
        title: 'Hay una sesión activa',
        text: 'Redirigiendo al catálogo...',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {
        window.location.href = '../pages/catalogo.html';
      });
      return
    }

    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPass').value;

    // Validaciones básicas
    if (!email || !password) {
      return Swal.fire({ icon: 'warning', title: 'Complete todos los campos' });
    }

    login({ email, password })
      .then(data => {
        if (data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Error en el login',
            text: data.message
          });
          return;
        }

        const token = data.token;
        const usuarioNombre = data.usuario;
        const usuarioID = data.id;
        const usuarioRol = data.rolID;
        localStorage.setItem('jwt', token);
        localStorage.setItem('UID', usuarioID);
        setCurrentUser({ name: usuarioNombre, rol: usuarioRol });
        Swal.fire({
          icon: 'success',
          title: `Bienvenido, ${usuarioNombre}`,
          confirmButtonText: 'Aceptar'
        }).then(() => {
          if (usuarioRol === 1) {
            window.location.href = '/src/pages/dashboard.html';
          } else {
            window.location.href = '/src/pages/catalogo.html';
          }
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: error.message
        });
      });
  })


  //   setCurrentUser(user);
  // Swal.fire({
  //   icon: 'success',
  //   title: `Bienvenido, ${user.name}`,
  //   confirmButtonText: 'Aceptar'
  // }).then(() => {
  //   if (getCurrentUser().rol == 'usuario') {
  //     window.location.href = '/src/pages/catalogo.html';
  //   } else if (getCurrentUser().rol == 'admin') {
  //     window.location.href = '/src/pages/dashboard.html';
  //   }
  // });

});

// Función para mostrar campo válido
function setValid(field) {
  field.classList.remove('is-invalid');
  field.classList.add('is-valid');

  if (field.id == 'mobile_code') {
    const feedback = field.parentNode.parentNode.querySelector('.invalid-feedback');
    if (feedback) feedback.style.display = 'none';
  } else {
    const feedback = field.parentNode.nextElementSibling.querySelector('.invalid-feedback');
    if (feedback) feedback.style.display = 'none';
  }
}

// Función para mostrar campo inválido
function setInvalid(field, message) {
  field.classList.remove('is-valid');
  field.classList.add('is-invalid');

  const validFeedback = field.parentNode.querySelector('.valid-feedback');
  if (validFeedback) validFeedback.style.display = 'none';

  if (field.id == 'mobile_code') {
    let feedback = field.parentNode.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.classList.add('invalid-feedback');
      field.parentNode.after(feedback);
    }
    feedback.textContent = message;
    feedback.style.display = 'block';
  } else {
    let feedback = field.parentNode.nextElementSibling;
    if (feedback.classList.contains('invalid-feedback')) feedback.remove();

    feedback = document.createElement('div');
    feedback.classList.add('invalid-feedback');
    field.parentNode.insertAdjacentElement('afterend', feedback);

    feedback.textContent = message;
    feedback.style.display = 'block';
  }
}

function inputsRegister() {
  const inputs = {
    'form': document.getElementById('form-register'),
    'nombre': document.getElementById('regName'),
    'apellido': document.getElementById('regLastName'),
    'email': document.getElementById('regEmail'),
    'telefono': document.getElementById('mobile_code'),
    'password': document.getElementById('regPass'),
    'nameRegex': /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
    'emailRegex': /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'phoneRegex': /^[\d\s\-\+\(\)]{10,}$/,
    'passRegex': /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{6}$/
  }
  return inputs;
}

// Validar todo el formulario
function validateFormRegister(inputsFields) {
  const inputs = inputsFields;
  const validations = [
    validateName(inputs['nombre'], inputs['nameRegex']),
    validateName(inputs['apellido'], inputs['nameRegex']),
    validateEmail(inputs['email'], inputs['emailRegex']),
    validatePhone(inputs['telefono'], inputs['phoneRegex']),
    validateRegPass(inputs['password'], inputs['passRegex'])
  ];
  return validations.every(validation => validation === true);
}

// Validaciones en vivo
function liveValidationsRegister(inputsFields) {
  const inputs = inputsFields;

  inputs['nombre'].addEventListener('blur', function () { validateName(inputs['nombre'], inputs['nameRegex']) });
  inputs['nombre'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateName(inputs['nombre'], inputs['nameRegex']);
    }
  });

  inputs['apellido'].addEventListener('blur', function () { validateName(inputs['apellido'], inputs['nameRegex']) });
  inputs['apellido'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateName(inputs['apellido'], inputs['nameRegex']);
    }
  });

  inputs['email'].addEventListener('blur', () => { validateEmail(inputs['email'], inputs['emailRegex']) });
  inputs['email'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateEmail(inputs['email'], inputs['emailRegex']);
    }
  });

  inputs['telefono'].addEventListener('blur', () => { validatePhone(inputs['telefono'], inputs['phoneRegex']) });
  inputs['telefono'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validatePhone(inputs['telefono'], inputs['phoneRegex']);
    }
  });

  inputs['password'].addEventListener('blur', () => { validateRegPass(inputs['password'], inputs['passRegex']) });
  inputs['password'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateRegPass(inputs['password'], inputs['passRegex']);
    }
  });
}

// Validación de nombre producto
function validateName(field, regex) {
  const value = field.value.trim();
  if (value === '') {
    setInvalid(field, 'El nombre del producto es obligatorio');
    return false;
  } else if (!regex.test(value)) {
    setInvalid(field, 'El nombre del producto debe tener al menos 2 caracteres y solo letras');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

// Validación de email
function validateEmail(field, regex) {
  const value = field.value.trim();
  if (value === '') {
    setInvalid(field, 'El correo electrónico es obligatorio');
    return false;
  } else if (!regex.test(value)) {
    setInvalid(field, 'Por favor ingresa un correo válido');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

// Validación de teléfono
function validatePhone(field, regex) {
  const value = field.value.trim();
  if (value === '') {
    setInvalid(field, 'El teléfono es obligatorio');
    return false;
  } else if (!regex.test(value)) {
    setInvalid(field, 'Teléfono debe tener al menos 10 dígitos');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

// Validación de password register
function validateRegPass(field, regex) {
  const value = field.value.trim();
  if (value === '') {
    setInvalid(field, 'La contraseña es obligatoria');
    return false;
  } else if (!regex.test(value)) {
    setInvalid(field, `La contraseña debe ser exactamente de 6 caracteres. \nAl menos una mayuscula, al menos un dígito, al menos un caracter especial`);
    return false;
  } else {
    setValid(field);
    return true;
  }
}

// Agregar esta función en tu archivo login.js
function handleValidationErrors(errors) {
  console.log("Procesando errores:", errors);

  const fieldMapping = {
    'nombre': 'regName',
    'apellido': 'regLastName',
    'email': 'regEmail',
    'password': 'regPass',
    'telefono': 'mobile_code'
  };

  Object.entries(errors).forEach(([fieldName, message]) => {
    console.log(`Campo: ${fieldName}, Error: ${message}`);

    const fieldId = fieldMapping[fieldName];
    if (fieldId) {
      const field = document.getElementById(fieldId);
      if (field) {
        setInvalid(field, message);
        console.log(`Aplicando error a campo ${fieldId}: ${message}`);
      } else {
        console.warn(`Campo con ID '${fieldId}' no encontrado`);
      }
    }
  });
}