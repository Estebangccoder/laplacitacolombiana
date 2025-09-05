function ajustarOffcanvas() {
  const navbar = document.querySelector('#navbar');
  const offcanvas = document.querySelector('#carrito');
  const navbarHeight = navbar.offsetHeight;
  offcanvas ? offcanvas.style.top = navbarHeight + 'px' : null;
  offcanvas ? offcanvas.style.height = `calc(100% - ${navbarHeight}px)` : null;
}

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Funcion de agregar Carrito

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

  renderCarrito();
};

//Renderizar carrito
function renderCarrito() {
  const carritoCuerpo = document.getElementById("carrito-body");
  carritoCuerpo.innerHTML = "";

  let totalCarrito = 0;

  if (carrito.length > 0) {
    carrito.forEach(p => {
      const item = document.createElement('div');
      item.classList.add('row', 'justify-content-center', 'align-items-center', 'mb-2');

      const totalProducto = p.precio * p.cantidad_carrito;
      totalCarrito += totalProducto;

      item.innerHTML = `
        <div class="col-2">
          <img src="${p.imagen ? (p.imagen.startsWith("data:") ? p.imagen : `../public/img/productos/${p.imagen}`) : " "}" 
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

      carritoCuerpo.appendChild(item);
    });

    // Footer con total y botón pagar
    const footer = document.createElement('div');
    footer.classList.add('carrito-footer', 'mt-3', 'text-end');

    footer.innerHTML = `
    <hr>
    <h5>Total: $${precioCOP(totalCarrito)}</h5>
    <button type="button" id="btn-pagar" class="btn btn-success mt-2" onclick="validarSesion()">Ir a pagar</button>
  `;

    carritoCuerpo.appendChild(footer);

  } else {
    carritoCuerpo.innerHTML = `<p id="texto-carro-vacio" class="text-center">No hay productos en el carrito</p>`;
    return;
  }
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
      renderCarrito();
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
    renderCarrito();
  }
}

function btnsQuitar(cod) {
  const indexCarrito = carrito.findIndex(p => p.codigo === cod);
  const indexProducto = productos.findIndex(p => p.codigo == cod);
  productos[indexProducto]['cantidad'] += carrito[indexCarrito].cantidad_carrito;
  carrito = carrito.filter(p => p.codigo !== cod);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  localStorage.setItem('productos', JSON.stringify(productos));
  renderCarrito();
}

function validarSesion() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
  currentUser ? window.location.href = '../pages/ver-carrito.html' : window.location.href = '../pages/login.html'
}

document.addEventListener("DOMContentLoaded", () => {
  ajustarOffcanvas();
  renderCarrito();
});


