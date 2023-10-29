import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "dngsuu746539",
  database: "sakila",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool.promise();
