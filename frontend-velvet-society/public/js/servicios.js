// ============================================
// VELVET SOCIETY - Servicios
// ============================================

document.addEventListener('DOMContentLoaded', cargarServicios);

async function cargarServicios() {
    const container = document.getElementById('serviciosContainer');

    try {
        const response = await fetch(getApiUrl('/servicios'));
        const servicios = await response.json();

        if (servicios.length === 0) {
            container.innerHTML = '<p class="text-center">No hay servicios disponibles en este momento.</p>';
            return;
        }

        container.innerHTML = servicios.map(servicio => `
            <div class="servicio-card">
                <h3>${servicio.nombre}</h3>
                <p>${servicio.descripcion || 'Sin descripción'}</p>
                <div class="precio">$${servicio.precio.toFixed(2)}</div>
                <a href="/reservas.html" class="btn btn-secondary">Reservar</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar servicios:', error);
        container.innerHTML = '<p class="text-center">Error al cargar servicios.</p>';
    }
}
