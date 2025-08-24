function loadSection(section) {
  const content = document.getElementById("main-content");
  const breadcrumb = document.getElementById("breadcrumb");

  if (section === "agregar-producto") {

breadcrumb.textContent = "Dashboards / Gestión de productos / Agregar producto";
  fetch("../pages/agregar-producto.html")
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      cargarSugerenciasProductores(); // 👈 Aquí se cargan las sugerencias
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

        <h3 style="text-align:center;">Lista de productos</h3>
        <table id="tabla-productos">
          <thead>
            <tr>
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
            ${productos.map((p, index) => `
              <tr>
                <td><img src="${p.imagen}" alt="${p.nombre}" style="width:50px;height:50px;"></td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precio}</td>
                <td>${p.productor}</td>
                <td>
                  <button onclick="editarProducto(${index})">Editar</button>
                  <button onclick="eliminarProducto(${index})">Eliminar</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
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


  } else {
    breadcrumb.textContent = `Dashboards / ${section}`;
    content.innerHTML = `<h3>${section}</h3><p>Contenido en construcción...</p>`;
  }

}

function guardarProducto(event) {
  event.preventDefault();

  const reader = new FileReader();
  const file = document.getElementById("imagen").files[0];

  reader.onload = function () {
    const producto = {
      nombre: document.getElementById("nombre").value,
      productor: document.getElementById("productor").value,
      categoria: document.getElementById("categoria").value,
      cantidad: document.getElementById("cantidad").value,
      precio: document.getElementById("precio").value,
      imagen: reader.result
    };

    const productos = JSON.parse(localStorage.getItem("productos") || "[]");
    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));
    alert("Producto agregado correctamente");
    loadSection("ver-productos");
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    alert("Por favor selecciona una imagen.");
  }
}

function guardarProductor(event) {
  event.preventDefault();
  const input = document.getElementById("nombre-productor");
  const nombre = input.value.trim();

  if (nombre === "") return;

  const productores = JSON.parse(localStorage.getItem("productores") || "[]");
  if (!productores.includes(nombre)) {
    productores.push(nombre);
    localStorage.setItem("productores", JSON.stringify(productores));
    input.value = "";
    mostrarProductoresRegistrados();
    alert("Productor guardado correctamente");
  } else {
    alert("Este productor ya está registrado.");
  }
}

function mostrarProductoresRegistrados() {
  const lista = document.getElementById("lista-productores-registrados");
  if (!lista) return;

  const productores = JSON.parse(localStorage.getItem("productores") || "[]");
  lista.innerHTML = productores.map(p => `<li>${p}</li>`).join("");
}

function toggleSubmenu(element) {
  const parent = element.parentElement;
  parent.classList.toggle("open");
}

function eliminarProducto(index) {
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");
  if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    loadSection("ver-productos");
  }
}

function editarProducto(index) {
  const productos = JSON.parse(localStorage.getItem("productos") || "[]");
  const producto = productos[index];
  alert(`Editar producto: ${producto.nombre}`);
}
function cargarSugerenciasProductores() {
  const datalist = document.getElementById("lista-productores");
  if (!datalist) return;

  const productores = JSON.parse(localStorage.getItem("productores") || "[]");
  datalist.innerHTML = productores.map(p => `<option value="${p}">`).join("");
}

function guardarPublicacion(event) {
  event.preventDefault();

  const reader = new FileReader();
  const file = document.getElementById("imagen").files[0];

  reader.onload = function () {
    const publicacion = {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      fecha: document.getElementById("fecha").value,
      imagen: reader.result
    };

    const publicaciones = JSON.parse(localStorage.getItem("publicaciones") || "[]");
    publicaciones.push(publicacion);
    localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
    alert("Publicación guardada correctamente");
    loadSection("ver-publicaciones");
  };

  if (file) {
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
        const form = document.getElementById("form-publicacion");
        if (form) {
          form.querySelector("#titulo").value = publicacion.titulo;
          form.querySelector("#fecha").value = publicacion.fecha;
          form.querySelector("#descripcion").value = publicacion.descripcion;

          // Mostrar vista previa de la imagen actual
          const preview = document.getElementById("preview-imagen");
          preview.src = publicacion.imagen;
          preview.style.display = "block";

          // Cambiar texto del botón
          const submitBtn = form.querySelector("button[type='submit']");
          submitBtn.textContent = "Actualizar publicación";

          form.onsubmit = function (e) {
            e.preventDefault();

            const file = document.getElementById("imagen").files[0];

            if (file) {
              const reader = new FileReader();
              reader.onload = function () {
                actualizarPublicacion(index, reader.result);
              };
              reader.readAsDataURL(file);
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
    fecha: document.getElementById("fecha").value,
    imagen: imagenBase64
  };

  localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
  alert("Publicación actualizada correctamente.");
  loadSection("ver-publicaciones");
}








