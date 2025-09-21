const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
const factInfo = document.getElementById('content-body');
const factProd = document.getElementById('productos-fact');
const factBtn = document.getElementById('btnVolver');
factInfo.innerHTML = '';
factProd.innerHTML = '';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Leer el parámetro de la URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se encontró el ID de la factura',
        });
        return;
    }

    // 2. Hacer fetch al backend
    fetch(`http://localhost:8080/api/ventas/factura/${id}`)
        .then(async res => {
            if (!res.ok) {
                const err = await res.json();
                console.error(err.error);
                throw new Error(err.error);
            }
            return res.json();
        })
        .then(factura => {
            // Convertir LocalDateTime (string ISO) a objeto Date
            const fechaISO = factura.fecha; // "2021-02-12T20:54:00"
            const fechaObj = new Date(fechaISO);

            // Formatear fecha y hora por separado
            const opcionesFecha = { year: "numeric", month: "2-digit", day: "2-digit" };
            const opcionesHora = { hour: "2-digit", minute: "2-digit", hour12: false };

            const fechaFormateada = fechaObj.toLocaleDateString("es-ES", opcionesFecha);
            const horaFormateada = fechaObj.toLocaleTimeString("es-ES", opcionesHora);

            factInfo.innerHTML = `
                <div class="info d-flex justify-content-between">
                    <p class="m-0">Num de Orden:</p>
                    <p class="m-0">${factura.idTransaccion}</p>
                </div>
                <div class="info d-flex justify-content-between">
                    <p class="m-0">Fecha:</p>
                    <p class="m-0">${fechaFormateada}</p>
                </div>
                <div class="info d-flex justify-content-between">
                    <p class="m-0">Hora:</p>
                    <p class="m-0">${horaFormateada}</p>
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
            ${factura.detalles.map(p => {
                const totalProducto = p.precioUnitario * p.cantidad;
                totalCarrito += totalProducto;
                return `
                    <tr>
                        <td>${p.producto.nombre}</td>
                        <td>${p.cantidad}</td>
                        <td>$${p.precioUnitario.toLocaleString()}</td>
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
                    Domicilio: $${factura.domicilio.toLocaleString()},00
                </div>
                <div class="text-end fw-bold me-3">
                    Total: $${(totalCarrito + factura.domicilio).toLocaleString()},00
                </div>
            `;
        })
        .catch(err => {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error cargando la factura: ' + err.message
            });
        });
});


const btnVolver = document.createElement('button');
btnVolver.classList.add('btn', 'btn-primary');
btnVolver.innerHTML = `
    <i class="bi bi-arrow-left"></i>
    <span>Volver al comercio</span>
`
factBtn.appendChild(btnVolver);
factBtn.setAttribute("onclick", "volver()");

function volver() {
    window.location.href = '/index.html';
}

