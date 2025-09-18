
function loadSectionProducts(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");

  if (section === "agregar-producto") {

    breadcrumb.textContent = "Dashboards / Gestión de productos / Agregar producto";
    fetch("/src/pages/agregar-producto.html")
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        cargarSugerenciasProductores();
        liveValidations(inputsProductos());
      })
      .catch(err => {
        content.innerHTML = "<p>Error al cargar la sección.</p>";
        console.error("Error al cargar agregar-producto.html:", err);
      });
  } else if (section === "ver-productos") {
    breadcrumb.textContent = "Dashboards / Gestión de productos / Ver todos los productos";

    const productos = JSON.parse(localStorage.getItem("productos") || "[]");

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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${productos.map((p, index) =>
        `
              <tr>
                <td><img src="${p.imagen ? (p.imagen.startsWith("data:") ? p.imagen : `/src/public/img/productos/${p.imagen}`) : ''}" 
                alt="${p.nombre}" style="width:50px;height:50px;"></td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precio}</td>
                <td>${p.productor}</td>
                <td>
                  <button type="button" class="btn btn-success" onclick="editarProducto(${index})">
                    <i class="bi bi-pen"></i>
                  </button>
                  <button type="button" class="btn btn-danger" onclick="eliminarProducto(${index})">
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

  } else {
    breadcrumb.textContent = `Dashboards / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }
}

function guardarProducto(event) {
  event.preventDefault();

  if (!validateForm(inputsProductos())) {
    Swal.fire({
      icon: "error",
      title: "Hay campos incorrectos",
      showConfirmButton: false,
      timer: 1500
    });
    return
  }

  const reader = new FileReader();
  const file = document.getElementById("imagen").files[0];

  reader.onload = function () {
    const productos = JSON.parse(localStorage.getItem("productos") || "[]");
    let maxCodigo = 1000;
    if (productos.length > 0) {
      maxCodigo = Math.max(...productos.map(p => p.codigo || 1000));
    }
    const producto = {
      codigo: maxCodigo + 1,
      nombre: document.getElementById("nombre").value,
      productor: document.getElementById("productor").value,
      descripcion: document.getElementById("descripcion").value,
      categoria: document.getElementById("categoria").value,
      cantidad: document.getElementById("cantidad").value,
      precio: document.getElementById("precio").value,
      imagen: reader.result,
      presentacion: document.getElementById("presentacion").value,
      medida: document.getElementById("medida").value,
    };
    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));
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
  };

  if (file) {
    if (!file.type.startsWith("image/") || file.size > 1024 * 1024) {
      return;
    } else {
      reader.readAsDataURL(file);
    }
  }
}

function eliminarProducto(index) {
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");
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
      productos.splice(index, 1);
      localStorage.setItem("productos", JSON.stringify(productos));
      loadSection("ver-productos");
      Toastify({
        text: "Producto eliminado correctamente", // Mensaje de éxito de la sesión
        duration: 2000, // Duración de la notificación (2 segundos)
        close: true, // Mostrar botón de cerrar
        gravity: "top", // Posición de la notificación (arriba)
        position: "right", // Posición a la derecha
        stopOnFocus: true, // Evitar que la notificación se cierre al pasar el ratón por encima
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
        },
      }).showToast();
    }
  });
}

function editarProducto(index) {
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");
  const producto = productos[index];

  fetch("/src/pages/agregar-producto.html")
    .then(res => res.text())
    .then(html => {
      const content = document.getElementById("main-content");
      const breadcrumb = document.getElementById("breadcrumb");
      breadcrumb.textContent = "Dashboards / Gestión de productos / Editar producto";
      content.innerHTML = html;
      cargarSugerenciasProductores();
      liveValidations(inputs());

      setTimeout(() => {
        const form = document.getElementById("agregarProducto");
        if (form) {
          const selectCategoria = form.querySelector("#categoria");
          for (let option of selectCategoria.options) {
            if (option.value == producto.categoria) {
              option.selected = true;
            } else {
              option.selected = false;
            }
          }
          form.querySelector("#nombre").value = producto.nombre;
          const selectProductor = form.querySelector("#productor");
          for (let option of selectProductor.options) {
            if (option.value == producto.productor) {
              option.selected = true;
            } else {
              option.selected = false;
            }
          }
          form.querySelector("#descripcion").value = producto.descripcion;
          form.querySelector("#cantidad").value = producto.cantidad;
          form.querySelector("#precio").value = producto.precio;
          form.querySelector("#presentacion").value = producto.presentacion;
          const selectMedida = form.querySelector("#medida");
          for (let option of selectMedida.options) {
            if (option.value == producto.medida) {
              option.selected = true;
            } else {
              option.selected = false;
            }
          }

          // Mostrar vista previa de la imagen actual
          const preview = document.getElementById("img-previa");
          preview.src = producto.imagen ? (producto.imagen.startsWith("data:") ? producto.imagen : `/src/public/img/productos/${producto.imagen}`) : '';
          preview.src !== '' ? preview.parentNode.classList.remove('d-none') : preview.parentNode.classList.add('d-none');
          preview.style.display = "block";

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

            if (!validateForm(inputsProductos())) {
              Swal.fire({
                icon: "error",
                title: "Hay campos incorrectos",
                showConfirmButton: false,
                timer: 1500
              });
              return
            }

            const file = document.getElementById("imagen").files[0];
            const reader = new FileReader();
            reader.onload = function () {
              actualizarProducto(index, reader.result);
            };
            if (file) {
              if (!file.type.startsWith("image/") || file.size > 1024 * 1024) {
                return;
              } else {
                reader.readAsDataURL(file);
              }
            }
          };
        }
      }, 100);
    })
    .catch(err => {
      console.error("Error al cargar el formulario de edición:", err);
    });
}

