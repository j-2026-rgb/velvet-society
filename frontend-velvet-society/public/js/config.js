// ============================================
// VELVET SOCIETY - Configuración del API
// ============================================

// URL del backend - Cambiar según el entorno
const API_URL = window.API_URL || '';

// Función para obtener la URL completa del API
function getApiUrl(endpoint) {
    return `${API_URL}/api${endpoint}`;
}
