-- ============================================
-- VELVET SOCIETY - Esquema de Base de Datos
-- ============================================
-- Habilitar claves foráneas
PRAGMA foreign_keys = ON;

-- ============================================
-- Tabla: ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS roles (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);

-- ============================================
-- Tabla: USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    contraseña TEXT NOT NULL,
    id_rol INTEGER NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- ============================================
-- Tabla: CLIENTES
-- ============================================
CREATE TABLE IF NOT EXISTS clientes (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL UNIQUE,
    telefono TEXT,
    direccion TEXT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================
-- Tabla: SERVICIOS
-- ============================================
CREATE TABLE IF NOT EXISTS servicios (
    id_servicio INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    precio REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'activo' CHECK(estado IN ('activo', 'inactivo')),
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Tabla: RESERVAS
-- ============================================
CREATE TABLE IF NOT EXISTS reservas (
    id_reserva INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    fecha DATE NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
    observaciones TEXT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);

-- ============================================
-- Tabla: PAGOS
-- ============================================
CREATE TABLE IF NOT EXISTS pagos (
    id_pago INTEGER PRIMARY KEY AUTOINCREMENT,
    id_reserva INTEGER NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor REAL NOT NULL,
    metodo TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'completado', 'fallido', 'reembolsado')),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva) ON DELETE CASCADE
);

-- ============================================
-- Datos iniciales: Roles
-- ============================================
INSERT OR IGNORE INTO roles (id_rol, nombre) VALUES (1, 'administrador');
INSERT OR IGNORE INTO roles (id_rol, nombre) VALUES (2, 'cliente');

-- ============================================
-- Datos iniciales: Usuario administrador por defecto
-- Contraseña: admin123 (hasheada con bcrypt)
-- ============================================
INSERT OR IGNORE INTO usuarios (id_usuario, nombre, correo, contraseña, id_rol)
VALUES (1, 'Administrador', 'admin@velvetsociety.com', '$2a$10$Khd3S6RTh1iWmb9p7N1AZ.b/HBHLaBQ.uxh.hTSIl51qA0wP4gehm', 1);
