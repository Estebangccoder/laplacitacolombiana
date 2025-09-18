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

// Validación de nombre producto
function validateName(field, regex) {
  const value = field.value.trim();
  if (value === '') {
    setInvalid(field, 'El nombre del producto es obligatorio');
    return false;
  } else if (!regex.test(value)) {
    setInvalid(field, 'El nombre del producto debe tener al menos 2 caracteres y solo letras');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

// Validación de descripcion
function validateDescription(field) {
  const value = field.value.trim();
  if (value === '') {
    setInvalid(field, 'La descripción es obligatoria');
    return false;
  } else if (value.length < 10) {
    setInvalid(field, 'La descripción debe tener al menos 10 caracteres');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

// Validación de categoria
function validateInquiry(field) {
  if (field.value === '0' || field.value === 'Selecciona el tipo de requerimiento') {
    setInvalid(field, 'Por favor selecciona una opción');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

// Validación valores negativos
function validateNegative(field) {

  if (field.value === '0' || field.value === '') {
    setInvalid(field, 'El valor debe ser mayor a 0');
    return false;
  } else {
    setValid(field);
    return true;
  }
}

function validateDate(field) {
  if (field.value === '') {
    setInvalid(field, "Se debe escoger una fecha de publicación");
    return false;
  } else {
    setValid(field);
    return true;
  }
}

function validateFile(field) {
  const file = field.files[0];
  if (file) {
    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setInvalid(field, "Solo puedes subir imágenes (JPG, PNG, etc).");
      return false;
    } else if (file.size > 1024 * 1024) { // Validar tamaño (ejemplo: máximo 1MB)
      setInvalid(field, "La imagen no puede superar 1MB.");
      return false;
    } else {
      setValid(field);
      return true;
    }
  } else {
    setInvalid(field, "Por favor selecciona una imagen.");
  }
}

