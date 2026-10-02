const mysql = require('mysql2/promise');

const DB_CONFIG = {
    host: process.env.MYSQL_ADDON_HOST || 'bhzuivhmzxxggtz1irtg-mysql.services.clever-cloud.com',
    database: process.env.MYSQL_ADDON_DB || 'bhzuivhmzxxggtz1irtg',
    user: process.env.MYSQL_ADDON_USER || 'ul00gwe2wsqqoend',
    port: parseInt(process.env.MYSQL_ADDON_PORT) || 3306,
    password: process.env.MYSQL_ADDON_PASSWORD || 'tRLMfMu35KYGXAhfOzVY',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
};

let pool = null;

async function getConnection() {
    if (!pool) {
        pool = mysql.createPool(DB_CONFIG);
    }
    return pool;
}

async function initializeDatabase() {
    const connection = await getConnection();
    const schema = `
        CREATE TABLE IF NOT EXISTS roles (
            id_rol INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS usuarios (
            id_usuario INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            correo VARCHAR(100) NOT NULL UNIQUE,
            contraseña VARCHAR(255) NOT NULL,
            id_rol INT NOT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
        );

        CREATE TABLE IF NOT EXISTS clientes (
            id_cliente INT AUTO_INCREMENT PRIMARY KEY,
            id_usuario INT NOT NULL UNIQUE,
            telefono VARCHAR(20),
            direccion VARCHAR(255),
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS servicios (
            id_servicio INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            descripcion TEXT,
            precio DECIMAL(10,2) NOT NULL,
            estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS reservas (
            id_reserva INT AUTO_INCREMENT PRIMARY KEY,
            id_cliente INT NOT NULL,
            id_servicio INT NOT NULL,
            fecha DATE NOT NULL,
            estado ENUM('pendiente', 'confirmada', 'cancelada', 'completada') NOT NULL DEFAULT 'pendiente',
            observaciones TEXT,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
            FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
        );

        CREATE TABLE IF NOT EXISTS pagos (
            id_pago INT AUTO_INCREMENT PRIMARY KEY,
            id_reserva INT NOT NULL,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            valor DECIMAL(10,2) NOT NULL,
            metodo VARCHAR(50) NOT NULL,
            estado ENUM('pendiente', 'completado', 'fallido', 'reembolsado') NOT NULL DEFAULT 'pendiente',
            FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva) ON DELETE CASCADE
        );

        INSERT IGNORE INTO roles (id_rol, nombre) VALUES (1, 'administrador');
        INSERT IGNORE INTO roles (id_rol, nombre) VALUES (2, 'cliente');

        INSERT IGNORE INTO usuarios (id_usuario, nombre, correo, contraseña, id_rol)
        VALUES (1, 'Administrador', 'admin@velvetsociety.com', '$2a$10$Khd3S6RTh1iWmb9p7N1AZ.b/HBHLaBQ.uxh.hTSIl51qA0wP4gehm', 1);
    `;

    await connection.query(schema);
    console.log('  Base de datos MySQL inicializada correctamente\n');
}

async function run(sql, params = []) {
    const connection = await getConnection();
    const [result] = await connection.execute(sql, params);
    return result;
}

async function get(sql, params = []) {
    const connection = await getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows[0];
}

async function all(sql, params = []) {
    const connection = await getConnection();
    const [rows] = await connection.execute(sql, params);
    return rows;
}

module.exports = { getConnection, initializeDatabase, run, get, all };
