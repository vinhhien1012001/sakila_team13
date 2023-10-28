import mysql from "mysql2";

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 8889,
  user: "root",
  password: "root",
  database: "sakila",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool.promise();
