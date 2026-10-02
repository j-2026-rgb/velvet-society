const express = require('express');
const { getConnection, all, run, get } = require('../database/connection');

const router = express.Router();

// Obtener pagos de una reserva
router.get('/reserva/:id', async (req, res) => {
    try {
        await getConnection();
        const pagos = await all(
            'SELECT * FROM pagos WHERE id_reserva = ? ORDER BY fecha DESC',
            [req.params.id]
        );
        res.json(pagos);
    } catch (error) {
        console.error('Error al obtener pagos:', error);
        res.status(500).json({ error: 'Error al obtener pagos' });
    }
});

// Registrar pago
router.post('/', async (req, res) => {
    const { id_reserva, valor, metodo } = req.body;

    if (!id_reserva || !valor || !metodo) {
        return res.status(400).json({ error: 'Reserva, valor y método son obligatorios' });
    }

    try {
        await getConnection();
        const result = await run(
            'INSERT INTO pagos (id_reserva, valor, metodo) VALUES (?, ?, ?)',
            [id_reserva, valor, metodo]
        );

        res.status(201).json({
            mensaje: 'Pago registrado exitosamente',
            id_pago: result.insertId
        });
    } catch (error) {
        console.error('Error al registrar pago:', error);
        res.status(500).json({ error: 'Error al registrar pago' });
    }
});

module.exports = router;
