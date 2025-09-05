
//Función formato precio
function precioCOP(valor) {
    let precioFormateado = valor.toLocaleString("es-CO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return precioFormateado
};

// Función para mostrar todos los productos
function mostrarProductos(listaProductos, idContenedor) {
    const contenedor = document.getElementById(idContenedor);
    contenedor.innerHTML = ""; // limpiar antes de renderizar

    if (listaProductos.length === 0) {
        contenedor.innerHTML = `
        <h3>Lista de productos</h3>
        <p>No hay productos registrados.</p>
      `;
    } else {

        listaProductos.forEach(producto => {
            if (producto.cantidad > 0) {
                contenedor.innerHTML += `
                    <div class="col">
                        <div class="card mb-3 product-h" data-category="${producto.categoria}">
                            <div class="row g-0 align-items-center">
                                <div class="col-md-4">
                                    <img src="${producto.imagen.startsWith("data:") ? producto.imagen : `../public/img/productos/${producto.imagen}`}" 
                                    class="img-fluid rounded-start product-h-img" alt="${producto.nombre}" />
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body d-flex flex-column h-100">
                                        <h5 class="card-title mb-2">${producto.nombre}</h5>
                                        <p class="card-text mb-3">${producto.descripcion}</p>
                                        <ul class="list-unstyled small mb-3">
                                            <li>Productor: <a href="#" class="producer-link">${producto.productor}</a></li>
                                            <li>Presentación: ${producto.presentacion}</li>
                                        </ul>
                                        <div class="mt-auto d-flex flex-wrap gap-2 align-items-center">
                                            <span class="price mb-0">Precio: ${precioCOP(producto.precio)}</span>
                                            <button href="#" class="btn btn-primary ms-auto agregar-btn" 
                                            onclick="agregarAcarrito(${producto.codigo})">Agregar a la canasta</button>
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

// Función para filtrar productos
function filtrarPorCategoria(categoria) {
    if (categoria === "todos") return productos;
    return productos.filter(producto => producto.categoria === categoria);
}



// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    // Mostrar todos los productos al inicio
    const productos = JSON.parse(localStorage.getItem("productos") || "[]");
    mostrarProductos(productos, "productosContainer");

    const inputsCategoria = document.querySelectorAll('input[name="categoria"]');
    const labelsCategoria = document.querySelectorAll('.container-category label');


    const labelTodos = document.querySelector('label[for="todos"]');
    if (labelTodos) labelTodos.classList.add('activo');

    // Event listeners para filtrar productos
    inputsCategoria.forEach(input => {
        input.addEventListener("change", () => {
            const listaFiltrada = filtrarPorCategoria(input.value);
            mostrarProductos(listaFiltrada, "productosContainer");

            // Quitar clase activo de todos los labels
            labelsCategoria.forEach(label => label.classList.remove('activo'));

            // Agregar clase activo al label seleccionado
            const labelSeleccionado = document.querySelector(`label[for="${input.id}"]`);
            if (labelSeleccionado) {
                labelSeleccionado.classList.add('activo');
            }
        });
    });

});


