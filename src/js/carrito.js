function ajustarOffcanvas() {
  const navbar = document.querySelector('#navbar');
  const offcanvas = document.querySelector('#carrito');
  const navbarHeight = navbar.offsetHeight;

  offcanvas.style.top = navbarHeight + 'px';
  offcanvas.style.height = `calc(100% - ${navbarHeight}px)`;
}

const carritoCuerpo = document.getElementById("carrito-body");
if (carritoCuerpo.children.length === 0) {
  carritoCuerpo.innerHTML = `<p id="texto-carro-vacio" class="text-center">No hay productos en el carrito</p>`
}

document.addEventListener('DOMContentLoaded', () => {
  const carritoButtons = document.querySelectorAll('.carrito-button');
  
  carritoButtons.forEach(button => {
    button.addEventListener('click', () => {
      const offcanvasEl = document.getElementById('carrito');
      const bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
      bsOffcanvas.show();

      renderCarrito();
    });
  });

  ajustarOffcanvas();
});

window.addEventListener('resize', ajustarOffcanvas);
window.addEventListener('load', ajustarOffcanvas);


function renderCarrito() {
  const carritoCuerpo = document.getElementById("carrito-body");
  carritoCuerpo.innerHTML = "";

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  if (carrito.length === 0) {
    carritoCuerpo.innerHTML = `<p id="texto-carro-vacio" class="text-center">No hay productos en el carrito</p>`;
    return;
  }

  carrito.forEach(producto => {
    const item = document.createElement('div');
    item.classList.add('d-flex', 'align-items-center', 'mb-2');

    item.innerHTML = `
      <img src="${producto.img}" alt="${producto.alt}" 
           style="width:50px; height:50px; object-fit:cover; margin-right:10px;">
      <div class="flex-grow-1">
          <p class="mb-0">${producto.nombre}</p>
          <small>
            ${producto.cantidad_carrito} x $${producto.precio ? producto.precio.toLocaleString('es-CO') : "0"}
          </small>
      </div>
      <button class="btn btn-sm btn-danger remove-btn" data-codigo="${producto.codigo}">&times;</button>
    `;

    carritoCuerpo.appendChild(item);
  });

  // Calcular total
  const total = carrito.reduce((acc, producto) => {
    return acc + ((producto.precio || 0) * producto.cantidad_carrito);
  }, 0);

  // Footer con total y botón pagar 
  const footer = document.createElement('div');
  footer.classList.add('carrito-footer', 'mt-3', 'text-end');

  footer.innerHTML = `
    <hr>
    <h5>Total: $${total.toLocaleString('es-CO')}</h5>
    <button id="btn-pagar" class="btn btn-success mt-2">Ir a pagar</button>
  `;

  carritoCuerpo.appendChild(footer);

 
  // Remover productos
  const botonesRemover = carritoCuerpo.querySelectorAll('.remove-btn');
  botonesRemover.forEach(btn => {
    btn.addEventListener('click', () => {
      const codigo = btn.getAttribute('data-codigo');
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      carrito = carrito.filter(p => p.codigo != codigo);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      renderCarrito();
    });
  });
}


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
