const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const { initializeDatabase } = require('./server/database/connection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar base de datos
initializeDatabase();

// Rutas
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/servicios', require('./server/routes/servicios'));
app.use('/api/reservas', require('./server/routes/reservas'));
app.use('/api/usuarios', require('./server/routes/usuarios'));
app.use('/api/clientes', require('./server/routes/clientes'));
app.use('/api/pagos', require('./server/routes/pagos'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════════════════════╗`);
    console.log(`║                                                        ║`);
    console.log(`║   ██    ██ ███████ ██      ██    ██ ████████ ███████    ║`);
    console.log(`║   ██    ██ ██      ██      ██    ██    ██    ██         ║`);
    console.log(`║   ██    ██ █████   ██      ██    ██    ██    ███████    ║`);
    console.log(`║    ██  ██  ██      ██      ██    ██    ██         ██    ║`);
    console.log(`║     ████   ███████ ███████  ██████     ██    ███████    ║`);
    console.log(`║                                                        ║`);
    console.log(`║              S O C I E T Y                             ║`);
    console.log(`║                                                        ║`);
    console.log(`║   "Donde la exclusividad se convierte en experiencia"  ║`);
    console.log(`║                                                        ║`);
    console.log(`╚════════════════════════════════════════════════════════╝`);
    console.log(`\n  Servidor corriendo en: http://localhost:${PORT}\n`);
});
