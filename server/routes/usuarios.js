const express = require('express');
const { getConnection, all, get } = require('../database/connection');

const router = express.Router();

// Obtener todos los usuarios (admin)
router.get('/', async (req, res) => {
    try {
        await getConnection();
        const usuarios = all(`
            SELECT u.id_usuario, u.nombre, u.correo, u.fecha_creacion, r.nombre as rol
            FROM usuarios u
            JOIN roles r ON u.id_rol = r.id_rol
            ORDER BY u.nombre
        `);
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Obtener perfil del usuario autenticado
router.get('/perfil', async (req, res) => {
    if (!req.cookies.session) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const session = JSON.parse(req.cookies.session);

    try {
        await getConnection();
        const usuario = get(`
            SELECT u.id_usuario, u.nombre, u.correo, u.fecha_creacion, r.nombre as rol,
                   c.telefono, c.direccion
            FROM usuarios u
            JOIN roles r ON u.id_rol = r.id_rol
            LEFT JOIN clientes c ON u.id_usuario = c.id_usuario
            WHERE u.id_usuario = ?
        `, [session.id_usuario]);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
});

module.exports = router;
