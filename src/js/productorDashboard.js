function loadSectionProductor(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");

  if (section === "ver-productores") {
    breadcrumb.textContent = "Dashboards / Gestión de proveedores / Ver todos los productores";

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
    // Llamar a obtener proveedores y mostrar resultados
    obtenerProveedores()
      .then(proveedores => {
        if (proveedores) {
          console.log(proveedores);
          mostrarProveedores(proveedores);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        content.innerHTML = '<div class="alert alert-danger">Error al cargar proveedores</div>';
      });

  } else if (section === "agregar-productor") {
    breadcrumb.textContent = "Dashboards / Gestión de proveedores / Agregar productor";
    fetch("/src/pages/agregar-productor.html")
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        console.log(document.getElementById('agregarProductor'));
      })
      .catch(err => {
        content.innerHTML = "<p>Error al cargar la sección.</p>";
        console.error("Error al cargar agregar-productor.html:", err);
      });
  }
  else {
    breadcrumb.textContent = `Dashboards / Gestión de Proveedores / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }
}

// Función para obtener proveedores 
async function obtenerProveedores() {
  const content = document.getElementById("main-content");
  try {
    const token = localStorage.getItem('jwt'); // Mismo nombre

    if (!token) {
      console.error('No hay token disponible');
      window.location.href = '/src/pages/login.html';
      return null;
    }

    const response = await fetch('http://localhost:8080/api/proveedores', {
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

function mostrarProveedores(proveedores) {
  const content = document.getElementById("main-content");

  if (proveedores.length === 0) {
    content.innerHTML = `
      <h3>Lista de Proveedores</h3>
      <p>No hay proveedores registrados.</p>
    `;
  } else {
    content.innerHTML = `
      <h3 class="mb-5">Lista de proveedores</h3>
      <table id="tabla-proveedores" class="table table-hover">
        <thead>
          <tr class="table-primary">
            <th>Razón Social</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${proveedores.map(p => `
            <tr>
              <td>${p.razonSocial}</td>
              <td>${p.nombreProveedor}</td>
              <td>${p.telefonoProveedor}</td>
              <td>${p.emailProveedor}</td>
              <td>${p.direccionProveedor}</td>
              <td>${p.estado == "NODISPONIBLE" ? "No disponible" : "Disponible"}</td>
              <td>
                <button type="button" class="btn btn-success" onclick="editarProductor(${p.id})">
                  <i class="bi bi-pen"></i>
                </button>
                <button type="button" class="btn btn-danger" onclick="eliminarProductor(${p.id})">
                  <i class="bi bi-trash3"></i>
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    new DataTable("#tabla-proveedores", {
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


async function eliminarProductor(id) {
  const token = localStorage.getItem('jwt');

  if (!token) {
    // Sesión inexistente: redirigir
    window.location.href = '/src/pages/login.html';
    return;
  }

  const confirm = await Swal.fire({
    title: "¿Desea eliminar este proveedor?",
    text: "No puede revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar"
  });

  if (!confirm.isConfirmed) return;

  try {
    const resp = await fetch(`http://localhost:8080/api/proveedores/borrar/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (resp.status === 401) {
      localStorage.removeItem('jwt');
      alert('Sesión expirada. Inicie sesión nuevamente.');
      window.location.href = '/src/pages/login.html';
      return;
    }

    if (!resp.ok) {
      throw new Error(`Error al eliminar: ${resp.status}`);
    }

    Toastify({
      text: "Proveedor eliminado correctamente",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
    }).showToast();

    // Volver a cargar la lista desde la API
    const proveedores = await obtenerProveedores();
    if (proveedores) mostrarProveedores(proveedores);

  } catch (e) {
    console.error(e);
    Swal.fire("Error", "No se pudo eliminar el proveedor.", "error");
  }
}

window.guardarProductor = async function (event) {
  event.preventDefault();

  const razonSocial = document.getElementById('razon-social')?.value.trim();
  const nombreProveedor = document.getElementById('nombre')?.value.trim();
  const emailProveedor = document.getElementById('email')?.value.trim();
  const direccionProveedor = document.getElementById('direccion')?.value.trim();
  const telefonoProveedor = document.getElementById('mobile_code')?.value.trim();

  // Validación rápida
  const telRegex = /^[+\d][\d\s\-()]{6,19}$/;
  if (!telRegex.test(telefonoProveedor)) {
    alert('Teléfono con formato inválido.');
    return;
  }

  const payload = {
    razonSocial,
    nombreProveedor,
    telefonoProveedor,
    emailProveedor,
    direccionProveedor
  };

  const token = localStorage.getItem('jwt');
  if (!token) {
    alert('Sesión no disponible. Inicie sesión nuevamente.');
    window.location.href = '/src/pages/login.html';
    return;
  }

  try {
    const resp = await fetch('http://localhost:8080/api/proveedores/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (resp.status === 401) {
      localStorage.removeItem('jwt');
      alert('Sesión expirada. Inicie sesión nuevamente.');
      window.location.href = '/src/pages/login.html';
      return;
    }

    if (!resp.ok) {
      let mensaje = `Error al crear: ${resp.status}`;
      try {
        const data = await resp.json();
        if (data?.message) mensaje = data.message;
      } catch (_) { }
      throw new Error(mensaje);
    }

    // Éxito
    document.getElementById('agregarProductor')?.reset();
    Toastify?.({
      text: "Proveedor creado correctamente",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "right",
      style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
    }).showToast?.();

    // Refrescar listado o navegar a la vista de lista
    const proveedores = await obtenerProveedores();
    if (proveedores) {
      loadSectionProductor('ver-productores');
      mostrarProveedores(proveedores);
    }
  } catch (e) {
    console.error(e);
    Swal?.fire("Error", e.message || "No se pudo crear el proveedor.", "error");
  }
};


