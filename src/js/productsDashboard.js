
function loadSectionProducts(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");

  if (section === "agregar-producto") {

    breadcrumb.textContent = "Dashboards / Gestión de productos / Agregar producto";

    fetch("/src/pages/agregar-producto.html")
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        obtenerProductores()
          .then(productores => {
            if (productores) {
              cargarSugerenciasProductores(productores);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
        liveValidationsProducto(inputsProductos(), 'agregar');
      })
      .catch(err => {
        content.innerHTML = "<p>Error al cargar la sección.</p>";
        console.error("Error al cargar agregar-producto.html:", err);
      });
  } else if (section === "ver-productos") {
    breadcrumb.textContent = "Dashboards / Gestión de productos / Ver todos los productos";

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
                    <span class="visually-hidden">Cargando productos...</span>
                </div>
            </div>
        `;
    // Llamar a obtener usuarios y mostrar resultados
    obtenerProductos()
      .then(productos => {
        if (productos) {
          mostrarProductos(productos);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        content.innerHTML = '<div class="alert alert-danger">Error al cargar productos</div>';
      });
  } else {
    breadcrumb.textContent = `Dashboards / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }
}

// Función para obtener productos (corregida)
async function obtenerProductos() {
  const content = document.getElementById("main-content");
  try {
    const token = localStorage.getItem('jwt'); // Mismo nombre

    if (!token) {
      console.error('No hay token disponible');
      window.location.href = '/src/pages/login.html';
      return null;
    }

    const response = await fetch('http://localhost:8080/api/productos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const productos = await response.json();
      return productos;
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
    console.error('Error al obtener productos:', error);
    content.innerHTML = "<p>Error al cargar la lista de productos.</p>";
    throw error;
  }
}

async function obtenerProductoID(index) {
  try {
    const token = localStorage.getItem('jwt'); // Mismo nombre

    if (!token) {
      console.error('No hay token disponible');
      window.location.href = '/src/pages/login.html';
      return null;
    }

    const response = await fetch(`http://localhost:8080/api/productos/${index}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const producto = await response.json();
      return producto;
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
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

function mostrarProductos(productos) {
  const content = document.getElementById("main-content");

  if (productos.length === 0) {
    content.innerHTML = `
        <h3>Lista de productos</h3>
        <p>No hay productos registrados.</p>
      `;

  } else {
    content.innerHTML = `
        <h3 class="mb-5">Lista de productos</h3>
        <table id="tabla-productos" class="table table-hover">
          <thead>
            <tr class="table-primary">
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Productor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${productos.map((p) =>
      `
              <tr>
                <td><img src="${p.imagen ? `http://localhost:8080${p.imagen}` : ''}" 
                alt="${p.nombre}" style="width:50px;height:50px;"></td>
                <td>${p.nombre}</td>
                <td>${p.categoria.nombre}</td>
                <td>${p.stock}</td>
                <td>$${p.precio}</td>
                <td>${p.proveedor.nombre}</td>
                <td>${p.estado == "NODISPONIBLE" ? "No disponible" : "Disponible"} </td>
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

    new DataTable("#tabla-productos", {
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

async function obtenerProductores() {
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
      const productores = await response.json();
      return productores;
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
    console.error('Error al obtener los proveedores:', error);
    throw error;
  }
}

function cargarSugerenciasProductores(productores) {
  const select = document.getElementById("productor");
  if (!select) return;

  if (productores.length > 0) {
    select.innerHTML = '<option value="0">Seleccione un productor</option>';
    productores.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.nombre;
      select.appendChild(option);
    });
  } else {
    select.innerHTML = '<option value="0">No hay productores registrados</option>';
  }
}

function guardarProducto(event) {
  event.preventDefault();

  if (!validateFormProducto(inputsProductos(), 'agregar')) {
    Swal.fire({
      icon: "error",
      title: "Hay campos incorrectos",
      showConfirmButton: false,
      timer: 1500
    });
    return
  }

  const file = document.getElementById("imagen").files[0];

  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("Solo se permiten imágenes.");
      return;
    }
    if (file.size > 1024 * 1024) {
      alert("La imagen no puede superar 1MB.");
      return;
    }
  }

  // Crear FormData y enviar al backend
  const formData = new FormData();
  formData.append("imagen", file);
  formData.append("nombre", document.getElementById("nombre").value);
  formData.append("proveedor", document.getElementById("productor").value);
  formData.append("descripcion", document.getElementById("descripcion").value);
  formData.append("categoria", document.getElementById("categoria").value);
  formData.append("stock", document.getElementById("cantidad").value);
  formData.append("precio", document.getElementById("precio").value);
  formData.append("presentacion", document.getElementById("presentacion").value);
  formData.append("unidadMedida", document.getElementById("medida").value);

  fetch("http://localhost:8080/api/productos/crear", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      console.log("Producto guardado:", data);
      Toastify({
        text: "Producto agregado correctamente", // Mensaje de éxito de la sesión
        duration: 2000, // Duración de la notificación (2 segundos)
        close: true, // Mostrar botón de cerrar
        gravity: "top", // Posición de la notificación (arriba)
        position: "right", // Posición a la derecha
        stopOnFocus: true, // Evitar que la notificación se cierre al pasar el ratón por encima
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
        },
      }).showToast();
      loadSection("ver-productos");

    })
    .catch(err => console.error("Error:", err));

};

function eliminarProducto(index) {
  Swal.fire({
    title: "¿Desea eliminar este producto?",
    text: "No puede revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/productos/borrar/${index}`, {
        method: "PATCH"
      })
        .then(res => {
          if (!res.ok) {
            throw new Error("Error al eliminar el producto");
          }
          return res.text(); // <- aquí usamos text()
        })
        .then(data => {
          console.log("Producto eliminado:", data);

          loadSection("ver-productos");

          Toastify({
            text: data, // el texto que devolvió el backend
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
          }).showToast();
        })
        .catch(err => {
          console.error("Error:", err);

          Toastify({
            text: "Hubo un error al eliminar el producto",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, #d9534f, #c9302c)",
            },
          }).showToast();
        });
    }
  });
}

