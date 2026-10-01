const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'database', 'velvet_society.db');

async function debug() {
    const SQL = await initSqlJs();
    const db = new SQL.Database(fs.readFileSync(DB_PATH));
    db.run('PRAGMA foreign_keys = ON;');

    console.log('=== DIAGNÓSTICO DE LOGIN ===\n');

    // 1. Verificar si el usuario existe
    const stmt = db.prepare('SELECT * FROM usuarios WHERE correo = ?');
    stmt.bind(['admin@velvetsociety.com']);

    if (stmt.step()) {
        const usuario = stmt.getAsObject();
        console.log('Usuario encontrado:');
        console.log('  ID:', usuario.id_usuario);
        console.log('  Nombre:', usuario.nombre);
        console.log('  Correo:', usuario.correo);
        console.log('  Contraseña hash:', usuario.contraseña);
        console.log('  Rol ID:', usuario.id_rol);

        // 2. Verificar la contraseña
        console.log('\nVerificación de contraseña:');
        console.log('  Contraseña ingresada: admin123');
        console.log('  Hash almacenado:', usuario.contraseña);

        const match = bcrypt.compareSync('admin123', usuario.contraseña);
        console.log('  Resultado:', match ? 'CORRECTA' : 'INCORRECTA');

        // 3. Generar un nuevo hash para comparar
        const newHash = bcrypt.hashSync('admin123', 10);
        console.log('\nNuevo hash generado:', newHash);
        console.log('Hashes iguales:', usuario.contraseña === newHash);
    } else {
        console.log('Usuario NO encontrado');
    }

    stmt.free();
    db.close();
}

debug();
