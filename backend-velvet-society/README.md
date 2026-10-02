# VELVET SOCIETY

> "Donde la exclusividad se convierte en experiencia"

Plataforma web premium para gestión de servicios exclusivos.

## Tecnologías

- **Backend:** Node.js + Express
- **Frontend:** HTML5 + CSS3 + JavaScript
- **Base de datos:** SQLite
- **Autenticación:** Sesiones con cookies + bcrypt

## Estructura del Proyecto

```
VELVET-SOCIETY/
│
├── public/                 # Frontend
│   ├── index.html         # Página principal
│   ├── login.html         # Inicio de sesión
│   ├── registro.html      # Registro de clientes
│   ├── servicios.html     # Catálogo de servicios
│   ├── reservas.html      # Gestión de reservas
│   ├── perfil.html        # Perfil de usuario
│   ├── admin.html         # Panel administrativo
│   │
│   ├── css/
│   │   └── styles.css     # Estilos premium
│   │
│   └── js/
│       ├── app.js         # Lógica principal
│       ├── auth.js        # Autenticación
│       ├── servicios.js   # Servicios
│       ├── reservas.js    # Reservas
│       └── admin.js       # Panel admin
│
├── server/                # Backend
│   ├── routes/            # Rutas de la API
│   └── database/          # Conexión a SQLite
│
├── database/              # Base de datos
│   ├── schema.sql         # Esquema SQL
│   └── velvet_society.db  # Base de datos (auto-generada)
│
├── package.json
├── server.js              # Punto de entrada
└── README.md
```

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start

# Modo desarrollo (con recarga automática)
npm run dev
```

## Credenciales por Defecto

| Rol           | Correo                  | Contraseña |
|---------------|-------------------------|------------|
| Administrador | admin@velvetsociety.com | admin123   |

## API Endpoints

### Autenticación
- `POST /api/auth/registro` - Registrar cliente
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/sesion` - Verificar sesión

### Servicios
- `GET /api/servicios` - Listar servicios activos
- `GET /api/servicios/todos` - Listar todos (admin)
- `GET /api/servicios/:id` - Obtener servicio
- `POST /api/servicios` - Crear servicio (admin)
- `PUT /api/servicios/:id` - Actualizar servicio (admin)
- `DELETE /api/servicios/:id` - Desactivar servicio (admin)

### Reservas
- `GET /api/reservas/mis-reservas` - Reservas del cliente
- `GET /api/reservas` - Todas las reservas (admin)
- `POST /api/reservas` - Crear reserva
- `PUT /api/reservas/:id/estado` - Actualizar estado (admin)
- `PUT /api/reservas/:id/cancelar` - Cancelar reserva

### Usuarios y Clientes
- `GET /api/usuarios` - Listar usuarios (admin)
- `GET /api/usuarios/perfil` - Perfil del usuario
- `GET /api/clientes` - Listar clientes (admin)

### Pagos
- `GET /api/pagos/reserva/:id` - Pagos de una reserva
- `POST /api/pagos` - Registrar pago

## Paleta de Colores

| Color           | Código     | Uso                          |
|-----------------|------------|------------------------------|
| Negro carbón    | `#0D0D0D`  | Fondos principales           |
| Gris grafito    | `#181818`  | Tarjetas y paneles           |
| Dorado elegante | `#C9A227`  | Botones y detalles           |
| Champagne       | `#D8C08C`  | Hover y decorativos          |
| Blanco marfil   | `#F5F1E8`  | Títulos y texto principal    |
| Gris cálido     | `#A7A29A`  | Texto secundario             |
| Gris oscuro     | `#2A2A2A`  | Bordes y separadores         |

## Licencia

MIT
