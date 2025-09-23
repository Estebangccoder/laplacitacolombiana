// ----------------- CARGAR SECCIÓN USUARIOS -----------------
function loadSectionUsuarios(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");

  if (section === "ver-usuarios") {
    breadcrumb.textContent = "Dashboards / Gestión de usuarios / Ver usuarios";

    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No hay token disponible');
      window.location.href = '/src/pages/login.html';
      return;
    }

    // Mostrar loading
    content.innerHTML = `
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando usuarios...</span>
        </div>
      </div>
    `;

    // Cargar usuarios
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

// ----------------- OBTENER USUARIOS -----------------
async function obtenerUsuarios() {
  const content = document.getElementById("main-content");
  try {
    const token = localStorage.getItem('jwt');

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
      return await response.json();
    } else if (response.status === 401) {
      localStorage.removeItem('jwt');
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

// ----------------- MOSTRAR USUARIOS -----------------
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
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${usuarios.map(u => `
            <tr>
              <td>${u.nombre}</td>
              <td>${u.apellido}</td>
              <td>${u.telefono}</td>
              <td>${u.email}</td>
              <td>${u.rol ? u.rol.nombre : "Sin rol"}</td>
              <td>${u.estado == "NOACTIVO" ? "No activo" : "Activo"}</td>
              <td>
                <button type="button" class="btn btn-success" onclick="editarUsuario(${u.id})">
                  <i class="bi bi-pen"></i>
                </button>
                <button type="button" class="btn btn-danger" onclick="eliminarUsuario(${u.id})">
                  <i class="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    // Activar DataTable
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

// ----------------- ELIMINAR USUARIO -----------------
// async function eliminarUsuario(id) {
//   if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

//   try {
//     const token = localStorage.getItem('jwt');
//     const response = await fetch(`http://localhost:8080/api/usuarios/borrar/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (response.ok) {
//       alert("Usuario eliminado con éxito");
//       loadSectionUsuarios("ver-usuarios"); // Recargar lista
//     } else {
//       alert("Error al eliminar usuario");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     alert("Error en la conexión al servidor");
//   }
// }

async function eliminarUsuario(id) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "Este usuario será eliminado permanentemente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (!result.isConfirmed) return;

  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`http://localhost:8080/api/usuarios/borrar/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      await Swal.fire({
        title: "Eliminado",
        text: "Usuario eliminado con éxito",
        icon: "success",
        confirmButtonText: "Aceptar"
      });
      loadSectionUsuarios("ver-usuarios"); // Recargar lista
    } else {
      await Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el usuario",
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  } catch (error) {
    console.error("Error:", error);
    await Swal.fire({
      title: "Error",
      text: "Error en la conexión al servidor",
      icon: "error",
      confirmButtonText: "Aceptar"
    });
  }
}


// ----------------- EDITAR USUARIO -----------------
function editarUsuario(id) {
  const token = localStorage.getItem("jwt");

  fetch(`http://localhost:8080/api/usuarios/${id}`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(response => response.json())
    .then(usuario => {
      // Rellenar los campos del modal
      document.getElementById("editarId").value = usuario.id;
      document.getElementById("editarNombre").value = usuario.nombre;
      document.getElementById("editarApellido").value = usuario.apellido;
      document.getElementById("editarEmail").value = usuario.email;
      document.getElementById("editarTelefono").value = usuario.telefono;
      
      // Cargar roles dinámicamente
      fetch("http://localhost:8080/api/roles", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(roles => {
          const selectRol = document.getElementById("editarRol");
          selectRol.innerHTML = `<option value="">Seleccione un rol</option>`;
          roles.forEach(r => {
            selectRol.innerHTML += `
              <option value="${r.id}" ${usuario.rol && usuario.rol.id === r.id ? "selected" : ""}>
                ${r.nombre}
              </option>`;
          });
        });

      // Limpiar contraseña
      document.getElementById("editarPassword").value = "";

      // Mostrar modal
      const modal = new bootstrap.Modal(document.getElementById("modalEditarUsuario"));
      modal.show();
    })
    .catch(error => {
      console.error("Error al cargar usuario:", error);
      Swal.fire("Error", "No se pudo cargar el usuario.", "error");
    });
}

// ----------------- SUBMIT EDITAR USUARIO -----------------
document.getElementById("formEditarUsuario").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editarId").value;
  const usuarioActualizado = {
    nombre: document.getElementById("editarNombre").value,
    apellido: document.getElementById("editarApellido").value,
    email: document.getElementById("editarEmail").value,
    telefono: document.getElementById("editarTelefono").value,
    password: document.getElementById("editarPassword").value || null,
    rolId: parseInt(document.getElementById("editarRol").value)
  };

  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`http://localhost:8080/api/usuarios/editar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(usuarioActualizado)
    });

    if (response.ok) {
      Swal.fire("Éxito", "Usuario actualizado con éxito", "success");
      const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarUsuario"));
      modal.hide();
      loadSectionUsuarios("ver-usuarios"); // recargar tabla
    } else {
      Swal.fire("Error", "No se pudo actualizar el usuario", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Error en la conexión al servidor", "error");
  }
});


  window.loadSectionUsuarios = loadSectionUsuarios;






