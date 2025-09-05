

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
            recomendado['elemento'].src = mezclados[0].imagen.startsWith("data:") ? mezclados[0].imagen : `../public/img/productos/${mezclados[0].imagen}`;
        }
    });

}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    recomendaciones();
});