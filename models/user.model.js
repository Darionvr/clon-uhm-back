import { pool } from "../database/connection.js";
import format from "pg-format";


const findById = async (id) => {
  const query = "Select * from users where id = $1";
  const {rows} = await pool.query(query, [id]);
  return rows[0]
}

const findByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0]; 
}


const create = async (user) => {
    const query = "Insert into users (first_name, last_name, email, rut, photo, password) values ($1, $2, $3, $4, $5, $6) returning *"
    const {rows} = await pool.query(query, [user.first_name, user.last_name, user.email, user.rut, user.photo, user.password])
    return rows[0];
}

const update = async (id, updatedFields) => {
  const fields = [];

  for (const key in updatedFields) {
    const value = updatedFields[key];
    if (value !== undefined) {
      // formatea cada campo como: columna = 'valor'
      fields.push(format('%I = %L', key, value));
    }
  }

  if (fields.length === 0) return null; 

  const query = format(
    'UPDATE users SET %s WHERE id = %L RETURNING id, first_name, last_name, email',
    fields.join(', '),
    id
  );

  const { rows } = await pool.query(query);
  return rows[0];
};




export const userModel = {create, update, findByEmail, findById }