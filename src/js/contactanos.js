// Validaciones para formulario de contacto con Bootstrap y Formspree

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

// Elementos del formulario
const nameField = document.getElementById('name');
const lastnameField = document.getElementById('lastname');
const emailField = document.getElementById('email');
const phoneField = document.getElementById('phone-number');
const cityField = document.getElementById('city');
const inquiryField = document.getElementById('inquiry');
const messageField = document.getElementById('message');
const checkboxField = document.getElementById('invalidCheck3');

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
                showAlert('¡Mensaje enviado exitosamente! Te contactaremos pronto.', 'success');
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
