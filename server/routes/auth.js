const express = require('express');
const bcrypt = require('bcryptjs');
const { getConnection, run, get } = require('../database/connection');

const router = express.Router();

// Registro de cliente
router.post('/registro', async (req, res) => {
    const { nombre, correo, contraseña, telefono, direccion } = req.body;

    if (!nombre || !correo || !contraseña) {
        return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
    }

    try {
        await getConnection();

        // Verificar si el correo ya existe
        const existingUser = get('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo]);
        if (existingUser) {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }

        // Hash de contraseña
        const hashedPassword = bcrypt.hashSync(contraseña, 10);

        // Insertar usuario con rol cliente (id_rol = 2)
        run(
            'INSERT INTO usuarios (nombre, correo, contraseña, id_rol) VALUES (?, ?, ?, 2)',
            [nombre, correo, hashedPassword]
        );

        // Obtener el ID del usuario insertado
        const usuario = get('SELECT last_insert_rowid() as id');
        const idUsuario = usuario.id;

        // Insertar en tabla clientes
        run(
            'INSERT INTO clientes (id_usuario, telefono, direccion) VALUES (?, ?, ?)',
            [idUsuario, telefono || null, direccion || null]
        );

        res.status(201).json({
            mensaje: 'Registro exitoso',
            id_usuario: idUsuario
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    try {
        await getConnection();

        const usuario = get(`
            SELECT u.id_usuario, u.nombre, u.correo, u.contraseña, u.id_rol, r.nombre as rol
            FROM usuarios u
            JOIN roles r ON u.id_rol = r.id_rol
            WHERE u.correo = ?
        `, [correo]);

        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        const passwordMatch = bcrypt.compareSync(contraseña, usuario.contraseña);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Crear sesión con cookie
        res.cookie('session', JSON.stringify({
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
        }), {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });

        res.json({
            mensaje: 'Inicio de sesión exitoso',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Cerrar sesión
router.post('/logout', (req, res) => {
    res.clearCookie('session');
    res.json({ mensaje: 'Sesión cerrada exitosamente' });
});

// Verificar sesión actual
router.get('/sesion', (req, res) => {
    if (req.cookies.session) {
        const session = JSON.parse(req.cookies.session);
        res.json({ autenticado: true, usuario: session });
    } else {
        res.json({ autenticado: false });
    }
});

module.exports = router;
