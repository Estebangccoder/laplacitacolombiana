// productos.js - Lógica de productos usando el servicio API

function loadSectionProducts(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");

  if (section === "agregar-producto") {
    breadcrumb.textContent = "Dashboards / Gestión de productos / Agregar producto";

    fetch("/src/pages/agregar-producto.html")
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        
        // Usar la función del API service
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

    // Verificar autenticación usando el API service
    if (!isAuthenticated()) {
      window.location.href = '/src/pages/login.html';
      return;
    }

    // Mostrar loading
    content.innerHTML = `
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Cargando productos...</span>
        </div>
      </div>
    `;

    // Usar la función del API service
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
            `<tr>
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
            </tr>`
          ).join("")}
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
    return;
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

  // Crear FormData
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

  // Usar la función del API service
  crearProducto(formData)
    .then(data => {
      console.log("Producto guardado:", data);
      Toastify({
        text: "Producto agregado correctamente",
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
      // Usar la función del API service
      eliminarProductoAPI(index)
        .then(data => {
          console.log("Producto eliminado:", data);
          loadSection("ver-productos");
          
          Toastify({
            text: data,
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
  // Usar la función del API service
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
            
            // Usar la función del API service
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
                // Llenar el formulario con los datos del producto
                const selectCategoria = form.querySelector("#categoria");
                for (let option of selectCategoria.options) {
                  option.selected = option.value == producto.categoria.id;
                }
                
                form.querySelector("#nombre").value = producto.nombre;
                
                const selectProductor = form.querySelector("#productor");
                for (let option of selectProductor.options) {
                  option.selected = option.value == producto.proveedor.id;
                }
                
                form.querySelector("#descripcion").value = producto.descripcion;
                form.querySelector("#cantidad").value = producto.stock;
                form.querySelector("#precio").value = producto.precio;
                form.querySelector("#presentacion").value = producto.presentacion;
                
                const selectMedida = form.querySelector("#medida");
                for (let option of selectMedida.options) {
                  option.selected = option.value == producto.unidadMedida;
                }

                const selectEstado = form.querySelector("#estado");
                for (let option of selectEstado.options) {
                  option.selected = option.value == producto.estado;
                }
                selectEstado.parentNode.classList.remove('d-none');
                selectEstado.style.display = "block";

                // Mostrar vista previa de la imagen
                const preview = document.getElementById("img-previa");
                preview.src = producto.imagen ? `http://localhost:8080${producto.imagen}` : '';
                preview.src !== '' ? preview.parentNode.classList.remove('d-none') : preview.parentNode.classList.add('d-none');
                preview.style.display = "block";

                const file = document.getElementById("imagen");
                file.removeAttribute('required');

                const divBtns = document.getElementById("btns");
                const submitBtn = form.querySelector("button[type='submit']");
                submitBtn.textContent = "Actualizar producto";
                
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
                    return;
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

  // Usar la función del API service
  actualizarProductoAPI(index, formData)
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

// Resto del código de validaciones...
function inputsProductos() {
  const inputs = {
    'form': document.getElementById('agregarProducto'),
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
      validateNegative(inputs['cantidad']);
    }
  });

  inputs['precio'].addEventListener('blur', function () { validateNegative(inputs['precio']) });
  inputs['precio'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateNegative(inputs['precio']);
    }
  });

  inputs['presentacion'].addEventListener('blur', function () { validateNegative(inputs['presentacion']) });
  inputs['presentacion'].addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
      validateNegative(inputs['presentacion']);
    }
  });
}

// Exponer funciones al scope global
window.loadSectionProducts = loadSectionProducts;
window.eliminarProducto = eliminarProducto;
window.editarProducto = editarProducto;
window.guardarProducto = guardarProducto;