function editarProducto(index) {
  obtenerProductoID(index)
    .then(producto => {
      if (producto) {
        fetch("/src/pages/agregar-producto.html")
          .then(res => res.text())
          .then(html => {
            const content = document.getElementById("main-content");
            const breadcrumb = document.getElementById("breadcrumb");
            breadcrumb.textContent = "Dashboards / Gestión de productos / Editar producto";
            content.innerHTML = html;
            content.innerHTML = html;
            obtenerProductores()
              .then(productores => {
                if (productores) {
                  cargarSugerenciasProductores(productores);
                }
              })
              .catch(error => {
                console.error('Error:', error);
              });
            liveValidationsProducto(inputsProductos(), 'editar');

            setTimeout(() => {
              const form = document.getElementById("agregarProducto");
              if (form) {
                const selectCategoria = form.querySelector("#categoria");
                for (let option of selectCategoria.options) {
                  if (option.value == producto.categoria.id) {
                    option.selected = true;
                  } else {
                    option.selected = false;
                  }
                }
                form.querySelector("#nombre").value = producto.nombre;
                const selectProductor = form.querySelector("#productor");
                for (let option of selectProductor.options) {
                  if (option.value == producto.proveedor.id) {
                    option.selected = true;
                  } else {
                    option.selected = false;
                  }
                }
                form.querySelector("#descripcion").value = producto.descripcion;
                form.querySelector("#cantidad").value = producto.stock;
                form.querySelector("#precio").value = producto.precio;
                form.querySelector("#presentacion").value = producto.presentacion;
                const selectMedida = form.querySelector("#medida");
                for (let option of selectMedida.options) {
                  if (option.value == producto.unidadMedida) {
                    option.selected = true;
                  } else {
                    option.selected = false;
                  }
                }

                const selectEstado = form.querySelector("#estado");
                for (let option of selectEstado.options) {
                  if (option.value == producto.estado) {
                    option.selected = true;
                  } else {
                    option.selected = false;
                  }
                }
                selectEstado.parentNode.classList.remove('d-none');
                selectEstado.style.display = "block";

                // Mostrar vista previa de la imagen actual
                const preview = document.getElementById("img-previa");
                preview.src = producto.imagen ? `http://localhost:8080${producto.imagen}` : '';
                preview.src !== '' ? preview.parentNode.classList.remove('d-none') : preview.parentNode.classList.add('d-none');
                preview.style.display = "block";

                const file = document.getElementById("imagen");
                file.removeAttribute('required');

                if (file.files[0]) {
                  if (!file.type.startsWith("image/")) {
                    alert("Solo se permiten imágenes.");
                    return;
                  }
                  if (file.files[0].size > 1024 * 1024) {
                    alert("La imagen no puede superar 1MB.");
                    return;
                  }
                }

                const divBtns = document.getElementById("btns");
                // Cambiar texto del botón
                const submitBtn = form.querySelector("button[type='submit']");
                submitBtn.textContent = "Actualizar producto";
                //Agregar boton cancelar
                const cancelBtn = document.createElement("button");
                cancelBtn.type = "button";
                cancelBtn.classList.add('btn', 'btn-danger');
                cancelBtn.textContent = "Cancelar";
                cancelBtn.addEventListener("click", (e) => {
                  e.preventDefault();
                  loadSection("ver-productos");
                });
                divBtns.appendChild(cancelBtn);

                form.onsubmit = function (e) {
                  e.preventDefault();

                  if (!validateFormProducto(inputsProductos(), 'editar')) {
                    Swal.fire({
                      icon: "error",
                      title: "Hay campos incorrectos",
                      showConfirmButton: false,
                      timer: 1500
                    });
                    return
                  }


                  actualizarProducto(index);

                };
              }
            }, 100);
          })
          .catch(err => {
            console.error("Error al cargar el formulario de edición:", err);
          });
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function actualizarProducto(index) {
  const formData = new FormData();

  const file = document.getElementById("imagen").files[0];
  if (file) {
    formData.append("imagen", file);
  }

  formData.append("nombre", document.getElementById("nombre").value);
  formData.append("proveedor", document.getElementById("productor").value);
  formData.append("descripcion", document.getElementById("descripcion").value);
  formData.append("categoria", document.getElementById("categoria").value);
  formData.append("stock", document.getElementById("cantidad").value);
  formData.append("precio", document.getElementById("precio").value);
  formData.append("presentacion", document.getElementById("presentacion").value);
  formData.append("unidadMedida", document.getElementById("medida").value);
  formData.append("estado", document.getElementById("estado").value);

  fetch(`http://localhost:8080/api/productos/editar/${index}`, {
    method: "PUT",
    body: formData
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error en la actualización");
      }
      return res.text();
    })
    .then(data => {
      console.log("Producto editado:", data);
      Toastify({
        text: "Producto editado correctamente",
        duration: 2000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      loadSection("ver-productos");
    })
    .catch(err => console.error("Error:", err));
}

/*-------------------------------------------------------------------------------------------------
// Validación campos formulario
-------------------------------------------------------------------------------------------------*/
// Validaciones para formulario de agregarProducto

function inputsProductos() {
  const inputs = {
    'form': document.getElementById('agregarProducto'),  // Elementos del formulario
    'categoria': document.getElementById('categoria'),
    'nomProducto': document.getElementById('nombre'),
    'productor': document.getElementById('productor'),
    'descripcion': document.getElementById('descripcion'),
    'cantidad': document.getElementById('cantidad'),
    'precio': document.getElementById('precio'),
    'presentacion': document.getElementById('presentacion'),
    'medida': document.getElementById('medida'),
    'imagen': document.getElementById("imagen"),
    'nameRegex': /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/,
  }
  return inputs;
}

// Validar todo el formulario
function validateFormProducto(inputsFields, action) {
  const inputs = inputsFields;
  const validations = [
    validateName(inputs['nomProducto'], inputs['nameRegex']),
    validateDescription(inputs['descripcion']),
    validateInquiry(inputs['categoria']),
    validateInquiry(inputs['productor']),
    validateInquiry(inputs['medida']),
    validateNegative(inputs['cantidad']),
    validateNegative(inputs['precio']),
    validateNegative(inputs['presentacion']),
  ];
  if (action == 'agregar') {
    validations.push(validateFile(inputs['imagen']));
  }
  return validations.every(validation => validation === true);
}


// Validaciones en vivo
function liveValidationsProducto(inputsFields, action) {
  const inputs = inputsFields;
  // Event listeners para validación en tiempo real
  inputs['nomProducto'].addEventListener('blur', function () { validateName(inputs['nomProducto'], inputs['nameRegex']) });
  inputs['nomProducto'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateName(inputs['nomProducto'], inputs['nameRegex']);
    }
  });

  inputs['descripcion'].addEventListener('blur', function () { validateDescription(inputs['descripcion']) });
  inputs['descripcion'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateDescription(inputs['descripcion']);
    }
  });

  inputs['categoria'].addEventListener('change', function () { validateInquiry(inputs['categoria']) });
  inputs['productor'].addEventListener('change', function () { validateInquiry(inputs['productor']) });
  inputs['medida'].addEventListener('change', function () { validateInquiry(inputs['medida']) });
  if (action == 'agregar') inputs['imagen'].addEventListener('change', function () { validateFile(inputs['imagen']) });

  inputs['cantidad'].addEventListener('blur', function () { validateNegative(inputs['cantidad']) });
  inputs['cantidad'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateNegative();
    }
  });

  inputs['precio'].addEventListener('blur', function () { validateNegative(inputs['precio']) });
  inputs['precio'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateNegative();
    }
  });

  inputs['presentacion'].addEventListener('blur', function () { validateNegative(inputs['presentacion']) });
  inputs['presentacion'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateNegative();
    }
  });
}

/*-------------------------------------------------------------------------------------------------
// Fin validación campos formulario
-------------------------------------------------------------------------------------------------*/

// const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
// if (current && current.rol === 'admin') {
window.loadSectionProducts = loadSectionProducts;
window.eliminarProducto = eliminarProducto;
window.editarProducto = editarProducto;
window.guardarProducto = guardarProducto;
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
//   const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
//   if (!current || current.rol !== 'admin') {
//     window.location.href = '/src/pages/login.html';
//   }
// });

// window.addEventListener("pagehide", () => {
//   localStorage.removeItem("currentUser");
// });






