import { pool } from '../database/connection.js'
import format from 'pg-format';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.DOMAIN_URL_APP
    : `http://localhost:${process.env.PORT}`;

const findAllPets = async ({ limit = 8, page = 1, specie, size, age }) => {
  let countQuery = 'SELECT COUNT(*) FROM pets WHERE true';
  const countConditions = [];

  if (specie) countConditions.push(format('specie = %L', specie));
  if (size === '800gr-4kg') countConditions.push('weight BETWEEN 0.8 AND 4');
  if (size === '5kg-9kg') countConditions.push('weight BETWEEN 5 AND 9');
  if (size === '+10kg') countConditions.push('weight >= 10');
  if (age === '-1a') countConditions.push('age < 1');
  if (age === '1-3a') countConditions.push('age BETWEEN 1 AND 3');
  if (age === '+4a') countConditions.push('age > 4');

  if (countConditions.length > 0) {
    countQuery += ' AND ' + countConditions.join(' AND ');
  }

 
  const { rows: countResult } = await pool.query(countQuery);
  const total_rows = parseInt(countResult[0].count, 10);
  const total_pages = Math.ceil(total_rows / limit);
  const offset = (page - 1) * limit;


  let query = 'SELECT * FROM pets WHERE true';
  const conditions = [...countConditions];

  if (conditions.length > 0) {
    query += ' AND ' + conditions.join(' AND ');
  }

  query += format(' ORDER BY created_at DESC LIMIT %L OFFSET %L', limit, offset);

  const { rows } = await pool.query(query);


  const results = rows.map((row) => ({
    ...row,
    href: `${BASE_URL}/api/pets/${row.id}`,
  }));


  return {
    results,
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