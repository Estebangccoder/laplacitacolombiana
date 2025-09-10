const factura = JSON.parse(localStorage.getItem("factura") || "[]");
const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
const factInfo = document.getElementById('content-body');
const factProd = document.getElementById('productos-fact');
const factBtn = document.getElementById('btnVolver');
factInfo.innerHTML = '';
factProd.innerHTML = '';

factInfo.innerHTML = `
        <div class="info d-flex justify-content-between">
            <p class="m-0">Num de Orden:</p>
            <p class="m-0">${factura.orderID}</p>
        </div>
        <div class="info d-flex justify-content-between">
            <p class="m-0">Fecha:</p>
            <p class="m-0">${factura.fecha_order}</p>
        </div>
        <div class="info d-flex justify-content-between">
            <p class="m-0">Hora:</p>
            <p class="m-0">${factura.hora_order}</p>
        </div>
        <div class="info d-flex justify-content-between">
            <p class="m-0">Ciudad:</p>
            <p class="m-0">${factura.ciudad.toUpperCase()}</p>
        </div>
        <div class="info d-flex justify-content-between">
            <p class="m-0">Dirección de envio:</p>
            <p class="m-0">${factura.direccion.toUpperCase()}</p>
        </div>
    `

let totalCarrito = 0;

factProd.innerHTML = `
    <table class="table">
        <thead>
            <tr>
                <th scope="col">Producto</th>
                <th scope="col">Cantidad</th>
                <th scope="col">V. Uni.</th>
                <th scope="col">V. Total</th>
            </tr>
        </thead>
        <tbody>
            ${carrito.map(p => {
    const totalProducto = p.precio * p.cantidad_carrito;
    totalCarrito += totalProducto;
    return `
                    <tr>
                        <td>${p.nombre}</td>
                        <td>${p.cantidad_carrito}</td>
                        <td>$${p.precio.toLocaleString()}</td>
                        <td>$${totalProducto.toLocaleString()}</td>
                    </tr>
                `;
}).join('')}
        </tbody>
    </table>
    <div class="text-end fw-bold me-3">
        Subtotal: $${totalCarrito.toLocaleString()},00
    </div>
    <div class="text-end fw-bold me-3">
        Domicilio: $${factura.valor_domicilio.toLocaleString()},00
    </div>
    <div class="text-end fw-bold me-3">
        Total: $${(totalCarrito + factura.valor_domicilio).toLocaleString()},00
    </div>
`;

const btnVolver = document.createElement('button');
btnVolver.classList.add('btn', 'btn-primary');
btnVolver.innerHTML = `
    <i class="bi bi-arrow-left"></i>
    <span>Volver al comercio</span>
`
factBtn.appendChild(btnVolver);