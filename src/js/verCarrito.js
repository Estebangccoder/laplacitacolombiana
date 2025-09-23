// Función para mostrar todos los productos
function mostrarProductosCarrito() {
    const contenedor = document.getElementById("prodCarrito");
    contenedor.innerHTML = ""; // limpiar antes de renderizar

    const contenedorFacturaBoton = document.getElementById("facturaCarrito");

    const contenedorFactura = document.getElementById("valorCarrito");
    contenedorFactura.innerHTML = ""; // limpiar antes de renderizar


    let totalCarrito = 0;
    let descuento = 0;
    let costoEnvio = 0;

    if (!carrito || carrito.length == 0) {
        const btnIrPago = document.getElementById('irPago');
        btnIrPago.disabled = true;
        btnIrPago.classList.remove('btn-warning');
        btnIrPago.classList.add('btn-secondary');
        contenedor.innerHTML = "";
    }


    carrito.forEach(p => {
        const item = document.createElement('div');
        item.classList.add('row', 'justify-content-center', 'align-items-center',
            'mb-2', 'item-carrito', 'p-3', 'rounded-3', 'border', 'border-2', 'border-dark-subtle');

        const totalProducto = p.precio * p.cantidad_carrito;
        totalCarrito += totalProducto;

        item.innerHTML = `
        <div class="col-2">
          <img src="${p.imagen ? `http://localhost:8080${p.imagen}` : ''}"
          alt="${p.nombre}" style="width:60px; height:60px; object-fit:cover;">
        </div>
        <div class="col-5 flex-grow-1">
            <p class="mb-0">${p.nombre}</p>
            <small>
              $${totalProducto ? precioCOP(totalProducto) : "0"}
            </small>
        </div>
        <div class="col-4 flex-grow-1">
            <button type="button" class="btn btn-info py-0 px-1 btn-restar" data-id="${p.id}">
                <i class="fw-bold bi bi-dash menos-producto"></i>
            </button>
        
        
            <span class="mx-1">${p.cantidad_carrito}</span>
            <button type="button" class="btn btn-primary py-0 px-1 btn-sumar" data-id="${p.id}">
                <i class="fw-bold bi bi-plus"></i>
            </button>
        </div>
        <button class="col-1 btn btn-sm btn-danger btn-remove " data-id="${p.id}">
          <span class="fw-bold">X</span>
        </button>
      `;
      
    // listeners locales 
    item.querySelector('.btn-restar')?.addEventListener('click', () => cambiarCantidad(p.id, -1));
    item.querySelector('.btn-sumar')?.addEventListener('click', () => cambiarCantidad(p.id, 1));
    item.querySelector('.btn-remove')?.addEventListener('click', () => eliminarDelCarrito(p.id));

        contenedor.appendChild(item);
    });

    let costoTotal = totalCarrito + descuento + costoEnvio;

    contenedorFactura.innerHTML = `
        <div class="row mx-2">
            <p class="col-8">Subtotal</p>
            <p class="col-4">$${precioCOP(totalCarrito)}</p>
        </div>
        <div class="row mx-2">
            <p class="col-8">Descuento</p>
            <p class="col-4">$${precioCOP(descuento)}</p>
        </div>
        <div class="row mx-2">
            <p class="col-8">
                Costo de envío 
                <i class="bi bi-question-circle-fill" data-bs-toggle="tooltip" data-bs-placement="left" 
                data-bs-title="El costo del envío se calcula en el momento del pago"></i>
            </p>
            <p class="col-4">$${precioCOP(costoEnvio)}</p>
        </div>
        <div class="row mx-0">
            <div class="row mx-auto my-auto rounded-bottom-3 costo-total">
                <p class="col-8 my-2 fw-bold">Total</p>
                <p class="col-4 my-2 fw-bold">$${precioCOP(costoTotal)}</p>
            </div>
        </div>
    `
    

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function precioCOP(valor) {
    let precioFormateado = valor.toLocaleString("es-CO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return precioFormateado
}


function agregarAcarrito(cod) {

    const productoSeleccionado = productos.find(p => p.codigo === cod);
    const indexProducto = productos.findIndex(p => p.codigo == cod);
    if (!productoSeleccionado) return;

    const indexProductoEnCarrito = carrito.findIndex(p => p.codigo === cod);
    if (productos[indexProducto]['cantidad'] > 0) {
        if (indexProductoEnCarrito !== -1) {
            carrito[indexProductoEnCarrito].cantidad_carrito += 1;
            productos[indexProducto]['cantidad'] -= 1;
        } else {
            const p = {
                codigo: productoSeleccionado["codigo"],
                nombre: productoSeleccionado["nombre"],
                precio: productoSeleccionado["precio"],
                imagen: productoSeleccionado["imagen"],
                categoria: productoSeleccionado["categoria"],
                cantidad_carrito: 1,
            };
            carrito.push(p);
            productos[indexProducto]['cantidad'] -= 1;
        }

        Swal.fire({
            text: "Producto agregado a carrito",
            icon: "success",
            showConfirmButton: false,
            timer: 2000,
            allowEscapeKey: false,
            allowOutsideClick: false,
        });
    } else {
        Swal.fire({
            text: "No hay unidades disponibles",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            allowEscapeKey: false,
            allowOutsideClick: false,
        });
        return;
    };
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('productos', JSON.stringify(productos));

    mostrarProductosCarrito();
};

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {

    const canasta = document.querySelectorAll('.carrito-button');
    canasta.forEach(element => {
        element.classList.add('d-none');
    });

    carrito = JSON.parse(localStorage.getItem("carrito") || "[]");

    if (carrito.length == 0) {
        const btnIrPago = document.getElementById('irPago');
        btnIrPago.disabled = true;
        btnIrPago.classList.remove('btn-warning');
        btnIrPago.classList.add('btn-secondary');
    }
    mostrarProductosCarrito();
 
});

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
    mostrarProductosCarrito();

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
    mostrarProductosCarrito();

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


function recomendaciones() {
    let recomendados = [
        {
            categoria: 'Cafe',
            elemento: document.getElementById('cafe-destacado'),
        },
        {
            categoria: 'Cacao',
            elemento: document.getElementById('chocolate-destacado'),
        },
        {
            categoria: 'Cerveza',
            elemento: document.getElementById('cerveza-destacada'),
        }
    ];

    let categorias = ['Cafe', 'Cacao', 'Cerveza'];

    categorias.forEach(cat => {
        const productosCategoria = productos.filter(p =>
            p.categoria === cat && p.cantidad > 0);

        const mezclados = productosCategoria.sort(() => 0.5 - Math.random());
        const recomendado = recomendados.find(item => item.categoria === cat);
        if (mezclados[0].imagen) {
            recomendado['elemento'].src = mezclados[0].imagen.startsWith("data:") ? mezclados[0].imagen : `src/public/img/productos/${mezclados[0].imagen}`;
        }
    });

}
