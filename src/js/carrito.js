function ajustarOffcanvas() {
  const navbar = document.querySelector('#navbar');
  const offcanvas = document.querySelector('#carrito');
  const navbarHeight = navbar.offsetHeight;
  offcanvas.style.top = navbarHeight + 'px';
  offcanvas.style.height = `calc(100% - ${navbarHeight}px)`;
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
        presentacion: productoSeleccionado["presentacion"],
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

      carritoCuerpo.appendChild(item);
    });

    // Footer con total y botón pagar
    const footer = document.createElement('div');
    footer.classList.add('carrito-footer', 'mt-3', 'text-end');

    footer.innerHTML = `
    <hr>
    <h5>Total: $${precioCOP(totalCarrito)}</h5>
    <a href="ver-carrito.html" id="btn-pagar" class="btn btn-success mt-2">Ir a pagar</a>
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

document.addEventListener("DOMContentLoaded", () => {
  ajustarOffcanvas();
  renderCarrito();
});


// function renderCarrito() {
//   const carritoCuerpo = document.getElementById("carrito-body");
//   carritoCuerpo.innerHTML = "";

//   const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

//   if (carrito.length === 0) {
//     carritoCuerpo.innerHTML = `<p id="texto-carro-vacio" class="text-center">No hay productos en el carrito</p>`;
//     return;
//   }

//   carrito.forEach(producto => {
//     const item = document.createElement('div');
//     item.classList.add('d-flex', 'align-items-center', 'mb-2');

//     item.innerHTML = `
//       <img src="${producto.img}" alt="${producto.alt}"
//            style="width:50px; height:50px; object-fit:cover; margin-right:10px;">
//       <div class="flex-grow-1">
//           <p class="mb-0">${producto.nombre}</p>
//           <small>
//             ${producto.cantidad_carrito} x $${producto.precio ? producto.precio.toLocaleString('es-CO') : "0"}
//           </small>
//       </div>
//       <button class="btn btn-sm btn-danger remove-btn" data-codigo="${producto.codigo}">&times;</button>
//     `;

//     carritoCuerpo.appendChild(item);
//   });

//   // Calcular total
//   const total = carrito.reduce((acc, producto) => {
//     return acc + ((producto.precio || 0) * producto.cantidad_carrito);
//   }, 0);

//   // Footer con total y botón pagar
//   const footer = document.createElement('div');
//   footer.classList.add('carrito-footer', 'mt-3', 'text-end');

//   footer.innerHTML = `
//     <hr>
//     <h5>Total: $${total.toLocaleString('es-CO')}</h5>
//     <button id="btn-pagar" class="btn btn-success mt-2">Ir a pagar</button>
//   `;

//   carritoCuerpo.appendChild(footer);


//   // Remover productos
//   const botonesRemover = carritoCuerpo.querySelectorAll('.remove-btn');
//   botonesRemover.forEach(btn => {
//     btn.addEventListener('click', () => {
//       const codigo = btn.getAttribute('data-codigo');
//       let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
//       carrito = carrito.filter(p => p.codigo != codigo);
//       localStorage.setItem('carrito', JSON.stringify(carrito));
//       renderCarrito();
//     });
//   });
// }


/***Para que funcione es todas las paginas se debe hacer lo siguiente:
 
En HTML:
 
en head:
 
    
    <link rel="stylesheet" href="../css/carrito.css"></link>
 
despues del header:
 
   <!--Carrito de compras-->
        <div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="carrito" aria-labelledby="carrito">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title fw-bold" id="carrito">Carrito de compras</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div id="carrito-body" class="offcanvas-body">
 
            </div>
        </div>
 
 
en las importaciones de Js:
 
<script type="module" src="../js/carrito.js"></script>
*/

