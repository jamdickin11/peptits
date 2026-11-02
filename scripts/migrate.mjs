import {readFile} from 'node:fs/promises';
import {getMigrations} from 'better-auth/db/migration';
import {getPool} from '../lib/postgres.ts';
import {buildAuth} from '../lib/auth.ts';
const pool=getPool();const client=await pool.connect();
try{await client.query('BEGIN');await client.query('CREATE TABLE IF NOT EXISTS store_migrations (id TEXT PRIMARY KEY,applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');const done=await client.query('SELECT id FROM store_migrations WHERE id=$1',['001-store']);if(!done.rowCount){await client.query(await readFile(new URL('../db/001-store.sql',import.meta.url),'utf8'));await client.query('INSERT INTO store_migrations (id) VALUES ($1)',['001-store']);}await client.query('COMMIT');}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
try{const migrations=await getMigrations(buildAuth().options);await migrations.runMigrations();console.log('Store and authentication database migrations completed.');}finally{await pool.end();}
