let carrito;
let productos;

document.addEventListener("DOMContentLoaded", () => {
    const canasta = document.querySelectorAll('.carrito-button');
    canasta.forEach(element => {
        element.classList.add('d-none');
    });
});

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

    carrito.forEach(p => {
        const item = document.createElement('div');
        item.classList.add('row', 'justify-content-center', 'align-items-center', 
            'mb-2', 'item-carrito', 'p-3', 'rounded-3', 'border', 'border-2', 'border-dark-subtle');

        const totalProducto = p.precio * p.cantidad_carrito;
        totalCarrito += totalProducto;

        item.innerHTML = `
        <div class="col-2">
          <img src="${p.imagen.startsWith("data:") ? p.imagen : `../public/img/productos/${p.imagen}`}" 
          alt="${p.nombre}" style="width:60px; height:60px; object-fit:cover;">
        </div>
        <div class="col-5 flex-grow-1">
            <p class="mb-0">${p.nombre}</p>
            <small>
              $${totalProducto ? precioCOP(totalProducto) : "0"}
            </small>
        </div>
        <div class="col-4 flex-grow-1">
            <button type="button" class="btn btn-primary py-0 px-1" onclick="btnsSumar(${p.codigo})">
                <i class="fw-bold bi bi-plus"></i>
            </button>
            <span class="mx-1">${p.cantidad_carrito}</span>
            <button type="button" class="btn btn-info py-0 px-1" onclick="btnsRestar(${p.codigo})">
                <i class="fw-bold bi bi-dash menos-producto"></i>
            </button>
        </div>
        <button class="col-1 btn btn-sm btn-danger remove-btn" onclick="btnsQuitar(${p.codigo})"">
          <span class="fw-bold">X</span>
        </button>
      `;

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
            <p class="col-8">Costo de envío</p>
            <p class="col-4">$${precioCOP(costoEnvio)}</p>
        </div>
        <div class="row mx-0">
            <div class="row mx-auto my-auto rounded-bottom-3 costo-total">
                <p class="col-8 my-2 fw-bold">Total</p>
                <p class="col-4 my-2 fw-bold">$${precioCOP(costoTotal)}</p>
            </div>
        </div>
    `
}

function precioCOP(valor) {
    let precioFormateado = valor.toLocaleString("es-CO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return precioFormateado
}

function btnsSumar(cod) {
    const indexCarrito = carrito.findIndex(p => p.codigo === cod);
    const indexProducto = productos.findIndex(p => p.codigo == cod);

    if (indexCarrito !== -1) {
        if (productos[indexProducto]['cantidad'] > 0) {
            productos[indexProducto]['cantidad'] -= 1;
            carrito[indexCarrito].cantidad_carrito += 1;
            localStorage.setItem('carrito', JSON.stringify(carrito));
            localStorage.setItem('productos', JSON.stringify(productos));
            mostrarProductosCarrito(carrito, "prodCarrito");
        }
        else {
            //Stock no disponible
            Swal.fire({
                text: "No hay unidades disponibles",
                icon: "error",
                showConfirmButton: false,
                timer: 2000,
                allowEscapeKey: false,
                allowOutsideClick: false,
            });
            return;
        }
    }
}

function btnsRestar(cod) {
    const indexCarrito = carrito.findIndex(p => p.codigo === cod);
    const indexProducto = productos.findIndex(p => p.codigo == cod);
    if (indexCarrito !== -1) {
        if (carrito[indexCarrito].cantidad_carrito > 1) {
            carrito[indexCarrito].cantidad_carrito -= 1;
            productos[indexProducto]['cantidad'] += 1;
        } else {
            carrito.splice(indexCarrito, 1);
            productos[indexProducto]['cantidad'] += 1;
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        localStorage.setItem('productos', JSON.stringify(productos));
        mostrarProductosCarrito();
    }
}

function btnsQuitar(cod) {
    const indexCarrito = carrito.findIndex(p => p.codigo === cod);
    const indexProducto = productos.findIndex(p => p.codigo == cod);
    productos[indexProducto]['cantidad'] += carrito[indexCarrito].cantidad_carrito;
    carrito = carrito.filter(p => p.codigo !== cod);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('productos', JSON.stringify(productos));
    mostrarProductosCarrito();
}


// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    productos = JSON.parse(localStorage.getItem("productos") || "[]");
    mostrarProductosCarrito();
});