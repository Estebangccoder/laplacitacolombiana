
function loadSection(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");

  if (section === "agregar-producto") {

    breadcrumb.textContent = "Dashboards / Gestión de productos / Agregar producto";
    fetch("../pages/agregar-producto.html")
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        cargarSugerenciasProductores();
        liveValidations(inputs());
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
                <td><img src="${p.imagen ? (p.imagen.startsWith("data:") ? p.imagen : `../public/img/productos/${p.imagen}`) : ''}" 
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

  } else if (section === "ventas") {
    breadcrumb.textContent = "Dashboards / Ver todas las ventas";

    const ventas = JSON.parse(localStorage.getItem("ventas") || "[]");

    if (ventas.length === 0) {
      content.innerHTML = `
        <h3>Lista de ventas</h3>
        <p>No hay ventas registradas.</p>
      `;

    } else {
      content.innerHTML = `
        <h3 class="mb-5">Lista de ventas</h3>
        <table id="tabla-ventas" class="table table-hover">
          <thead>
            <tr class="table-primary">
              <th>Fecha</th>
              <th>No. Productos</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${ventas.map((v, index) =>
        `
              <tr>
                <td>${v.fecha}</td>
                <td>${v.num_productos}</td>
                <td>$${v.total}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

      new DataTable("#tabla-ventas", {
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

  } else if (section === "agregar-productor") {
    breadcrumb.textContent = "Dashboards / Gestión de proveedores / Agregar productor";
    fetch("../pages/agregar-productor.html")
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        mostrarProductoresRegistrados();
        const form = document.getElementById("form-productor");
        if (form) {
          form.addEventListener("submit", guardarProductor);
        }
        const nomProductor = document.getElementById('nombre-productor');
        nomProductor.addEventListener('blur', function () { validateName(nomProductor, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/) });
        nomProductor.addEventListener('input', function () {
          if (this.classList.contains('is-invalid')) {
            validateName(nomProductor, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/);
          }
        });
      })
      .catch(err => {
        content.innerHTML = "<p>Error al cargar la sección.</p>";
        console.error("Error al cargar agregar-productor.html:", err);
      });

  } else if (section === "agregar-publicacion") {
    breadcrumb.textContent = "Dashboards / Gestión de publicaciones / Agregar publicación";
    fetch("../pages/agregar-publicacion.html")
      .then(res => res.text())
      .then(html => {
        content.innerHTML = html;
        const form = document.getElementById("form-publicacion");
        if (form) {
          dateValidation();
          const tituloPub = document.getElementById('titulo');
          tituloPub.addEventListener('blur', function () { validateName(tituloPub, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/) });
          tituloPub.addEventListener('input', function () {
            if (this.classList.contains('is-invalid')) {
              validateName(tituloPub, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/);
            }
          });
          const descripcionPub = document.getElementById("descripcion");
          descripcionPub.addEventListener('blur', function () { validateDescription(descripcionPub) });
          descripcionPub.addEventListener('input', function () {
            if (this.classList.contains('is-invalid')) {
              validateDescription(descripcionPub);
            }
          });
          form.addEventListener("submit", guardarPublicacion);
        }
      })
      .catch(err => {
        content.innerHTML = "<p>Error al cargar la sección.</p>";
        console.error("Error al cargar agregar-publicacion.html:", err);
      });

  } else if (section === "ver-publicaciones") {
    breadcrumb.textContent = "Dashboards / Gestión de publicaciones / Ver publicaciones";
    const publicaciones = JSON.parse(localStorage.getItem("publicaciones") || "[]");

    if (publicaciones.length === 0) {
      content.innerHTML = `<h3>Publicaciones</h3><p>No hay publicaciones registradas.</p>`;
    } else {
      content.innerHTML = `
      <h3 style="text-align:center;">Publicaciones</h3>
      <div class="productos-lista">
        ${publicaciones.map((p, index) => `
          <div class="producto-card">
            <img src="${p.imagen}" class="producto-img" alt="${p.titulo}">
            <div class="producto-info">
              <strong>${p.titulo}</strong><br>
              <small>${p.fecha}</small><br>
              <p>${p.descripcion}</p>
              <button onclick="editarPublicacion(${index})">Editar</button>
              <button onclick="eliminarPublicacion(${index})">Eliminar</button>
            </div>
          </div>
        `).join("")}
      </div>
    `;
    }


  } else if (section === "home") {
    breadcrumb.textContent = "Dashboards / Home";

    if (window.chartVentas && typeof window.chartVentas.destroy === 'function') {
      window.chartVentas.destroy();
      window.chartVentas = null;
    }

    if (window.chartInventario && typeof window.chartInventario.destroy === 'function') {
      window.chartInventario.destroy();
      window.chartInventario = null;
    }

    content.innerHTML = `
        <h3>Bienvenido Administrador</h3>
        <div class="mt-5 d-flex flex-column flex-lg-row justify-content-center gap-5">
          <div class=" p-3 border rounded shadow bg-body-tertiary" style="height: 500px; width: 500px;">
            <canvas id="chartVentas"></canvas>
          </div>
          <div class=" p-3 border rounded shadow bg-body-tertiary" style="height: 500px; width: 500px;">
            <canvas id="chartInventario"></canvas>
          </div>
        </div>
      
    `
    setTimeout(() => {
      chartVentas();
      chartInventario();
    }, 0);
  } else {
    breadcrumb.textContent = `Dashboards / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }
}

function guardarProducto(event) {
  event.preventDefault();

  if (!validateForm(inputs())) {
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

  fetch("../pages/agregar-producto.html")
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
          preview.src = producto.imagen ? (producto.imagen.startsWith("data:") ? producto.imagen : `../public/img/productos/${producto.imagen}`) : '';
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

            if (!validateForm(inputs())) {
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

function guardarProductor(event) {
  event.preventDefault();
  const input = document.getElementById("nombre-productor");
  const nombre = input.value.trim();

  validateName(input, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/)

  const productores = JSON.parse(localStorage.getItem("productores") || "[]");
  // Verificar si el nombre ya existe (ignorando mayúsculas/minúsculas y espacios extras)
  let existe = productores.some(p => p.nombre.trim().toLowerCase() === input.value.trim().toLowerCase());
  if (!existe) {
    let maxCodigoProductores = productores.length > 0 ? Math.max(...productores.map(p => p.codigo)) : 1000;
    const productor = {
      codigo: maxCodigoProductores + 1,
      nombre: nombre,
    };
    productores.push(productor);
    localStorage.setItem("productores", JSON.stringify(productores));
    input.value = "";
    mostrarProductoresRegistrados();
    Toastify({
      text: "Productor agregado correctamente", // Mensaje de éxito de la sesión
      duration: 2000, // Duración de la notificación (2 segundos)
      close: true, // Mostrar botón de cerrar
      gravity: "top", // Posición de la notificación (arriba)
      position: "right", // Posición a la derecha
      stopOnFocus: true, // Evitar que la notificación se cierre al pasar el ratón por encima
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
      },
    }).showToast();
  } else {
    Swal.fire({
      icon: "error",
      title: "El productor ya se encuentra registrado",
      showConfirmButton: false,
      timer: 1500
    });
  }
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

function mostrarProductoresRegistrados() {
  const lista = document.getElementById("lista-productores-registrados");
  if (!lista) return;

  const productores = JSON.parse(localStorage.getItem("productores") || "[]");

  lista.innerHTML = `
        <h3 class="mb-5">Lista de productores</h3>
        <table id="tabla-productoress" class="table table-hover">
          <thead>
            <tr class="table-primary">
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${productores.map((p, index) =>
    `
              <tr>
                <td>${p.nombre}</td>
                <td>
                  <button type="button" class="btn btn-success" onclick="editarProductor(${index})">
                    <i class="bi bi-pen"></i>
                  </button>
                  <button type="button" class="btn btn-danger" onclick="eliminarProductor(${index})">
                    <i class="bi bi-trash3"></i>
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

  new DataTable("#tabla-productores", {
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

function eliminarProductor(index) {
  const productores = JSON.parse(localStorage.getItem("productores") || "[]");
  Swal.fire({
    title: "¿Desea eliminar este proveedor?",
    text: "No puede revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      productores.splice(index, 1);
      localStorage.setItem("productores", JSON.stringify(productores));
      loadSection("agregar-productor");
      Toastify({
        text: "Proveedor eliminado correctamente", // Mensaje de éxito de la sesión
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

function editarProductor(index) {
  const productores = JSON.parse(localStorage.getItem("productores") || "[]");
  const productor = productores[index];

  fetch("../pages/agregar-productor.html")
    .then(res => res.text())
    .then(html => {
      const content = document.getElementById("main-content");
      const breadcrumb = document.getElementById("breadcrumb");
      breadcrumb.textContent = "Dashboards / Gestión de proveedores / Editar proveedor";
      content.innerHTML = html;

      setTimeout(() => {
        const form = document.getElementById("form-productor");
        if (form) {
          form.querySelector("#nombre-productor").value = productor.nombre;

          const divBtns = document.getElementById("btns");
          // Cambiar texto del botón
          const submitBtn = form.querySelector("button[type='submit']");
          submitBtn.textContent = "Actualizar proveedor";
          //Agregar boton cancelar
          const cancelBtn = document.createElement("button");
          cancelBtn.type = "button";
          cancelBtn.classList.add('btn', 'btn-danger');
          cancelBtn.textContent = "Cancelar";
          cancelBtn.addEventListener("click", (e) => {
            e.preventDefault();
            loadSection("agregar-productor");
          });
          divBtns.appendChild(cancelBtn);

          form.onsubmit = function (e) {
            e.preventDefault();

            const nombreProd = document.getElementById("nombre-productor");
            validateName(nombreProd, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/)

            productores[index] = {
              nombre: nombreProd.value
            }

            localStorage.setItem("productores", JSON.stringify(productores));
            Toastify({
              text: "Productor actualizado correctamente", // Mensaje de éxito de la sesión
              duration: 2000, // Duración de la notificación (2 segundos)
              close: true, // Mostrar botón de cerrar
              gravity: "top", // Posición de la notificación (arriba)
              position: "right", // Posición a la derecha
              stopOnFocus: true, // Evitar que la notificación se cierre al pasar el ratón por encima
              style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
              },
            }).showToast();
            loadSection("agregar-productor");
          };
        }
      }, 100);
    })
    .catch(err => {
      console.error("Error al cargar el formulario de edición:", err);
    });
}

function toggleSubmenu(element) {
  const parent = element.parentElement;
  parent.classList.toggle("open");
}

function guardarPublicacion(event) {
  event.preventDefault();

  const tituloPub = document.getElementById("titulo");
  validateName(tituloPub, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/)
  const descripcionPub = document.getElementById("descripcion");
  validateDescription(descripcionPub);
  const fechaPub = document.getElementById("fechaPublicacion");
  validateDate(fechaPub);

  const reader = new FileReader();
  const file = document.getElementById("imagen").files[0];

  reader.onload = function () {
    const publicacion = {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      fecha: document.getElementById("fechaPublicacion").value,
      imagen: reader.result
    };

    const publicaciones = JSON.parse(localStorage.getItem("publicaciones") || "[]");
    publicaciones.push(publicacion);
    localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
    Toastify({
      text: "Publicación guardada correctamente", // Mensaje de éxito de la sesión
      duration: 2000, // Duración de la notificación (2 segundos)
      close: true, // Mostrar botón de cerrar
      gravity: "top", // Posición de la notificación (arriba)
      position: "right", // Posición a la derecha
      stopOnFocus: true, // Evitar que la notificación se cierre al pasar el ratón por encima
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
      },
    }).showToast();
    loadSection("ver-publicaciones");
  };

  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Solo puedes subir imágenes (JPG, PNG, etc).");
      return;
    }
    // Validar tamaño (ejemplo: máximo 1MB)
    if (file.size > 1024 * 1024) {
      alert("La imagen no puede superar 1MB.");
      return;
    }
    reader.readAsDataURL(file);
  } else {
    alert("Por favor selecciona una imagen.");
  }
}

function eliminarPublicacion(index) {
  const publicaciones = JSON.parse(localStorage.getItem("publicaciones") || "[]");
  if (confirm("¿Deseas eliminar esta publicación?")) {
    publicaciones.splice(index, 1);
    localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
    loadSection("ver-publicaciones");
  }
}

function editarPublicacion(index) {
  const publicaciones = JSON.parse(localStorage.getItem("publicaciones") || "[]");
  const publicacion = publicaciones[index];

  fetch("../pages/agregar-publicacion.html")
    .then(res => res.text())
    .then(html => {
      const content = document.getElementById("main-content");
      const breadcrumb = document.getElementById("breadcrumb");
      breadcrumb.textContent = "Dashboards / Gestión de publicaciones / Editar publicación";
      content.innerHTML = html;

      setTimeout(() => {
        const form = document.getElementById("agregarPublicacion");
        if (form) {
          form.querySelector("#titulo").value = publicacion.titulo;
          form.querySelector("#fechaPublicacion").value = publicacion.fecha;
          form.querySelector("#descripcion").value = publicacion.descripcion;

          // Mostrar vista previa de la imagen actual
          const preview = document.getElementById("img-previa");
          preview.src = publicacion.imagen;
          preview.src !== '' ? preview.parentNode.classList.remove('d-none') : preview.parentNode.classList.add('d-none');
          preview.style.display = "block";

          // Cambiar texto del botón
          const submitBtn = form.querySelector("button[type='submit']");
          submitBtn.textContent = "Actualizar publicación";

          form.onsubmit = function (e) {
            e.preventDefault();

            const tituloPub = document.getElementById("titulo");
            validateName(tituloPub, /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/)
            const descripcionPub = document.getElementById("descripcion");
            validateDescription(descripcionPub);
            const fechaPub = document.getElementById("fechaPublicacion");
            validateDate(fechaPub);

            const file = document.getElementById("imagen").files[0];

            if (file) {
              const reader = new FileReader();
              reader.onload = function () {
                actualizarPublicacion(index, reader.result);
              };
              reader.readAsDataURL(file);
              // Validar tipo de archivo
              if (!file.type.startsWith("image/")) {
                alert("Solo puedes subir imágenes (JPG, PNG, etc).");
                return;
              }
              // Validar tamaño (ejemplo: máximo 1MB)
              if (file.size > 1024 * 1024) {
                alert("La imagen no puede superar 1MB.");
                return;
              }
            } else {
              // Si no se selecciona nueva imagen, se mantiene la actual
              actualizarPublicacion(index, publicacion.imagen);
            }
          };
        }
      }, 100);
    })
    .catch(err => {
      console.error("Error al cargar el formulario de edición:", err);
    });
}

function actualizarPublicacion(index, imagenBase64) {
  const publicaciones = JSON.parse(localStorage.getItem("publicaciones") || "[]");

  publicaciones[index] = {
    titulo: document.getElementById("titulo").value,
    descripcion: document.getElementById("descripcion").value,
    fecha: document.getElementById("fechaPublicacion").value,
    imagen: imagenBase64
  };

  localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
  Toastify({
    text: "Publicación actualizada correctamente", // Mensaje de éxito de la sesión
    duration: 2000, // Duración de la notificación (2 segundos)
    close: true, // Mostrar botón de cerrar
    gravity: "top", // Posición de la notificación (arriba)
    position: "right", // Posición a la derecha
    stopOnFocus: true, // Evitar que la notificación se cierre al pasar el ratón por encima
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)", // Estilo de fondo
    },
  }).showToast();
  loadSection("ver-publicaciones");
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
// Validaciones para formulario de contacto con Bootstrap y Formspree

function inputs() {
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

// Función para mostrar campo válido
function setValid(field) {

  field.classList.remove('is-invalid');
  field.classList.add('is-valid');

  const feedback = field.parentNode.querySelector('.invalid-feedback');
  if (feedback) feedback.style.display = 'none';
}

// Función para mostrar campo inválido
function setInvalid(field, message) {
  field.classList.remove('is-valid');
  field.classList.add('is-invalid');

  const validFeedback = field.parentNode.querySelector('.valid-feedback');
  if (validFeedback) validFeedback.style.display = 'none';

  let feedback = field.parentNode.querySelector('.invalid-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.classList.add('invalid-feedback');
    field.parentNode.appendChild(feedback);
  }
  feedback.textContent = message;
  feedback.style.display = 'block';
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

// Validación de descripcion
function validateDescription(field) {
  const value = field.value.trim();
  if (value === '') {
    setInvalid(field, 'La descripción es obligatoria');
    return false;
  } else if (value.length < 10) {
    setInvalid(field, 'La descripción debe tener al menos 10 caracteres');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

// Validación de categoria
function validateInquiry(field) {
  if (field.value === '0' || field.value === 'Selecciona el tipo de requerimiento') {
    setInvalid(field, 'Por favor selecciona una opción');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

// Validación valores negativos
function validateNegative(field) {

  if (field.value === '0' || field.value === '') {
    setInvalid(field, 'El valor debe ser mayor a 0');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

function validateDate(field) {
  if (field.value === '') {
    setInvalid(field, "Se debe escoger una fecha de publicación");
    return false;
  } else {
    setValid(field);
    return true;
  }
}

function validateFile(field) {
  const file = field.files[0];
  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setInvalid(field, "Solo puedes subir imágenes (JPG, PNG, etc).");
      return false;
    } else if (file.size > 1024 * 1024) { // Validar tamaño (ejemplo: máximo 1MB)
      setInvalid(field, "La imagen no puede superar 1MB.");
      return false;
    } else {
      setValid(field);
      return true;
    }
  } else {
    setInvalid(field, "Por favor selecciona una imagen.");
  }
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

function dateValidation() {
  const fechaPub = document.getElementById('fechaPublicacion');

  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, '0');
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const anio = hoy.getFullYear();

  const fechaActual = `${anio}-${mes}-${dia}`;

  fechaPub.setAttribute("min", fechaActual);
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

// exit
function handleUserClick() {
  if (!current) return (window.location.href = '../pages/login.html'); // [5]
  localStorage.removeItem('currentUser');
  window.location.href = '../pages/login.html';
}

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



const current = JSON.parse(localStorage.getItem('currentUser') || 'null');
if (current && current.rol === 'admin') {
  window.loadSection = loadSection;
  window.toggleSubmenu = toggleSubmenu;
  window.eliminarProducto = eliminarProducto;
  window.editarProducto = editarProducto;
  window.guardarProducto = guardarProducto;
  window.guardarProductor = guardarProductor;
  window.eliminarPublicacion = eliminarPublicacion;
  window.editarPublicacion = editarPublicacion;
  document.addEventListener("load", loadSection('home'));
} else {
  window.location.href = '../pages/login.html';
}






