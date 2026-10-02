const express = require('express');
const { getConnection, all, get, run } = require('../database/connection');

const router = express.Router();

// Obtener reservas del cliente autenticado
router.get('/mis-reservas', async (req, res) => {
    if (!req.cookies.session) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const session = JSON.parse(req.cookies.session);

    try {
        await getConnection();
        const reservas = await all(`
            SELECT r.*, s.nombre as nombre_servicio, s.precio
            FROM reservas r
            JOIN servicios s ON r.id_servicio = s.id_servicio
            JOIN clientes c ON r.id_cliente = c.id_cliente
            WHERE c.id_usuario = ?
            ORDER BY r.fecha_creacion DESC
        `, [session.id_usuario]);

        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
});

// Obtener todas las reservas (admin)
router.get('/', async (req, res) => {
    try {
        await getConnection();
        const reservas = await all(`
            SELECT r.*, s.nombre as nombre_servicio, u.nombre as nombre_cliente, u.correo as correo_cliente
            FROM reservas r
            JOIN servicios s ON r.id_servicio = s.id_servicio
            JOIN clientes c ON r.id_cliente = c.id_cliente
            JOIN usuarios u ON c.id_usuario = u.id_usuario
            ORDER BY r.fecha_creacion DESC
        `);
        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ error: 'Error al obtener reservas' });
    }
});

// Crear reserva
router.post('/', async (req, res) => {
    if (!req.cookies.session) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const session = JSON.parse(req.cookies.session);
    const { id_servicio, fecha, observaciones } = req.body;

    if (!id_servicio || !fecha) {
        return res.status(400).json({ error: 'Servicio y fecha son obligatorios' });
    }

    try {
        await getConnection();

        const cliente = await get('SELECT id_cliente FROM clientes WHERE id_usuario = ?', [session.id_usuario]);
        if (!cliente) {
            return res.status(404).json({ error: 'Perfil de cliente no encontrado' });
        }

        const result = await run(
            'INSERT INTO reservas (id_cliente, id_servicio, fecha, observaciones) VALUES (?, ?, ?, ?)',
            [cliente.id_cliente, id_servicio, fecha, observaciones || '']
        );

        res.status(201).json({
            mensaje: 'Reserva creada exitosamente',
            id_reserva: result.insertId
        });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ error: 'Error al crear reserva' });
    }
});

// Actualizar estado de reserva (admin)
router.put('/:id/estado', async (req, res) => {
    const { estado } = req.body;

    try {
        await getConnection();
        await run('UPDATE reservas SET estado = ? WHERE id_reserva = ?', [estado, req.params.id]);
        res.json({ mensaje: 'Estado de reserva actualizado' });
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).json({ error: 'Error al actualizar reserva' });
    }
});

// Cancelar reserva (cliente)
router.put('/:id/cancelar', async (req, res) => {
    if (!req.cookies.session) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    const session = JSON.parse(req.cookies.session);

    try {
        await getConnection();
        await run(`
            UPDATE reservas SET estado = 'cancelada'
            WHERE id_reserva = ? AND id_cliente = (
                SELECT id_cliente FROM clientes WHERE id_usuario = ?
            )
        `, [req.params.id, session.id_usuario]);

        res.json({ mensaje: 'Reserva cancelada exitosamente' });
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({ error: 'Error al cancelar reserva' });
    }
});

module.exports = router;
