import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "score_tracker_next",
  password: "postgres",
  port: 5432,
});
export default pool;
