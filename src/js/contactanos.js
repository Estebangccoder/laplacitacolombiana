// Validaciones para formulario de contacto con Bootstrap y Formspree

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

// Elementos del formulario
const nameField = document.getElementById('name');
const lastnameField = document.getElementById('lastname');
const emailField = document.getElementById('email');
const phoneField = document.getElementById('mobile_code');
const cityField = document.getElementById('city');
const inquiryField = document.getElementById('inquiry');
const messageField = document.getElementById('message');
const checkboxField = document.getElementById('invalidCheck3');
const enlaceTerminos = document.querySelector(".tyc");

// Expresiones regulares para validación
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/;

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

// Validación de nombre
function validateName() {
    const value = nameField.value.trim();
    if (value === '') {
        setInvalid(nameField, 'El nombre es obligatorio');
        return false;
    } else if (!nameRegex.test(value)) {
        setInvalid(nameField, 'Nombre debe tener al menos 2 caracteres y solo letras');
        return false;
    } else {
        setValid(nameField);
        return true;
    }
}

// Validación de apellido
function validateLastname() {
    const value = lastnameField.value.trim();
    if (value === '') {
        setInvalid(lastnameField, 'El apellido es obligatorio');
        return false;
    } else if (!nameRegex.test(value)) {
        setInvalid(lastnameField, 'Apellido debe tener al menos 2 caracteres y solo letras');
        return false;
    } else {
        setValid(lastnameField);
        return true;
    }
}

// Validación de email
function validateEmail() {
    const value = emailField.value.trim();
    if (value === '') {
        setInvalid(emailField, 'El correo electrónico es obligatorio');
        return false;
    } else if (!emailRegex.test(value)) {
        setInvalid(emailField, 'Por favor ingresa un correo válido');
        return false;
    } else {
        setValid(emailField);
        return true;
    }
}

// Validación de teléfono
function validatePhone() {
    const value = phoneField.value.trim();
    if (value === '') {
        setInvalid(phoneField, 'El teléfono es obligatorio');
        return false;
    } else if (!phoneRegex.test(value)) {
        setInvalid(phoneField, 'Teléfono debe tener al menos 10 dígitos');
        return false;
    } else {
        setValid(phoneField);
        return true;
    }
}

// Validación de ciudad
function validateCity() {
    const value = cityField.value.trim();
    if (value === '') {
        setInvalid(cityField, 'La ciudad es obligatoria');
        return false;
    } else if (!nameRegex.test(value)) {
        setInvalid(cityField, 'Ciudad debe tener al menos 2 caracteres y solo letras');
        return false;
    } else {
        setValid(cityField);
        return true;
    }
}

// Validación de requerimiento
function validateInquiry() {
    if (inquiryField.value === '' || inquiryField.value === 'Selecciona el tipo de requerimiento') {
        setInvalid(inquiryField, 'Por favor selecciona un tipo de requerimiento');
        return false;
    } else {
        setValid(inquiryField);
        return true;
    }
}

// Validación de mensaje
function validateMessage() {
    const value = messageField.value.trim();
    if (value === '') {
        setInvalid(messageField, 'El mensaje es obligatorio');
        return false;
    } else if (value.length < 10) {
        setInvalid(messageField, 'El mensaje debe tener al menos 10 caracteres');
        return false;
    } else {
        setValid(messageField);
        return true;
    }
}

// Validación de términos y condiciones
function validateCheckbox() {
    if (!checkboxField.checked) {
        setInvalid(checkboxField, 'Debes aceptar los términos y condiciones');
        return false;
    } else {
        setValid(checkboxField);
        return true;
    }
}

// Validar todo el formulario
function validateForm() {
    const validations = [
        validateName(),
        validateLastname(),
        validateEmail(),
        validatePhone(),
        validateCity(),
        validateInquiry(),
        validateMessage(),
        validateCheckbox()
    ];

    return validations.every(validation => validation === true);
}

// Event listeners para validación en tiempo real
nameField.addEventListener('blur', validateName);
nameField.addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
        validateName();
    }
});

lastnameField.addEventListener('blur', validateLastname);
lastnameField.addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
        validateLastname();
    }
});

emailField.addEventListener('blur', validateEmail);
emailField.addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
        validateEmail();
    }
});

phoneField.addEventListener('blur', validatePhone);
phoneField.addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
        validatePhone();
    }
});

cityField.addEventListener('blur', validateCity);
cityField.addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
        validateCity();
    }
});

inquiryField.addEventListener('change', validateInquiry);

messageField.addEventListener('blur', validateMessage);
messageField.addEventListener('input', function () {
    if (this.classList.contains('is-invalid')) {
        validateMessage();
    }
});

checkboxField.addEventListener('change', validateCheckbox);

//términos y condiciones alert y escuchador
 enlaceTerminos.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarTerminos();
    });


//función mostrar terminos y condiciones