function cargarSugerenciasProductores() {
  const select = document.getElementById("productor");
  if (!select) return;

  const productores = JSON.parse(localStorage.getItem("productores") || "[]");
  if (productores.length > 0) {
    select.innerHTML = '<option value="0">Seleccione un productor</option>';
    productores.forEach(p => {
      const option = document.createElement('option');
      option.value = p.codigo;
      option.textContent = p.nombre;
      select.appendChild(option);
    });
  }
}

function actualizarProducto(index, imagenBase64) {
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");

  productos[index] = {
    nombre: document.getElementById("nombre").value,
    productor: document.getElementById("productor").value,
    descripcion: document.getElementById("descripcion").value,
    categoria: document.getElementById("categoria").value,
    cantidad: document.getElementById("cantidad").value,
    precio: document.getElementById("precio").value,
    presentacion: document.getElementById("presentacion").value,
    medida: document.getElementById("medida").value,
    imagen: imagenBase64
  };

  localStorage.setItem("productos", JSON.stringify(productos));
  Toastify({
    text: "Producto actualizado correctamente", // Mensaje de éxito de la sesión
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
function validateForm(inputsFields) {
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
    validateFile(inputs['imagen']),
  ];
  return validations.every(validation => validation === true);
}

// Validaciones en vivo
function liveValidations(inputsFields) {
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
  inputs['imagen'].addEventListener('change', function () { validateFile(inputs['imagen']) });

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

/*-------------------------------------------------------------------------------------------------
// Chart Ventas
-------------------------------------------------------------------------------------------------*/

function chartVentas() {
  const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");
  const ventasPorMes = {};

  ventas.forEach(v => {
    const [dia, mes, anio] = v.fecha.split('/');
    const mesF = parseInt(mes);
    if (!ventasPorMes[mesF]) {
      ventasPorMes[mesF] = 0;
    }
    ventasPorMes[mesF] += 1;
  });

  const labels = Object.keys(ventasPorMes).map(m => {
    const mes = new Date(2025, m - 1).toLocaleString('es-ES', { month: 'long' });
    return mes.charAt(0).toUpperCase() + mes.slice(1);
  });
  const data = {
    labels: labels,
    datasets: [
      {
        label: "CANTIDAD DE VENTAS POR MES",
        data: Object.values(ventasPorMes),
        borderColor: "rgba(54, 162, 235, 1)",       // azul
        backgroundColor: "rgba(54, 162, 235, 0.5)", // azul transparente
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
      }
    ]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
        }
      }
    },
  }

  const ctx = document.getElementById("chartVentas");
  new Chart(ctx, config);
}

function chartInventario() {
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");
  const ventasPorCategoria = { Cafe: 0, Cacao: 0, Cerveza: 0 };

  productos.forEach(p => {
    ventasPorCategoria[p.categoria] += p.cantidad;
  });

  const labels = Object.keys(ventasPorCategoria)
  const data = {
    labels: labels,
    datasets: [
      {
        label: "CANTIDAD DE PRODUCTOS POR CATEGORIA",
        data: Object.values(ventasPorCategoria),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }
    ]
  };
  const config = {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
        }
      }
    },
  }

  const ctx = document.getElementById("chartInventario");
  new Chart(ctx, config);

}

// const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (current && current.rol === 'admin') {
  window.loadSectionProducts = loadSectionProducts;
  window.eliminarProducto = eliminarProducto;
  window.editarProducto = editarProducto;
  window.guardarProducto = guardarProducto;
} else {
  const content = document.getElementById("body-dashboard");
  content.innerHTML = '';
  content.classList.add('d-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  content.innerHTML = `
    <h3 class="mt-5">ACCESO NO AUTORIZADO</h3>
    <p>Redirigiendo a La Placita Colombiana</p>
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  `
  setTimeout(() => {
    window.location.href = '/src/pages/login.html';
  }, 1000);
}

// window.addEventListener("storage", () => {
//   const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
//   if (!current || current.rol !== 'admin') {
//     window.location.href = '/src/pages/login.html';
//   }
// });

// window.addEventListener("pagehide", () => {
//   localStorage.removeItem("currentUser");
// });






