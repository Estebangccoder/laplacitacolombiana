// api.js - Servicios para consultas HTTP
const API_BASE_URL = 'http://localhost:8080/api';

// Función auxiliar para obtener el token
function getAuthToken() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        console.error('No hay token disponible');
        window.location.href = '/src/pages/login.html';
        return null;
    }
    return token;
}

// Función auxiliar para manejar respuestas HTTP
async function handleResponse(response) {
    if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } else if (response.status === 401) {
        // Token expirado o inválido
        localStorage.removeItem('jwt');
        console.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        window.location.href = '/src/pages/login.html';
        return null;
    } else {
        throw new Error(`Error HTTP: ${response.status}`);
    }
}

// Función auxiliar para hacer peticiones sin autenticación
async function makeRequest(url, options = {}) {
    const token = getAuthToken();
    if (!token) return null;

    const defaultHeaders = {
        'Authorization': `Bearer ${token}`
    };

    // Si no es FormData, agregar Content-Type JSON
    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const requestOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, requestOptions);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// Función auxiliar para hacer peticiones autenticadas
async function makeAuthenticatedRequest(url, options = {}) {
    const token = getAuthToken();
    if (!token) return null;

    const defaultHeaders = {
        'Authorization': `Bearer ${token}`
    };

    // Si no es FormData, agregar Content-Type JSON
    if (!(options.body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const requestOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, requestOptions);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// =================== PRODUCTOS ===================

// Obtener todos los productos
async function obtenerProductos() {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/productos`);
}

// Obtener producto por ID
async function obtenerProductoID(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/productos/${id}`);
}

// Crear nuevo producto
async function crearProducto(formData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/productos/crear`, {
        method: 'POST',
        body: formData
    });
}

// Actualizar producto
async function actualizarProductoAPI(id, formData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/productos/editar/${id}`, {
        method: 'PUT',
        body: formData
    });
}

// Eliminar producto (soft delete)
async function eliminarProductoAPI(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/productos/borrar/${id}`, {
        method: 'PATCH'
    });
}

// =================== PROVEEDORES ===================

// Obtener todos los proveedores
async function obtenerProductores() {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/proveedores`);
}

// Obtener proveedor por ID
async function obtenerProveedorID(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/proveedores/${id}`);
}

// Crear nuevo proveedor
async function crearProveedor(proveedorData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/proveedores/crear`, {
        method: 'POST',
        body: JSON.stringify(proveedorData)
    });
}

// Actualizar proveedor
async function actualizarProveedor(id, proveedorData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/proveedores/editar/${id}`, {
        method: 'PUT',
        body: JSON.stringify(proveedorData)
    });
}

// Eliminar proveedor
async function eliminarProveedor(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/proveedores/borrar/${id}`, {
        method: 'DELETE'
    });
}

// =================== CATEGORÍAS ===================

// Obtener todas las categorías
async function obtenerCategorias() {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/categorias`);
}

// Obtener categoría por ID
async function obtenerCategoriaID(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/categorias/${id}`);
}

// =================== USUARIOS ===================

// Obtener todos los usuarios
async function obtenerUsuarios() {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/usuarios`);
}

// Obtener usuario por ID
async function obtenerUsuarioID(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/${id}`);
}

// Crear nuevo usuario
async function crearUsuario(usuarioData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/crear`, {
        method: 'POST',
        body: JSON.stringify(usuarioData)
    });
}

// Actualizar usuario
async function actualizarUsuario(id, usuarioData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/editar/${id}`, {
        method: 'PUT',
        body: JSON.stringify(usuarioData)
    });
}

// Eliminar usuario
async function eliminarUsuario(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/borrar/${id}`, {
        method: 'DELETE'
    });
}

// ====================== VENTAS ======================
// Obtener todas las ventas
async function obtenerVentass() {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/ventas`);
}

// =================== AUTENTICACIÓN ===================

// Login
async function login(credentials) {
    try {
        const response = await fetch("http://localhost:8080/auth/loginConDTO", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (response.ok) {
            return await response.json(); // Login exitoso
        } else if (response.status === 401) {
            return { error: true, message: 'Credenciales incorrectas' }; // Login fallido
        } else {
            const errorText = await response.text();
            return { error: true, message: errorText || 'Error desconocido' };
        }
    } catch (error) {
        console.error('Error en login:', error);
        throw new Error('No se pudo conectar con el servidor');
    }
}

// Logout
function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('currentUser');
    window.location.href = '/src/pages/login.html';
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return !!localStorage.getItem('jwt');
}
