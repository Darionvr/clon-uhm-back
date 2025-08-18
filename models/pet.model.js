import { pool } from '../database/connection.js'
import format from 'pg-format';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.DOMAIN_URL_APP
    : `http://localhost:${process.env.PORT}`;

const findAllPets = async ({ limit = 8, page = 1, specie, size, age }) => {
  const values = [];
  const conditions = [];

  // Filtros dinámicos
  if (specie) {
    values.push(specie);
    conditions.push(`specie = $${values.length}`);
  }
  if (size === '800gr-4kg') conditions.push(`weight BETWEEN 0.8 AND 4`);
  if (size === '5kg-9kg') conditions.push(`weight BETWEEN 5 AND 9`);
  if (size === '+10kg') conditions.push(`weight >= 10`);
  if (age === '-1a') conditions.push(`age < 1`);
  if (age === '1-3a') conditions.push(`age BETWEEN 1 AND 3`);
  if (age === '+4a') conditions.push(`age > 4`);

  // Construir cláusula WHERE
  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Calcular offset para paginación
  const offset = (page - 1) * limit;

  // Query de conteo
  const countSQL = `SELECT COUNT(*) FROM pets ${whereClause}`;
  const { rows: countRows } = await pool.query(countSQL, values);
  const total_rows = parseInt(countRows[0].count, 10);
  const total_pages = Math.ceil(total_rows / limit);

  // Query de datos
  const dataSQL = `
    SELECT *
    FROM pets
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${values.length + 1} OFFSET $${values.length + 2}
  `;
  const dataValues = [...values, limit, offset];
  const { rows } = await pool.query(dataSQL, dataValues);

  return {
    results: rows.map(row => ({
      ...row,
      href: `${BASE_URL}/api/pets/${row.id}`,
    })),
    total_pages,
    page,
    limit,
    next: page < total_pages ? `${BASE_URL}/api/pets?limit=${limit}&page=${page + 1}` : null,
    previous: page > 1 ? `${BASE_URL}/api/pets?limit=${limit}&page=${page - 1}` : null,
  };
};




const findById = async (id) => {
  const query = "Select * from pets where id = $1";
  const { rows } = await pool.query(query, [id]);
  return rows[0]
}

const findByUser = async (userId) => {
  const query = " SELECT * FROM pets WHERE author_post = $1 ORDER BY created_at DESC";
  const { rows } = await pool.query(query, [userId]);
  return rows;
};


const create = async (pet, userId) => {
  const query = "Insert into pets (name, specie, weight, age, gender, chip, photo, description, author_post) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *"
  const { rows } = await pool.query(query, [pet.name, pet.specie, pet.weight, pet.age, pet.gender, pet.chip, pet.photo, pet.description, userId])
  return rows[0]
}

const remove = async (id) => {
  const query = "delete from pets where id = $1 returning *";
  const { rows } = await pool.query(query, [id])
  return rows[0]

}

const update = async (id, userId, updateData) => {
  const query = "UPDATE pets SET name = $1, specie = $2, age = $3, weight = $4, gender = $5, chip = $6, photo = $7, description = $8 WHERE id = $9 AND author_post = $10 RETURNING *";

  const values = [
    updateData.name,
    updateData.specie,
    updateData.age,
    updateData.weight,
    updateData.gender,
    updateData.chip,
    updateData.photo,
    updateData.description,
    id,
    userId
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};



export const petModel = {
  findAllPets, findById, create, remove, update, findByUser
};