import postgres from 'pg';

const DB_URL = 'postgres://fxnictkv:PckiHZeC6sdQY3BZxMp7oeSIOZUbxThA@baasu.db.elephantsql.com/fxnictkv'
const pool = new postgres.Pool({connectionString: DB_URL});

export const db = {
  query: (text, params, callback) => {
    console.log('Executed Query', text);
    return pool.query(text, params, callback)
  }
}