function mostrarTerminos() {
    const fechaActual = new Date().toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    Swal.fire({
        title: 'Términos y Condiciones de Contacto',
        html: `
            <p><strong>Última actualización:</strong> ${fechaActual}</p>
            <p>Bienvenido/a al sitio web de <strong>La Placita Colombiana</strong>. 
            Al enviar un mensaje o formulario a través de nuestros canales de contacto, 
            aceptas los siguientes Términos y Condiciones. Por favor, léelos detenidamente antes de enviarnos tu consulta.</p>

            <h4>1. Identidad de la empresa</h4>
            <p>La Placita Colombiana es una empresa dedicada a la comercialización y promoción de productos colombianos como café, cacao y artesanías. Nuestra misión es conectar a los consumidores con productos auténticos y de calidad, provenientes de comunidades productoras en Colombia.</p>

            <h4>2. Uso del formulario o canales de contacto</h4>
            <p>Al utilizar nuestros formularios o medios de contacto, aceptas proporcionar información veraz, completa y actualizada. Nos reservamos el derecho de no responder mensajes que contengan información falsa, lenguaje ofensivo o que no estén relacionados con nuestras actividades comerciales.</p>

            <h4>3. Tratamiento de datos personales</h4>
            <p>Al enviarnos tus datos de contacto (nombre, correo electrónico, número de teléfono, entre otros), nos autorizas a utilizarlos con el fin de:</p>
            <ul>
                <li>Responder a tu solicitud o consulta.</li>
                <li>Brindarte información sobre nuestros productos, servicios, promociones o eventos relacionados, si así lo autorizas expresamente.</li>
                <li>Mejorar la calidad del servicio al cliente.</li>
            </ul>
            <p>La Placita Colombiana se compromete a proteger tu privacidad y a manejar tus datos conforme a la legislación vigente en materia de protección de datos personales. No compartiremos tu información con terceros sin tu consentimiento, salvo obligación legal.</p>

            <h4>4. Contenido de las comunicaciones</h4>
            <p>Todo mensaje recibido será tratado con confidencialidad y respeto. Sin embargo, La Placita Colombiana se reserva el derecho de conservar y archivar las comunicaciones por motivos legales, administrativos o de mejora de servicios.</p>

            <h4>5. Limitación de responsabilidad</h4>
            <p>El envío de un mensaje a través de nuestros canales no garantiza una respuesta inmediata. Nos comprometemos a atender cada solicitud en el menor tiempo posible, pero no asumimos responsabilidad por retrasos en la respuesta por causas técnicas o de fuerza mayor.</p>

            <h4>6. Modificaciones</h4>
            <p>Estos Términos y Condiciones pueden ser actualizados en cualquier momento sin previo aviso. Te recomendamos revisarlos periódicamente para estar al tanto de cualquier cambio.</p>
        `,
        width: '60%',
        confirmButtonText: 'Cerrar',
        scrollbarPadding: false,
        customClass: {
            popup: 'swal2-text-left'
        }
    });
}

// Manejo del envío del formulario
form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenir envío automático

    // Validar todo el formulario
    if (!validateForm()) {
        // Mostrar alerta de error
        showAlert('Por favor corrige los errores antes de enviar', 'danger');

        // Hacer scroll al primer campo con error
        const firstError = form.querySelector('.is-invalid');
        if (firstError) {
            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            firstError.focus();
        }
        return false;
    }

    // Si todo está válido, cambiar estado del botón
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Enviando...';
    submitBtn.disabled = true;

    // Crear FormData y enviar a Formspree
    const formData = new FormData(form);

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                // Éxito
               
                Swal.fire({
            icon: 'success',
            title: '¡Enviado!',
            text: 'El formulario se envió correctamente.',
            confirmButtonText: 'Aceptar'
        })
                form.reset();

                // Quitar todas las clases de validación
                const allFields = form.querySelectorAll('.form-control, .form-select, .form-check-input');
                allFields.forEach(field => {
                    field.classList.remove('is-valid', 'is-invalid');
                });

                // Ocultar todos los feedback
                const allFeedbacks = form.querySelectorAll('.valid-feedback, .invalid-feedback');
                allFeedbacks.forEach(feedback => {
                    feedback.style.display = 'none';
                });

            } else {
                throw new Error('Error en el servidor');
            }
        })
        .catch(error => {
            showAlert('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.', 'danger');
            console.error('Error:', error);
        })
        .finally(() => {
            // Restaurar botón
            submitBtn.innerHTML = 'Enviar';
            submitBtn.disabled = false;
        });
});

// Función para mostrar alertas
function showAlert(message, type) {
    // Quitar alerta anterior si existe
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Crear nueva alerta
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show', 'custom-alert');
    alertDiv.innerHTML = `
            <strong>${type === 'success' ? '¡Éxito!' : '¡Error!'}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

    // Insertar antes del formulario
    form.parentNode.insertBefore(alertDiv, form);

    // Hacer scroll a la alerta
    alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-ocultar después de 8 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 8000);
}

// Limpiar validaciones al hacer reset
form.addEventListener('reset', function () {
    setTimeout(() => {
        const allFields = form.querySelectorAll('.form-control, .form-select, .form-check-input');
        allFields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
        });

        const allFeedbacks = form.querySelectorAll('.valid-feedback, .invalid-feedback');
        allFeedbacks.forEach(feedback => {
            feedback.style.display = 'none';
        });
    }, 10);
});


//Indicativo
const iti = window.intlTelInput(phoneField, {
  initialCountry: "co",                // Colombia
  separateDialCode: true,
  utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // opcional, para formateo/validación
});