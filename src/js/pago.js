document.addEventListener("DOMContentLoaded", () => {
    const canasta = document.querySelectorAll('.carrito-button');
    canasta.forEach(element => {
        element.classList.add('d-none');
    });
});

const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
const currentUser = JSON.parse(localStorage.getItem("currentUser") || "[]");
const currentUserId = users.find(u => u.email === currentUser?.email)?.id ?? 0;
const form = document.forms['infoPago'];
const inputs = form.elements
const num_productos = carrito.length;
const nombre = document.getElementById('nombre');
const ciudad = document.getElementById('ciudad');
const direccion = document.getElementById('direccion');
const subtotal = document.getElementById('subtotal');
const valorDomicilio = document.getElementById('valorDomicilio');
const total = document.getElementById('total');
let totalDomicilio = 0;
let totalCarrito = 0;
let totalAmount = 0;

if (Object.keys(currentUser).length > 0) {
    nombre.value = currentUser.name.toUpperCase();
    nombre.style.backgroundColor = "#ededed";
} else {
    nombre.value = 'No hay usuario activo';
    nombre.style.backgroundColor = "#ededed";
}

if (subtotal) {
    subtotal.value = 0;
    subtotal.style.backgroundColor = "#ededed";
}

if (total) {
    total.value = totalAmount;
    total.style.backgroundColor = "#ededed";
}

if (carrito.length > 0) {
    carrito.forEach(p => {
        const totalProducto = p.precio * p.cantidad_carrito;
        totalCarrito += totalProducto;
    });
    subtotal.value = totalCarrito;
}

if (ciudad && valorDomicilio) {
    valorDomicilio.value = 0;
    valorDomicilio.style.backgroundColor = "#ededed";
    ciudad.addEventListener('change', () => {
        switch (ciudad.value) {
            case "barranquilla":
            case "cartagena":
            case "santaMarta":
            case "monteria":
            case "pasto":
                totalDomicilio = 15000;
                break;
            case "bogota":
                totalDomicilio = 5000;
                break;
            case "bucaramanga":
            case "cali":
            case "cucuta":
                totalDomicilio = 10000;
                break;
            case "ibague":
            case "medellin":
            case "neiva":
                totalDomicilio = 12000;
                break;
            case "manizales":
            case "pereira":
            case "villavicencio":
                totalDomicilio = 13000;
                break;
            default:
                totalDomicilio = 0;
                break;
        }
        valorDomicilio.value = totalDomicilio;
        totalAmount = totalCarrito + totalDomicilio;
        total.value = totalAmount;
    });
}

// Función para mostrar campo válido
function setValid(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');

    const feedback = field.parentNode.querySelector('.invalid-feedback');
    if (feedback) feedback.style.display = 'none';
}

// Función para mostrar campo inválido
function setInvalid(field, message) {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');

    const validFeedback = field.parentNode.querySelector('.valid-feedback');
    if (validFeedback) validFeedback.style.display = 'none';

    let feedback = field.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.classList.add('invalid-feedback');
        field.parentNode.appendChild(feedback);
    }
    feedback.textContent = message;
    feedback.style.display = 'block';
}

// Validación de ciudad
function validateCity() {
    if (ciudad.value === '' || ciudad.value === 'Selecciona una ciudad') {
        setInvalid(ciudad, 'Por favor selecciona una ciudad');
        return false;
    } else {
        setValid(ciudad);
        return true;
    }
}

// Validación de direccion
function validateAddress() {
    const value = direccion.value.trim();
    if (value === '') {
        setInvalid(direccion, 'La dirección es obligatoria');
        return false;
    } else if (value.length < 10) {
        setInvalid(direccion, 'La dirección debe tener al menos 10 caracteres');
        return false;
    } else {
        setValid(direccion);
        return true;
    }
}

// Validar todo el formulario
function validateForm() {
    const validations = [
        validateCity(),
        validateAddress()
    ];
    return validations.every(validation => validation === true);
}

//Validaciones en vivo
direccion.addEventListener('blur', validateAddress);
direccion.addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
        validateAddress();
    }
});

ciudad.addEventListener('change', validateCity);

// Inicializa el botón de PayPal al cargar el DOM
document.addEventListener('DOMContentLoaded', function () {

    paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL, // fuerza solo PayPal
        // Método que se ejecuta cuando se crea una orden de pago
        createOrder: function (data, actions) {
            const nombre = document.getElementById('nombre').value;
            const ciudad = document.getElementById('ciudad').value;
            const direccion = document.getElementById('direccion').value;
            const subtotal = document.getElementById('subtotal').value;
            const totalAmount = document.getElementById('total').value / 4000;

            // Validación para verificar que todos los campos obligatorios estén completos
            if (!validateForm()) {
                Swal.fire({
                    icon: 'warning', // Muestra una advertencia si faltan campos
                    title: 'Campos incompletos',
                    text: 'Hay campos obligatorios',
                });
                return false; // Detiene el proceso si hay campos incompletos
            }

            if (nombre == 'No hay usuario activo') {
                Swal.fire({
                    icon: 'warning', // Muestra una advertencia si faltan campos
                    title: 'Valor erróneo',
                    text: 'No hay sesión iniciada',
                });
                return false;
            }

            if (subtotal == 0 || total == 0) {
                Swal.fire({
                    icon: 'warning', // Muestra una advertencia si faltan campos
                    title: 'Valor erróneo',
                    text: 'Al parecer no hay productos en el carrito',
                });
                return false;
            }

            // Crea la orden de PayPal con el monto total
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalAmount // Monto total de la orden
                    }
                }]
            });
        },
        // Método que se ejecuta cuando el pago ha sido aprobado
        onApprove: function (data, actions) {
            const ahora = new Date(Date.now());
            const fecha = ahora.toLocaleDateString("es-CO"); // ejemplo: "09/09/2025"
            const hora = ahora.toLocaleTimeString("es-CO"); // ejemplo: "5:41:23 p. m."
            return actions.order.capture().then(function (details) {

                const factura = JSON.parse(localStorage.getItem("factura"));
                if(factura) localStorage.removeItem('factura');
                // Guardar datos en localStorage
                localStorage.setItem('factura', JSON.stringify({
                    orderID: data.orderID,
                    details: details,
                    fecha_order: fecha,
                    hora_order: hora,
                    user_id: currentUserId,
                    nombre: document.getElementById('nombre').value.toUpperCase(),
                    ciudad: document.getElementById('ciudad').value,
                    direccion: document.getElementById('direccion').value,
                    valor_domicilio: totalDomicilio,
                }));

                // Aviso de éxito y redirección
                Swal.fire({
                    icon: 'success',
                    title: 'Pago Completado',
                    text: 'Factura creada correctamente',
                }).then(function () {
                    window.location.href = '/src/pages/factura.html';
                });
            });
        }
    }).render('#paypal-button-container'); // Renderiza el botón de PayPal en el contenedor
});