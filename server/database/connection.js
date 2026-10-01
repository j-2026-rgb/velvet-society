const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', '..', 'database', 'velvet_society.db');
const SCHEMA_PATH = path.join(__dirname, '..', '..', 'database', 'schema.sql');

let db = null;

async function getConnection() {
    if (!db) {
        const SQL = await initSqlJs();

        if (fs.existsSync(DB_PATH)) {
            const fileBuffer = fs.readFileSync(DB_PATH);
            db = new SQL.Database(fileBuffer);
        } else {
            db = new SQL.Database();
        }

        db.run('PRAGMA foreign_keys = ON;');
    }
    return db;
}

async function initializeDatabase() {
    const connection = await getConnection();
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    connection.exec(schema);
    saveDatabase();
    console.log('  Base de datos inicializada correctamente\n');
}

function saveDatabase() {
    if (db) {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(DB_PATH, buffer);
    }
}

function run(sql, params = []) {
    if (params.length > 0) {
        const stmt = db.prepare(sql);
        stmt.run(params);
        stmt.free();
    } else {
        db.run(sql);
    }
    saveDatabase();
    const result = db.exec('SELECT last_insert_rowid() as id');
    return { changes: db.getRowsModified(), lastInsertRowid: result[0]?.values[0]?.[0] };
}

function get(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    let row = undefined;
    if (stmt.step()) {
        const columns = stmt.getColumnNames();
        const values = stmt.get();
        row = {};
        columns.forEach((col, i) => {
            row[col] = values[i];
        });
    }
    stmt.free();
    return row;
}

function all(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    const rows = [];
    const columns = stmt.getColumnNames();
    while (stmt.step()) {
        const values = stmt.get();
        const row = {};
        columns.forEach((col, i) => {
            row[col] = values[i];
        });
        rows.push(row);
    }
    stmt.free();
    return rows;
}

function exec(sql) {
    const result = db.exec(sql);
    saveDatabase();
    return result;
}

module.exports = { getConnection, initializeDatabase, run, get, all, exec };
