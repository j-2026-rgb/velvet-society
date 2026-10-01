const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database', 'velvet_society.db');

initSqlJs().then(SQL => {
    const db = new SQL.Database(fs.readFileSync(DB_PATH));
    db.run('PRAGMA foreign_keys = ON;');
    db.run("UPDATE usuarios SET contraseña = '$2a$10$Khd3S6RTh1iWmb9p7N1AZ.b/HBHLaBQ.uxh.hTSIl51qA0wP4gehm' WHERE correo = 'admin@velvetsociety.com';");
    fs.writeFileSync(DB_PATH, Buffer.from(db.export()));
    console.log('Contraseña actualizada correctamente');
    db.close();
});
