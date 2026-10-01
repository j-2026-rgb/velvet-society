const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'database', 'velvet_society.db');

async function debug() {
    const SQL = await initSqlJs();
    const db = new SQL.Database(fs.readFileSync(DB_PATH));
    db.run('PRAGMA foreign_keys = ON;');

    // 1. Verificar qué hash está en la base de datos
    const stmt = db.prepare('SELECT contraseña FROM usuarios WHERE correo = ?');
    stmt.bind(['admin@velvetsociety.com']);
    stmt.step();
    const row = stmt.getAsObject();
    stmt.free();

    console.log('Hash en BD:', row.contraseña);
    console.log('Longitud:', row.contraseña.length);

    // 2. Generar un nuevo hash y verificarlo inmediatamente
    const newHash = bcrypt.hashSync('admin123', 10);
    console.log('Hash generado:', newHash);
    console.log('Verificación inmediata:', bcrypt.compareSync('admin123', newHash));

    // 3. Verificar el hash de la BD
    console.log('Verificación hash BD:', bcrypt.compareSync('admin123', row.contraseña));

    // 4. Actualizar con el nuevo hash
    db.run('UPDATE usuarios SET contraseña = ? WHERE correo = ?', [newHash, 'admin@velvetsociety.com']);
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));

    // 5. Verificar después de actualizar
    const stmt2 = db.prepare('SELECT contraseña FROM usuarios WHERE correo = ?');
    stmt2.bind(['admin@velvetsociety.com']);
    stmt2.step();
    const row2 = stmt2.getAsObject();
    stmt2.free();

    console.log('Hash después de actualizar:', row2.contraseña);
    console.log('Verificación después de actualizar:', bcrypt.compareSync('admin123', row2.contraseña));

    db.close();
}

debug();
