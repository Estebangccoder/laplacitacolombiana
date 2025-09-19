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

  // Hash SHA-256 (protegido)
  async function trySha256(text) {
    if (window.crypto?.subtle) {
      const data = new TextEncoder().encode(text);
      const buf = await crypto.subtle.digest('SHA-256', data);
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return null; // sin soporte => devolvemos null para usar fallback
  }


  // Event listeners para validación en tiempo real
  [inputPass, inputPass2].forEach(input => {

    input.addEventListener('blur', () => {
      const msg = document.querySelectorAll('.invalid-feedback');
      msg.forEach(m => {
        if (input.value.length != 6) {
          m.classList.remove('d-none');
          m.classList.add('d-block');
        }
        if (input.value.length == 6) {
          m.classList.remove('d-block');
          m.classList.add('d-none');
        }
      });
    });

    input.addEventListener('input', () => {
      const msg = document.querySelectorAll('.invalid-feedback');
      msg.forEach(m => {
        if (input.value.length != 6) {
          m.classList.remove('d-none');
          m.classList.add('d-block');
        }
        if (input.value.length == 6) {
          m.classList.remove('d-block');
          m.classList.add('d-none');
        }
      });
    });
  });

  // Registro
  const formRegister = document.getElementById('form-register');
  formRegister?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim().toLowerCase();
    const pass = document.getElementById('regPass').value;

    if (!name || !email || !pass) {
      return Swal.fire({ icon: 'warning', title: 'Complete todos los campos' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Swal.fire({ icon: 'warning', title: 'Correo inválido' });
    }
    if (pass.length != 6) {
      return Swal.fire({ icon: 'warning', title: 'La contraseña debe tener 6 caracteres' });
    }

    const users = getUsers();
    if (users.some(u => u.email === email)) {
      return Swal.fire({ icon: 'error', title: 'Ese correo ya está registrado' });
    }

    const passHash = await trySha256(pass); // puede ser null si no hay soporte
    const newUser = {
      id: Date.now(),
      name,
      email,
      passHash: passHash,         // si hay hash, se usa
      passPlain: passHash ? null : pass, // si no hay hash, guardamos plano (solo pruebas)
      rol: 'usuario'
    };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    Swal.fire({
      title: 'Registro exitoso',
      text: 'Sesión iniciada',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    }).then(() => {
      if (getCurrentUser().rol == 'usuario') {
        window.location.href = '/src/pages/catalogo.html';
      } else if (getCurrentUser().rol == 'admin') {
        window.location.href = '/src/pages/dashboard.html';
      }
    });
  });

  // Login (este bloque faltaba)
  const API_URL = 'http://localhost:8080/auth';
  const formLogin = document.getElementById('form-login');
  formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();
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
        setCurrentUser({name: usuarioNombre, rol: usuarioRol});
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