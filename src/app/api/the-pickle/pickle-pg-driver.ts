import { Pool } from "pg";
import { Pickle_DB } from "./the-pickle";

export class PG_Pickle implements Pickle_DB {
  #pool;

  constructor(connectionString?: string) {
    if(!connectionString){
        throw Error("DB Connection string not set in env")
    }

    this.#pool = new Pool({
      connectionString: connectionString,
    });

    this.createTable();
  }

  async createTable() {
    await this.#pool.query(`
        CREATE TABLE IF NOT EXISTS apps (
          id SERIAL PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          data TEXT
        )
      `);
  }
  async get(appKey: string) {
    const res = await this.#pool.query("SELECT * FROM apps WHERE key = $1", [
      appKey,
    ]);
    return res.rows[0];
  }
  async save({ key, name, data }: { key: string; name: string; data: string }) {
    const res = await this.#pool.query(
      `
      INSERT INTO apps (key, name, data)
      VALUES ($1, $2, $3)
      ON CONFLICT (key)
      DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = NOW()
      `,
      [key, name, data]
    );
    return res.rowCount === 1;
  }
}
