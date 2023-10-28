import db from '../utils/db.js'; // Import your database connection

export default function (table_name, id_field) {
    return {
        findAll: async () => {
            try {
                const [rows] = await db.query(`SELECT * FROM ${table_name}`);
                return rows;
            } catch (err) {
                throw err;
            }
        },

        findById: async (id) => {
            try {
                const [rows] = await db.query(`SELECT * FROM ${table_name} WHERE ${id_field} = ?`, [id]);
                if (rows.length === 1) {
                  return rows[0];
                }
                return null;
              } catch (err) {
                throw err;
              }
        },
        add: async (entity) => {
            try {
                const [result] = await db.query(`INSERT INTO ${table_name} (first_name, last_name) VALUES (?, ?)`, [entity.first_name, entity.last_name]);
                if (result.affectedRows === 1) {
                  return result.insertId; // Return the ID of the newly added actor
                }
                return null; // Insertion failed
            } catch (err) {
                throw err;
            }
        },
        delete: async (id) => {
            try {
                const [result] = await db.query(`DELETE FROM ${table_name} WHERE ${id_field} = ?`, [id]);
                if (result.affectedRows === 1) {
                  return true; // Row deleted successfully
                }
                return false; // No rows were deleted (actor not found)
            } catch (err) {
                throw err;
            }
        }
    }
    
};

