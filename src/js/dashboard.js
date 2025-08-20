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
        <style>
          #tabla-productos {
            width: 90%;
            margin: 30px auto;
            border-collapse: collapse;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          #tabla-productos th, #tabla-productos td {
            padding: 12px 15px;
            text-align: center;
            border: 1px solid #ddd;
          }
          #tabla-productos th {
            background-color: #007bff;
            color: white;
            font-weight: bold;
          }
          #tabla-productos tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          #tabla-productos img {
            border-radius: 8px;
          }
          #tabla-productos button {
            padding: 6px 12px;
            margin: 2px;
            border: none;
            border-radius: 4px;
            background-color: #28a745;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          #tabla-productos button:hover {
            background-color: #218838;
          }
          #tabla-productos button:nth-child(2) {
            background-color: #dc3545;
          }
          #tabla-productos button:nth-child(2):hover {
            background-color: #c82333;
          }
        </style>
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





