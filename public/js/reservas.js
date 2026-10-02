// ============================================
// VELVET SOCIETY - Reservas
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    cargarServiciosSelect();
    cargarReservas();

    const reservaForm = document.getElementById('reservaForm');
    if (reservaForm) {
        reservaForm.addEventListener('submit', crearReserva);
    }
});

async function cargarServiciosSelect() {
    const select = document.getElementById('servicio');

    try {
        const response = await fetch(getApiUrl('/servicios'));
        const servicios = await response.json();

        select.innerHTML = '<option value="">Selecciona un servicio</option>' +
            servicios.map(s => `<option value="${s.id_servicio}">${s.nombre} - $${s.precio.toFixed(2)}</option>`).join('');
    } catch (error) {
        console.error('Error al cargar servicios:', error);
    }
}

async function cargarReservas() {
    const container = document.getElementById('reservasContainer');

    try {
        const response = await fetch(getApiUrl('/reservas/mis-reservas'));

        if (response.status === 401) {
            container.innerHTML = '<p class="text-center">Debes <a href="/login.html" style="color: var(--dorado);">iniciar sesión</a> para ver tus reservas.</p>';
            return;
        }

        const reservas = await response.json();

        if (reservas.length === 0) {
            container.innerHTML = '<p class="text-center">No tienes reservas aún.</p>';
            return;
        }

        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Servicio</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservas.map(r => `
                        <tr>
                            <td>${r.nombre_servicio}</td>
                            <td>${new Date(r.fecha).toLocaleDateString()}</td>
                            <td><span class="badge badge-${r.estado}">${r.estado}</span></td>
                            <td>$${r.precio.toFixed(2)}</td>
                            <td>
                                ${r.estado === 'pendiente' ? `<button class="btn btn-danger" onclick="cancelarReserva(${r.id_reserva})">Cancelar</button>` : '-'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error al cargar reservas:', error);
        container.innerHTML = '<p class="text-center">Error al cargar reservas.</p>';
    }
}

async function crearReserva(e) {
    e.preventDefault();

    const id_servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const observaciones = document.getElementById('observaciones').value;

    try {
        const response = await fetch(getApiUrl('/reservas'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_servicio, fecha, observaciones })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarAlerta('Reserva creada exitosamente', 'success');
            cargarReservas();
            document.getElementById('reservaForm').reset();
        } else {
            mostrarAlerta(data.error || 'Error al crear reserva', 'error');
        }
    } catch (error) {
        mostrarAlerta('Error de conexión', 'error');
    }
}

async function cancelarReserva(id) {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;

    try {
        const response = await fetch(getApiUrl(`/reservas/${id}/cancelar`), { method: 'PUT' });

        if (response.ok) {
            mostrarAlerta('Reserva cancelada', 'success');
            cargarReservas();
        } else {
            mostrarAlerta('Error al cancelar reserva', 'error');
        }
    } catch (error) {
        mostrarAlerta('Error de conexión', 'error');
    }
}

function mostrarAlerta(mensaje, tipo) {
    const alerta = document.getElementById('alerta');
    if (alerta) {
        alerta.textContent = mensaje;
        alerta.className = `alert alert-${tipo}`;
        alerta.classList.remove('hidden');
        setTimeout(() => alerta.classList.add('hidden'), 5000);
    }
}
