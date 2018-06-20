import sqlite3 from "sqlite3";

const path = "./db/mytd.db";

export let db = undefined;
export const openDb = () => { db = new sqlite3.Database(path); };
export const closeDb = () => { db.close(); };