const express = require('express');
const { getConnection, all, get, run } = require('../database/connection');

const router = express.Router();

// Obtener todos los servicios activos (para clientes)
router.get('/', async (req, res) => {
    try {
        await getConnection();
        const servicios = await all("SELECT * FROM servicios WHERE estado = 'activo' ORDER BY nombre");
        res.json(servicios);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

// Obtener todos los servicios (para admin)
router.get('/todos', async (req, res) => {
    try {
        await getConnection();
        const servicios = await all('SELECT * FROM servicios ORDER BY nombre');
        res.json(servicios);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ error: 'Error al obtener servicios' });
    }
});

// Obtener un servicio por ID
router.get('/:id', async (req, res) => {
    try {
        await getConnection();
        const servicio = await get('SELECT * FROM servicios WHERE id_servicio = ?', [req.params.id]);
        if (!servicio) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json(servicio);
    } catch (error) {
        console.error('Error al obtener servicio:', error);
        res.status(500).json({ error: 'Error al obtener servicio' });
    }
});

// Crear servicio (admin)
router.post('/', async (req, res) => {
    const { nombre, descripcion, precio } = req.body;

    if (!nombre || !precio) {
        return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
    }

    try {
        await getConnection();
        const result = await run(
            'INSERT INTO servicios (nombre, descripcion, precio) VALUES (?, ?, ?)',
            [nombre, descripcion || '', precio]
        );

        res.status(201).json({
            mensaje: 'Servicio creado exitosamente',
            id_servicio: result.insertId
        });
    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({ error: 'Error al crear servicio' });
    }
});

// Editar servicio (admin)
router.put('/:id', async (req, res) => {
    const { nombre, descripcion, precio, estado } = req.body;

    try {
        await getConnection();
        await run(
            'UPDATE servicios SET nombre = ?, descripcion = ?, precio = ?, estado = ? WHERE id_servicio = ?',
            [nombre, descripcion, precio, estado, req.params.id]
        );

        res.json({ mensaje: 'Servicio actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ error: 'Error al actualizar servicio' });
    }
});

// Desactivar servicio (admin)
router.delete('/:id', async (req, res) => {
    try {
        await getConnection();
        await run("UPDATE servicios SET estado = 'inactivo' WHERE id_servicio = ?", [req.params.id]);
        res.json({ mensaje: 'Servicio desactivado exitosamente' });
    } catch (error) {
        console.error('Error al desactivar servicio:', error);
        res.status(500).json({ error: 'Error al desactivar servicio' });
    }
});

module.exports = router;
