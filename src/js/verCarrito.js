let carrito;

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
          <img src="${p.imagen.startsWith("data:") ? p.imagen : `/src/public/img/productos/${p.imagen}`}" 
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
    mostrarRecomendados();
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

function recomendaciones() {
    if (carrito.length === 0) return null;

    const counts = carrito.reduce((acc, p) => {
        acc[p.categoria] = (acc[p.categoria] || 0) + 1;
        return acc;
    }, {});

    const max = Math.max(...Object.values(counts));

    const categoriasGanadoras = Object.keys(counts).filter(cat => counts[cat] === max);

    const categoriasValidas = categoriasGanadoras.filter(cat =>
        productos.some(p => p.categoria === cat && !carrito.some(c => c.codigo === p.codigo) && p.cantidad > 0)
    );

    let recomendados = [];

    const numCatValidas = categoriasValidas.length;

    categoriasValidas.forEach(cat => {
        const productosCategoria = productos.filter(p =>
            p.categoria === cat && !carrito.some(c => c.codigo === p.codigo)
        );

        switch (numCatValidas) {
            case 1:
                const mezclados1 = productosCategoria.sort(() => 0.5 - Math.random());
                recomendados.push(...mezclados1.slice(0, 3));
                break;

            case 2:
                const catMaxProd = Math.random() < 0.5 ? categoriasValidas[0] : categoriasValidas[1];
                if (cat === catMaxProd) {
                    const mezclados2 = productosCategoria.sort(() => 0.5 - Math.random());
                    recomendados.push(...mezclados2.slice(0, 2));
                } else {
                    const randomIndex = Math.floor(Math.random() * productosCategoria.length);
                    recomendados.push(productosCategoria[randomIndex]);
                }
                break;

            case 3:
                const randomIndex2 = Math.floor(Math.random() * productosCategoria.length);
                recomendados.push(productosCategoria[randomIndex2]);
                break;
        }
    });

    return recomendados;
}

function mostrarRecomendados() {
    const contenedor = document.getElementById("recomendacionesContainer");
    contenedor.innerHTML = ""; // limpiar antes de renderizar

    listaProductos = recomendaciones();

    if (listaProductos.length === 0) {
        contenedor.innerHTML = `
      <h3>Lista de productos</h3>
      <p>No hay productos registrados.</p>
    `;
    } else {
        listaProductos.forEach(producto => {
            if (producto.cantidad > 0) {
                // Buscar productor por código
                const productor = productores.find(p => p.codigo === producto.productor);

                contenedor.innerHTML += `
          <div class="col">
            <div class="card mb-3 product-h" data-category="${producto.categoria}">
              <div class="row g-0 align-items-center my-auto">
                <div class="col-4">
                  <img src="${producto.imagen.startsWith("data:")
                        ? producto.imagen
                        : `/src/public/img/productos/${producto.imagen}`
                    }" 
                  class="img-fluid rounded-start product-h-img" alt="${producto.nombre}" />
                </div>
                <div class="col-8">
                  <div class="card-body d-flex flex-column justify-content-between h-100">
                    <h5 class="card-title mb-2">${producto.nombre}</h5>
                    <p class="card-text mb-3">${producto.descripcion}</p>
                    <ul class="list-unstyled small mb-3">
                      <li>
                        Productor: 
                        <a href="#" class="producer-link">
                          ${productor ? productor.nombre : "Desconocido"}
                        </a>
                      </li>
                      <li>
                        Presentación: ${producto.presentacion} <span>${producto.medida}</span>
                      </li>
                    </ul>
                    <div class="mt-auto d-flex flex-wrap gap-2 align-items-center">
                      <span class="price mb-0">Precio: ${precioCOP(producto.precio)}</span>
                      <button href="#" class="btn btn-primary ms-auto agregar-btn val-agregar-btn" 
                        onclick="agregarAcarrito(${producto.codigo})">
                        Agregar a la canasta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
            }
        });
    }
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
    carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    mostrarProductosCarrito();
    mostrarRecomendados();
});