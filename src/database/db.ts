import {Pool} from 'pg';

const pool = new Pool({
    user: "postgres",
    password: "root",
    host: "localhost",
    port: 5432,
    database: "time-tracker-prod",
});


export default pool
