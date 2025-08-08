import pkg from 'pg';
import 'dotenv/config'
const { Pool } = pkg

const connectionString = process.env.PG_STRING_URL;

export const pool = connectionString
    ? new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false,
        },
        allowExitOnIdle: true,
    })
    : new Pool({
        allowExitOnIdle: true,
    });

console.log("Database connected");

