import { pool } from '../database/connection.js';


const findAllRequest = async () => {
  const query = `
    SELECT  
      r.*, 
      u.first_name AS user_nombre, 
      u.last_name AS user_apellido, 
      u.email AS user_correo,
      u.photo AS user_imagen
    FROM request r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};



const findRequestById = async (id) => {
  const query = 'SELECT * FROM request WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const create = async (request) => {
  const query = "INSERT INTO request (age, phone, address, housing_type, allows_pets, pet_name, reason, household, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning * ";
  const values = [
    request.age,
    request.phone,
    request.address,
    request.housing_type,
    request.allows_pets,
    request.pet_name,
    request.reason,
    request.household,
    request.user_id
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

const update = async (id, status) => {
  const query = format(
    'UPDATE request SET status = %L WHERE id = %L RETURNING *',
    status,
    id
  );

  const { rows } = await pool.query(query);
  return rows[0];
};



const remove = async (id) => {
  const query = "DELETE FROM request WHERE id = $1 RETURNING *";
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const requestModel = { findAllRequest, create, update, remove, findRequestById };
