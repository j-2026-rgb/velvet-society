// ============================================
// VELVET SOCIETY - Panel Administrativo
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    cargarServicios();
    cargarClientes();
    cargarReservas();

    const servicioForm = document.getElementById('servicioForm');
    if (servicioForm) {
        servicioForm.addEventListener('submit', crearServicio);
    }
});

// ============================================
// GESTIÓN DE SERVICIOS
// ============================================
async function cargarServicios() {
    const container = document.getElementById('serviciosContainer');

    try {
        const response = await fetch('/api/servicios/todos');
        const servicios = await response.json();

        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${servicios.map(s => `
                        <tr>
                            <td>${s.nombre}</td>
                            <td>${s.descripcion || '-'}</td>
                            <td>$${s.precio.toFixed(2)}</td>
                            <td><span class="badge badge-${s.estado}">${s.estado}</span></td>
                            <td>
                                ${s.estado === 'activo'
                                    ? `<button class="btn btn-danger" onclick="desactivarServicio(${s.id_servicio})">Desactivar</button>`
                                    : `<button class="btn btn-secondary" onclick="activarServicio(${s.id_servicio})">Activar</button>`
                                }
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error al cargar servicios:', error);
    }
}

async function crearServicio(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreServicio').value;
    const descripcion = document.getElementById('descripcionServicio').value;
    const precio = parseFloat(document.getElementById('precioServicio').value);

    try {
        const response = await fetch('/api/servicios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, descripcion, precio })
        });

        const data = await response.json();

        if (response.ok) {
            mostrarAlerta('Servicio creado exitosamente', 'success');
            cargarServicios();
            document.getElementById('servicioForm').reset();
        } else {
            mostrarAlerta(data.error || 'Error al crear servicio', 'error');
        }
    } catch (error) {
        mostrarAlerta('Error de conexión', 'error');
    }
}

async function desactivarServicio(id) {
    try {
        const response = await fetch(`/api/servicios/${id}`, { method: 'DELETE' });
        if (response.ok) {
            mostrarAlerta('Servicio desactivado', 'success');
            cargarServicios();
        }
    } catch (error) {
        mostrarAlerta('Error al desactivar servicio', 'error');
    }
}

async function activarServicio(id) {
    try {
        const response = await fetch(`/api/servicios/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'activo' })
        });
        if (response.ok) {
            mostrarAlerta('Servicio activado', 'success');
            cargarServicios();
        }
    } catch (error) {
        mostrarAlerta('Error al activar servicio', 'error');
    }
}

// ============================================
// GESTIÓN DE CLIENTES
// ============================================
async function cargarClientes() {
    const container = document.getElementById('clientesContainer');

    try {
        const response = await fetch('/api/clientes');
        const clientes = await response.json();

        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th>Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${clientes.map(c => `
                        <tr>
                            <td>${c.nombre}</td>
                            <td>${c.correo}</td>
                            <td>${c.telefono || '-'}</td>
                            <td>${c.direccion || '-'}</td>
                            <td>${new Date(c.fecha_registro).toLocaleDateString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

// ============================================
// GESTIÓN DE RESERVAS
// ============================================
async function cargarReservas() {
    const container = document.getElementById('reservasContainer');

    try {
        const response = await fetch('/api/reservas');
        const reservas = await response.json();

        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Servicio</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservas.map(r => `
                        <tr>
                            <td>${r.nombre_cliente}</td>
                            <td>${r.nombre_servicio}</td>
                            <td>${new Date(r.fecha).toLocaleDateString()}</td>
                            <td><span class="badge badge-${r.estado}">${r.estado}</span></td>
                            <td>
                                ${r.estado === 'pendiente' ? `
                                    <button class="btn btn-primary" onclick="actualizarEstadoReserva(${r.id_reserva}, 'confirmada')">Confirmar</button>
                                    <button class="btn btn-danger" onclick="actualizarEstadoReserva(${r.id_reserva}, 'cancelada')">Cancelar</button>
                                ` : '-'}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error al cargar reservas:', error);
    }
}

async function actualizarEstadoReserva(id, estado) {
    try {
        const response = await fetch(`/api/reservas/${id}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado })
        });

        if (response.ok) {
            mostrarAlerta('Reserva actualizada', 'success');
            cargarReservas();
        }
    } catch (error) {
        mostrarAlerta('Error al actualizar reserva', 'error');
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
