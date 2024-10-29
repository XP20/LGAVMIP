import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database as BunDatabase } from 'bun:sqlite';

class Database {
    private static _instance: Database;
    public db;

    private constructor() {
        const sqlite = new BunDatabase('sqlite.db');
        this.db = drizzle({ client: sqlite });
    }

    public static get db() {
        const instance = this._instance || (this._instance = new this());
        return instance.db;
    }
}

export default Database;