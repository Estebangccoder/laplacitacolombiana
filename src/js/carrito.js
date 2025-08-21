function ajustarOffcanvas() {
  const navbar = document.querySelector('#navbar');
  const offcanvas = document.querySelector('#carrito');
  const navbarHeight = navbar.offsetHeight;

  offcanvas.style.top = navbarHeight + 'px';
  offcanvas.style.height = `calc(100% - ${navbarHeight}px)`;
}

function ajustarCarrito() {
  const carrito = document.getElementById('carrito');
  const body = carrito.querySelector('.offcanvas-body');

  if (body.children.length === 0) {
    carrito.style.minHeight = "100px"; // pequeño si está vacío
  } else {
    carrito.style.minHeight = "auto"; // normal si hay productos
  }
}


window.addEventListener('resize', ajustarOffcanvas);
window.addEventListener('load', ajustarOffcanvas);
window.addEventListener('load', ajustarCarrito);
