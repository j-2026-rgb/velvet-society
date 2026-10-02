const express = require('express');
const { getConnection, all } = require('../database/connection');

const router = express.Router();

// Obtener todos los clientes (admin)
router.get('/', async (req, res) => {
    try {
        await getConnection();
        const clientes = await all(`
            SELECT c.id_cliente, u.nombre, u.correo, c.telefono, c.direccion, c.fecha_registro
            FROM clientes c
            JOIN usuarios u ON c.id_usuario = u.id_usuario
            ORDER BY u.nombre
        `);
        res.json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).json({ error: 'Error al obtener clientes' });
    }
});

module.exports = router;
