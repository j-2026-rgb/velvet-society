// ============================================
// VELVET SOCIETY - JavaScript Principal
// ============================================

// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/auth/sesion');
        const data = await response.json();

        if (data.autenticado) {
            // Usuario autenticado - actualizar navegación
            actualizarNavegacion(data.usuario);

            // Cargar perfil si estamos en la página de perfil
            if (window.location.pathname === '/perfil.html') {
                cargarPerfil(data.usuario);
            }
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
    }
});

function actualizarNavegacion(usuario) {
    const navItems = document.querySelectorAll('.navbar-nav');
    navItems.forEach(nav => {
        nav.innerHTML = `
            <li><a href="/">Inicio</a></li>
            <li><a href="/servicios.html">Servicios</a></li>
            <li><a href="/reservas.html">Reservas</a></li>
            <li><a href="/perfil.html">Perfil</a></li>
            <li><a href="#" id="btnLogoutNav">Cerrar Sesión</a></li>
        `;

        document.getElementById('btnLogoutNav').addEventListener('click', cerrarSesion);
    });
}

async function cargarPerfil(usuario) {
    try {
        const response = await fetch('/api/usuarios/perfil');
        const perfil = await response.json();

        const container = document.getElementById('perfilContainer');
        container.innerHTML = `
            <h3>${perfil.nombre}</h3>
            <p><strong>Correo:</strong> ${perfil.correo}</p>
            <p><strong>Rol:</strong> ${perfil.rol}</p>
            <p><strong>Teléfono:</strong> ${perfil.telefono || 'No especificado'}</p>
            <p><strong>Dirección:</strong> ${perfil.direccion || 'No especificada'}</p>
            <p><strong>Miembro desde:</strong> ${new Date(perfil.fecha_creacion).toLocaleDateString()}</p>
        `;
    } catch (error) {
        console.error('Error al cargar perfil:', error);
    }
}

async function cerrarSesion() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}

// Botón de cerrar sesión en perfil
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.addEventListener('click', cerrarSesion);
}
