# VELVET SOCIETY - Frontend

> "Donde la exclusividad se convierte en experiencia"

Frontend de la plataforma Velvet Society.

## Tecnologías

- **HTML5**
- **CSS3**
- **JavaScript**

## Estructura

```
frontend-velvet-society/
│
├── public/
│   ├── index.html
│   ├── login.html
│   ├── registro.html
│   ├── servicios.html
│   ├── reservas.html
│   ├── perfil.html
│   ├── admin.html
│   │
│   ├── css/
│   │   └── styles.css
│   │
│   └── js/
│       ├── config.js
│       ├── app.js
│       ├── auth.js
│       ├── servicios.js
│       ├── reservas.js
│       └── admin.js
│
├── .env.production
├── .gitignore
└── README.md
```

## Despliegue en Vercel

1. Importa este repositorio en Vercel
2. Configura la variable de entorno `API_URL` con la URL del backend
3. Despliega

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `API_URL` | URL del backend (ej: `https://velvet-society-api.vercel.app`) |
