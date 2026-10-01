// ============================================
// VELVET SOCIETY - Autenticación
// ============================================

// Manejar formulario de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const correo = document.getElementById('correo').value;
        const contraseña = document.getElementById('contraseña').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contraseña })
            });

            const data = await response.json();

            if (response.ok) {
                mostrarAlerta('Inicio de sesión exitoso', 'success');
                setTimeout(() => {
                    window.location.href = data.usuario.rol === 'administrador' ? '/admin.html' : '/';
                }, 1000);
            } else {
                mostrarAlerta(data.error || 'Error al iniciar sesión', 'error');
            }
        } catch (error) {
            mostrarAlerta('Error de conexión', 'error');
        }
    });
}

// Manejar formulario de registro
const registroForm = document.getElementById('registroForm');
if (registroForm) {
    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;
        const contraseña = document.getElementById('contraseña').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;

        try {
            const response = await fetch('/api/auth/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, correo, contraseña, telefono, direccion })
            });

            const data = await response.json();

            if (response.ok) {
                mostrarAlerta('Registro exitoso. Redirigiendo...', 'success');
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 1500);
            } else {
                mostrarAlerta(data.error || 'Error al registrar', 'error');
            }
        } catch (error) {
            mostrarAlerta('Error de conexión', 'error');
        }
    });
}

function mostrarAlerta(mensaje, tipo) {
    const alerta = document.getElementById('alerta');
    if (alerta) {
        alerta.textContent = mensaje;
        alerta.className = `alert alert-${tipo}`;
        alerta.classList.remove('hidden');

        setTimeout(() => {
            alerta.classList.add('hidden');
        }, 5000);
    }
}
