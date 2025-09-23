/* carrito.js - maneja UI local + sincronización con backend (si hay jwt) */

/* ================== AJUSTES VISUALES ================== */
function ajustarCarrito() {
  const navbar = document.querySelector('#navbar');
  const carritoEl = document.querySelector('#carrito');
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  if (carritoEl) carritoEl.style.top = navbarHeight + 'px';
}

/* ================== ESTADO (localStorage) ================== */
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

/* ================== HELPERS ================== */
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function precioCOP(valor) {
  return Number(valor).toLocaleString("es-CO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


/* ================== FUNCIONES DE CARRITO (local + sync) ================== */

// Agregar al carrito (usa obtenerProductoID para validar stock público)
async function agregarACarrito(id) {
  try {
    if (!id) return console.warn('agregarACarrito: id inválido');

    const productoSeleccionado = await obtenerProductoID(id); // público: makeRequest

    if (!productoSeleccionado) {
      Swal.fire({ text: "No se encontró el producto", icon: "error", timer: 1800, showConfirmButton: false });
      return;
    }

    const stockDisponible = Number(productoSeleccionado.stock ?? 0);
    if (stockDisponible <= 0) {
      Swal.fire({ text: "No hay unidades disponibles", icon: "error", timer: 1800, showConfirmButton: false });
      return;
    }

    const index = carrito.findIndex(p => String(p.id) === String(productoSeleccionado.id));

    if (index !== -1) {
      carrito[index].cantidad_carrito += 1;
    } else {
      carrito.push({
        id: productoSeleccionado.id,
        nombre: productoSeleccionado.nombre,
        precio: Number(productoSeleccionado.precio || 0),
        imagen: productoSeleccionado.imagen || '',
        categoria: productoSeleccionado.categoria || '',
        cantidad_carrito: 1
      });
    }

    guardarCarrito();

    // ✅ Actualizar stock en backend (nuevo stock = stock actual - 1)
    const nuevoStock = productoSeleccionado.stock - 1;
    await actualizarStockProductoAPI(productoSeleccionado.id, nuevoStock);

    renderCarrito();

    Swal.fire({ text: "Producto agregado a la canasta", icon: "success", timer: 1400, showConfirmButton: false });
  } catch (err) {
    console.error('Error en agregarACarrito:', err);
    Swal.fire({ text: "Error al agregar producto", icon: "error", timer: 1600, showConfirmButton: false });
  }
}

// Renderizar carrito desde localStorage
function renderCarrito() {
  const carritoCuerpo = document.getElementById("carrito-body");
  if (!carritoCuerpo) return console.warn('renderCarrito: #carrito-body no existe');

  carritoCuerpo.innerHTML = "";

  if (!carrito || carrito.length === 0) {
    carritoCuerpo.innerHTML = `<p id="texto-carro-vacio" class="text-center">No hay productos en la canasta</p>`;
    return;
  }

  let totalCarrito = 0;

  carrito.forEach(p => {
    const totalProducto = (Number(p.precio) || 0) * (p.cantidad_carrito || 0);
    totalCarrito += totalProducto;

    const item = document.createElement('div');
    item.className = 'row justify-content-center align-items-center mb-2 mx-1';

    item.innerHTML = `
      <div class="col-2">
        <img src="${p.imagen ? `http://localhost:8080${p.imagen}` : ''}"
         alt="${p.nombre}" style="width:60px; height:60px; object-fit:cover;">
      </div>
      <div class="col-5 flex-grow-1">
        <p class="mb-0">${p.nombre}</p>
        <small>$${precioCOP(totalProducto)}</small>
      </div>
      <div class="col-4 flex-grow-1 d-flex align-items-center">
        <button type="button" class="btn btn-info py-0 px-1 btn-restar" data-id="${p.id}">
          <i class="fw-bold bi bi-dash menos-producto"></i>
        </button>
        <span class="mx-2 qty">${p.cantidad_carrito}</span>
        <button type="button" class="btn btn-primary py-0 px-1 btn-sumar" data-id="${p.id}">
          <i class="fw-bold bi bi-plus"></i>
        </button>
      </div>
      <div class="col-1 text-end">
        <button class="btn btn-sm btn-danger btn-remove" data-id="${p.id}"><span class="fw-bold">X</span></button>
      </div>
    `;

    carritoCuerpo.appendChild(item);

    // listeners locales 
    item.querySelector('.btn-restar')?.addEventListener('click', () => cambiarCantidad(p.id, -1));
    item.querySelector('.btn-sumar')?.addEventListener('click', () => cambiarCantidad(p.id, 1));
   
    item.querySelector('.btn-remove')?.addEventListener('click', () => eliminarDelCarrito(p.id));
  });

  // Footer
  const footer = document.createElement('div');
  footer.className = 'carrito-footer mt-3 text-end';

  const totalProductos = carrito.reduce((acc, p) => acc + (p.cantidad_carrito || 0), 0);

  footer.innerHTML = `
    <hr>
    <h6>Total de productos : ${totalProductos}</h6>
    <h5>Valor Total : $${precioCOP(totalCarrito)}</h5>
    <button type="button" id="btn-pagar" class="btn btn-success mt-2">Ir a pagar</button>
  `;

  carritoCuerpo.appendChild(footer);

  // ✅ MEJORADO: Listener con más validaciones
  const btnPagar = document.getElementById('btn-pagar');
  if (btnPagar) {
    // Remover listeners previos (por si acaso)
    btnPagar.removeEventListener('click', validarSesion);
    // Agregar el listener
    btnPagar.addEventListener('click', validarSesion);
    console.log('Event listener agregado al botón pagar'); // Para debug
  } else {
    console.warn('No se encontró el botón #btn-pagar');
  }
}

// Cambiar cantidad en local y sync
async function cambiarCantidad(id, delta) {
  try {
    // 1) Busca el índice y aborta si no existe
    const idx = carrito.findIndex(p => String(p.id) === String(id));
    if (idx === -1) return console.warn('Producto no existe en carrito');

    // 2) Trae stock actual de backend
    const productoBackend = await obtenerProductoID(id);
    const stockDisponible = Number(productoBackend?.stock ?? 0);
    const cantidadActual = carrito[idx].cantidad_carrito;
    const nuevaCantidad = cantidadActual + delta;

    // 3) Solo al sumar validar límite superior
    if (delta > 0 && nuevaCantidad > stockDisponible) {
      Swal.fire({
        text: "No hay unidades disponibles",
        icon: "error",
        timer: 1400,
        showConfirmButton: false
      });
      return;
    }

    // 4) Si nuevaCantidad < 1 → removemos del carrito
    if (nuevaCantidad < 1) {
      carrito.splice(idx, 1);
    } else {
      // 5) Sino, actualizamos cantidad en el carrito
      carrito[idx].cantidad_carrito = nuevaCantidad;
    }

    // 6) Guarda y renderiza
    guardarCarrito();
    renderCarrito();

    // 7) Calcula stock global (funciona para delta positivo y negativo)
    const nuevoStockGlobal = stockDisponible - delta;

    // 8) Sincroniza con backend
    try {
      await actualizarStockProductoAPI(id, nuevoStockGlobal);
    } catch (syncErr) {
      console.error('Error al sincronizar stock:', syncErr);
      // Aquí podrías revertir o mostrar notificación al usuario
    }
  } catch (err) {
    console.error('Error en cambiarCantidad:', err);
    Swal.fire({
      text: "Ocurrió un error al actualizar la cantidad",
      icon: "error",
      timer: 1600,
      showConfirmButton: false
    });
  }
}

// Eliminar del carrito (local + sync)
async function eliminarDelCarrito(id) {
  try {
    // 1) Busca el índice y aborta si no existe
    const idx = carrito.findIndex(p => String(p.id) === String(id));
    if (idx === -1) {
      console.warn('Producto no existe en carrito');
      return;
    }

    // 2) Trae stock actual de backend
    const productoBackend = await obtenerProductoID(id);
    const stockDisponible = Number(productoBackend?.stock ?? 0);
    const cantidadActual = carrito[idx].cantidad_carrito;

    // 3) Calcula el nuevo stock global tras devolver todas las unidades
    const nuevoStockGlobal = stockDisponible + cantidadActual;

    // 4) Elimina del carrito, guarda y renderiza
    carrito = carrito.filter(p => String(p.id) !== String(id));
    guardarCarrito();
    renderCarrito();

    // 5) Sincroniza con backend
    try {
      await actualizarStockProductoAPI(id, nuevoStockGlobal);
    } catch (syncErr) {
      console.error('Error al sincronizar stock:', syncErr);
      // Opcional: notificar al usuario o reinsertar el producto localmente
    }

  } catch (err) {
    console.error('Error en eliminarDelCarrito:', err);
    Swal.fire({
      text: "Ocurrió un error al eliminar el producto",
      icon: "error",
      timer: 1600,
      showConfirmButton: false
    });
  }
}

/* ================== EVENTOS ================== */

// Como alternativa, puedes usar delegación de eventos para el botón pagar también
document.addEventListener('click', (e) => {
  // Botones "Agregar" existentes
  const addBtn = e.target.closest('.val-agregar-btn');
  if (addBtn) {
    const id = addBtn.dataset.id;
    if (id) agregarACarrito(id);
    return;
  }

  if (e.target.id === 'btn-pagar' || e.target.closest('#btn-pagar')) {
    validarSesion();
  }
});

/* ================== SESIÓN / REDIRECCIÓN ================== */
function validarSesion() {

  const token = localStorage.getItem('jwt');
  const currentUserStr = localStorage.getItem('currentUser');

  if (!token) {
    window.location.href = '/src/pages/login.html';
    return;
  }

  // Validar que currentUser existe y se puede parsear
  let currentUser;
  try {
    currentUser = JSON.parse(currentUserStr);
  } catch (error) {
    window.location.href = '/src/pages/login.html';
    return;
  }

  if (!currentUser || currentUser.rol == 1) {
    window.location.href = '/src/pages/login.html';
  } else {
    window.location.href = '/src/pages/ver-carrito.html';
  }
}

/* ================== INICIALIZACIÓN ================== */
window.addEventListener('load', () => {
  ajustarCarrito();
  renderCarrito();
});
window.addEventListener('resize', ajustarCarrito);
document.addEventListener('shown.bs.collapse', ajustarCarrito);
document.addEventListener('hidden.bs.collapse', ajustarCarrito);
