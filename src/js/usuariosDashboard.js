
function loadSectionUsuarios(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");

  if (section === "ver-usuarios") {
    breadcrumb.textContent = "Dashboards / Gestión de usuarios / Ver usuarios";

    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No hay token disponible');
      // Redirige al login si no hay token
      window.location.href = '/src/pages/login.html';
      return;
    }

    // Mostrar loading mientras carga
    content.innerHTML = `
            <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Cargando usuarios...</span>
                </div>
            </div>
        `;
    // Llamar a obtener usuarios y mostrar resultados
    obtenerUsuarios()
      .then(usuarios => {
        if (usuarios) {
          mostrarUsuarios(usuarios);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        content.innerHTML = '<div class="alert alert-danger">Error al cargar usuarios</div>';
      });

  } else {
    breadcrumb.textContent = `Dashboards / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }
}

// Función para obtener usuarios (corregida)
async function obtenerUsuarios() {
  const content = document.getElementById("main-content");
  try {
    const token = localStorage.getItem('jwt'); // Mismo nombre

    if (!token) {
      console.error('No hay token disponible');
      window.location.href = '/src/pages/login.html';
      return null;
    }

    const response = await fetch('http://localhost:8080/api/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const usuarios = await response.json();
      return usuarios;
    } else if (response.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('jwt'); // Limpiar todo el localStorage
      alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      window.location.href = '/src/pages/login.html';
      return null;
    } else {
      throw new Error(`Error: ${response.status}`);
    }
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    content.innerHTML = "<p>Error al cargar la lista de usuarios.</p>";
    throw error;
  }
}

function mostrarUsuarios(usuarios) {
  const content = document.getElementById("main-content");

  if (usuarios.length === 0) {
    content.innerHTML = `
          <h3>Lista de usuarios</h3>
          <p>No hay usuarios registrados.</p>
        `;

  } else {
    content.innerHTML = `
        <h3 class="mb-5">Lista de usuarios</h3>
        <table id="tabla-usuarios" class="table table-hover">
          <thead>
            <tr class="table-primary">
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Ciudad</th>
              <th>Departamento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${usuarios.map(p =>
      `
              <tr>
                <td>${p.nombre}</td>
                <td>${p.apellido}</td>
                <td>${p.telefono}</td>
                <td>${p.email}</td>
                <td>${p.ciudad}</td>
                <td>${p.departamento}</td>
                <td>
                  <button type="button" class="btn btn-success" onclick="editarProducto(${p.id})">
                    <i class="bi bi-pen"></i>
                  </button>
                  <button type="button" class="btn btn-danger" onclick="eliminarProducto(${p.id})">
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

    new DataTable("#tabla-usuarios", {
      responsive: true,
      autoWidth: false,
      language: {
        decimal: "",
        emptyTable: "No hay información",
        info: "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
        infoEmpty: "Mostrando 0 a 0 de 0 Entradas",
        infoFiltered: "(Filtrado de _MAX_ total entradas)",
        thousands: ",",
        lengthMenu: "Mostrar _MENU_ Entradas",
        loadingRecords: "Cargando...",
        processing: "Procesando...",
        search: "Buscar:",
        zeroRecords: "Sin resultados encontrados",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        }
      }
    });
  }
}


// const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
// if (current && current.rol === 'admin') {
  window.loadSectionUsuarios = loadSectionUsuarios;
// } else {
//   const content = document.getElementById("body-dashboard");
//   content.innerHTML = '';
//   content.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');
//   content.innerHTML = `
//     <h3 class="mt-5">ACCESO NO AUTORIZADO</h3>
//     <p>Redirigiendo a La Placita Colombiana</p>
//     <div class="spinner-border" role="status">
//       <span class="visually-hidden">Cargando...</span>
//     </div>
//   `
//   setTimeout(() => {
//     window.location.href = '/src/pages/login.html';
//   }, 1000);
// }

// window.addEventListener("storage", () => {
//     const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
//     if (!current || current.rol !== 'admin') {
//         window.location.href = '/src/pages/login.html';
//     }
// });

// window.addEventListener("pagehide", () => {
//   localStorage.removeItem("currentUser");
// });






