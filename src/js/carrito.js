function ajustarOffcanvas() {
  const navbar = document.querySelector('#navbar');
  const offcanvas = document.querySelector('#carrito');
  const navbarHeight = navbar.offsetHeight;

  offcanvas.style.top = navbarHeight + 'px';
  offcanvas.style.height = `calc(100% - ${navbarHeight}px)`;
}

const carritoCuerpo = document.getElementById("carrito-body");
if(carritoCuerpo.children.length === 0){
    carritoCuerpo.innerHTML = `<p id="texto-carro-vacio" class="text-center">No hay productos en el carrito</p>`
}


window.addEventListener('resize', ajustarOffcanvas);
window.addEventListener('load', ajustarOffcanvas);

