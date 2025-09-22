// api.js - Servicios para consultas HTTP
const API_BASE_URL = 'http://localhost:8080/api';

// =================== AUXILIARES ===================

// Función auxiliar para obtener el token
function getAuthToken() {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    return token;
}

// Función auxiliar para manejar respuestas HTTP
async function handleResponse(response) {
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    
    if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    } else if (response.status === 401) {
        localStorage.removeItem('jwt');
        console.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        window.location.href = '/src/pages/login.html';
        return null;
    } else if (response.status === 400) {
        const errorData = await response.json();
        throw { status: 400, errors: errorData };
    } else if (response.status === 500) {
        console.log("Entrando al manejo del error 500");
        try {
            // Intentar leer como JSON primero
            const contentType = response.headers.get('Content-Type');
            let errorContent;
            
            if (contentType && contentType.includes('application/json')) {
                errorContent = await response.json();
                console.log("Error 500 JSON:", errorContent);
            } else {
                errorContent = await response.text();
                console.log("Error 500 text:", errorContent);
            }
            
            // Buscar el mensaje de correo duplicado
            const errorString = typeof errorContent === 'string' ? errorContent : JSON.stringify(errorContent);
            console.log("Buscando 'correo ya existe' en:", errorString);
            
            if (errorString.includes("correo ya existe") || errorString.includes("El correo ya existe")) {
                console.log("Detectado error de correo duplicado");
                throw { 
                    status: 400,
                    errors: { email: "Este correo electrónico ya está registrado" } 
                };
            }
        } catch (parseError) {
            console.log("Error al parsear response 500:", parseError);
        }
        
        console.log("Lanzando error HTTP 500 genérico");
        throw new Error(`Error HTTP: ${response.status}`);
    } else {
        throw new Error(`Error HTTP: ${response.status}`);
    }
}

// Peticiones sin token
async function makeRequest(url, options = {}) {
    const defaultHeaders = {};

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

// Peticiones con token
async function makeAuthenticatedRequest(url, options = {}) {
    const token = getAuthToken();
    if (!token) return null;

    const defaultHeaders = {
        'Authorization': `Bearer ${token}`
    };

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

// 🔓 Públicos
async function obtenerProductos() {
    return await makeRequest(`${API_BASE_URL}/productos`);
}

async function obtenerProductoID(id) {
    return await makeRequest(`${API_BASE_URL}/productos/${id}`);
}

// 🔒 Requieren autenticación
async function crearProducto(formData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/productos/crear`, {
        method: 'POST',
        body: formData
    });
}

async function actualizarProductoAPI(id, formData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/productos/editar/${id}`, {
        method: 'PUT',
        body: formData
    });
}

async function actualizarStockProductoAPI(id, nuevoStock) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/productos/stock/${id}`, {
        method: 'PATCH',
         body: JSON.stringify({ stock: nuevoStock })
    });
}

// async function actualizarEstadoProductoAPI(id, nuevoStock) {
//     return await makeAuthenticatedRequest(`${API_BASE_URL}/productos/stock/${id}`, {
//         method: 'PATCH',
//         body: JSON.stringify(nuevoStock)
//     });
// }

async function eliminarProductoAPI(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/productos/borrar/${id}`, {
        method: 'DELETE'
    });
}

// =================== PROVEEDORES ===================

// 🔓 Públicos
async function obtenerProductores() {
    return await makeRequest(`${API_BASE_URL}/proveedores`);
}

async function obtenerProveedorID(id) {
    return await makeRequest(`${API_BASE_URL}/proveedores/${id}`);
}

// 🔒 Protegidos
async function crearProveedor(proveedorData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/proveedores/crear`, {
        method: 'POST',
        body: JSON.stringify(proveedorData)
    });
}

async function actualizarProveedor(id, proveedorData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/proveedores/editar/${id}`, {
        method: 'PUT',
        body: JSON.stringify(proveedorData)
    });
}

async function eliminarProveedor(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/proveedores/borrar/${id}`, {
        method: 'DELETE'
    });
}

// =================== CATEGORÍAS ===================

// 🔓 Públicos
async function obtenerCategorias() {
    return await makeRequest(`${API_BASE_URL}/categorias`);
}

async function obtenerCategoriaID(id) {
    return await makeRequest(`${API_BASE_URL}/categorias/${id}`);
}

// =================== USUARIOS ===================

// 🔓 Públicos
async function crearUsuario(userData) {
    return await makeRequest('http://localhost:8080/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

// 🔒 Protegidos
async function obtenerUsuarios() {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/usuarios`);
}

async function obtenerUsuarioID(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/${id}`);
}

async function actualizarUsuario(id, usuarioData) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/editar/${id}`, {
        method: 'PUT',
        body: JSON.stringify(usuarioData)
    });
}

async function eliminarUsuario(id) {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/usuarios/borrar/${id}`, {
        method: 'DELETE'
    });
}

// ====================== VENTAS ======================
// 🔒 Requiere autenticación
async function obtenerVentas() {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/ventas`);
}

// =================== AUTENTICACIÓN ===================

// 🔓 Login (sin token)
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
            return await response.json();
        } else if (response.status === 401) {
            return { error: true, message: 'Credenciales incorrectas' };
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
    localStorage.removeItem('UID');
    window.location.href = '/src/pages/login.html';
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return !!localStorage.getItem('jwt');
}
