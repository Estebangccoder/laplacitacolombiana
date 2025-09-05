const container = document.querySelector(".container");
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

/*const btn = document.getElementById("btn");
const container = document.querySelector(".container");

btn.addEventListener("click",()=>{
    container.classList.toggle("toggle");
})*/

// --- utilidades de localStorage ---

document.addEventListener('DOMContentLoaded', () => { // esperar DOM listo
  // Toggle del UI
  const container = document.querySelector('.container');
  const btnSignIn = document.getElementById('btn-sign-in');
  const btnSignUp = document.getElementById('btn-sign-up');
  btnSignIn?.addEventListener('click', () => container?.classList.remove('toggle'));
  btnSignUp?.addEventListener('click', () => container?.classList.add('toggle'));

  // Helpers de localStorage
  const LS_KEYS = { USERS: 'users', CURRENT: 'currentUser' }; // claves
  const getUsers = () => JSON.parse(localStorage.getItem(LS_KEYS.USERS) || '[]');
  const saveUsers = (users) => localStorage.setItem(LS_KEYS.USERS, JSON.stringify(users));
  const setCurrentUser = (u) => localStorage.setItem(LS_KEYS.CURRENT, JSON.stringify({ email: u.email, name: u.name, rol: u.rol }));
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
    if (pass.length < 6) {
      return Swal.fire({ icon: 'warning', title: 'La contraseña debe tener al menos 6 caracteres' });
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
      if(getCurrentUser().rol == 'usuario') {
      window.location.href = '../pages/catalogo.html';
      } else if(getCurrentUser().rol == 'admin') {
        window.location.href = '../pages/dashboard.html';
      }
    });
  });

  // Login (este bloque faltaba)
  const formLogin = document.getElementById('form-login');
  formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const pass = document.getElementById('loginPass').value;

    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return Swal.fire({ icon: 'error', title: 'Usuario no encontrado' });
    }

    let ok = false;
    if (user.passHash && window.crypto?.subtle) {
      const hex = await trySha256(pass);
      ok = (hex === user.passHash);
    } else {
      ok = (user.passPlain === pass); // fallback solo para desarrollo
    }

    if (!ok) {
      return Swal.fire({ icon: 'error', title: 'Contraseña incorrecta' });
    }

    setCurrentUser(user);
    Swal.fire({
      icon: 'success',
      title: `Bienvenido, ${user.name}`,
      confirmButtonText: 'Aceptar'
    }).then(() => {
      if(getCurrentUser().rol == 'usuario') {
      window.location.href = '../pages/catalogo.html';
      } else if(getCurrentUser().rol == 'admin') {
        window.location.href = '../pages/dashboard.html';
      }
    });
  });
});