window.loadSectionProductor = loadSectionProductor;

// Editar: cargar formulario, precargar datos y preparar submit (PUT)
window.editarProductor = async function (id) {
  const token = localStorage.getItem('jwt');
  if (!token) {
    window.location.href = '/src/pages/login.html';
    return;
  }

  try {
    // Cargar la vista del formulario
    const resHtml = await fetch("/src/pages/editar-productor.html");
    const html = await resHtml.text();
    const content = document.getElementById("main-content");
    const breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.textContent = "Dashboards / Gestión de proveedores / Editar proveedor";
    content.innerHTML = html;

    // Asegurar validación nativa del teléfono (opcional)
    const tel = document.getElementById('mobile_code');
    if (tel) {
      tel.setAttribute('pattern', '^[+\\d][\\d\\s\\-()]{6,19}$');
      tel.setAttribute('title', 'Formato: +NN 123 456 789 (7 a 20 caracteres)');
    }

    // Obtener datos actuales del proveedor
    const resGet = await fetch(`http://localhost:8080/api/proveedores/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (resGet.status === 401) {
      localStorage.removeItem('jwt');
      alert('Sesión expirada. Inicie sesión nuevamente.');
      window.location.href = '/src/pages/login.html';
      return;
    }
    if (!resGet.ok) {
      throw new Error(`No se pudo cargar el proveedor: ${resGet.status}`);
    }
    const p = await resGet.json();

    // Rellenar campos (usa los IDs del HTML de agregar)
    document.getElementById('razon-social').value = p.razonSocial || '';
    document.getElementById('nombre').value = p.nombreProveedor || '';
    document.getElementById('email').value = p.emailProveedor || '';
    document.getElementById('direccion').value = p.direccionProveedor || '';
    document.getElementById('mobile_code').value = p.telefonoProveedor || '';

    // Cambiar texto del botón y añadir Cancelar
    const form = document.getElementById('EditarProductor');
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.textContent = 'Actualizar proveedor';

    const divBtns = document.getElementById('btns');
    if (divBtns && !document.getElementById('cancelBtn')) {
      const cancelBtn = document.createElement('button');
      cancelBtn.id = 'cancelBtn';
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-danger ms-2';
      cancelBtn.textContent = 'Cancelar';
      cancelBtn.addEventListener('click', () => {
        loadSectionProductor('ver-productores');
      });
      divBtns.appendChild(cancelBtn);
    }

    // Enlazar submit: actualizar vía PUT
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const payload = {
        razonSocial: document.getElementById('razon-social').value.trim(),
        nombreProveedor: document.getElementById('nombre').value.trim(),
        emailProveedor: document.getElementById('email').value.trim(),
        direccionProveedor: document.getElementById('direccion').value.trim(),
        telefonoProveedor: document.getElementById('mobile_code').value.trim()
      };

      // Validación simple de teléfono (igual que backend)
      const telRegex = /^[+\d][\d\s\-()]{6,19}$/;
      if (!telRegex.test(payload.telefonoProveedor)) {
        alert('Teléfono con formato inválido.');
        return;
      }

      try {

        const updateUrl = `http://localhost:8080/api/proveedores/editar/${id}`;
        const resp = await fetch(updateUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (resp.status === 401) {
          localStorage.removeItem('jwt');
          alert('Sesión expirada. Inicie sesión nuevamente.');
          window.location.href = '/src/pages/login.html';
          return;
        }
        if (!resp.ok) {
          let msg = `Error al actualizar: ${resp.status}`;
          try {
            const data = await resp.json();
            if (data?.message) msg = data.message;
          } catch { }
          throw new Error(msg);
        }

        Toastify?.({
          text: "Proveedor actualizado correctamente",
          duration: 2000,
          close: true,
          gravity: "top",
          position: "right",
          style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
        }).showToast?.();

        // Volver a listado y refrescar
        loadSectionProductor('ver-productores');
        const proveedores = await obtenerProveedores();
        if (proveedores) mostrarProveedores(proveedores);

      } catch (e) {
        console.error(e);
        Swal?.fire("Error", e.message || "No se pudo actualizar el proveedor.", "error");
      }
    });

  } catch (err) {
    console.error("Error al cargar el formulario de edición:", err);
    Swal?.fire("Error", "No se pudo cargar el formulario de edición.", "error");
  }
};

