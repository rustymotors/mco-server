import Database from "better-sqlite3";

export function getDatabase(): Database.Database {
    const db = Database("mco_server.db")
    db.pragma('journal_mode = WAL');
    return db
}
