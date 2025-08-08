CREATE DATABASE unhogarmas;
\c unhogarmas;

CREATE TABLE pets (id SERIAL PRIMARY KEY, name VARCHAR(20) NOT NULL, author_post INT REFERENCES users(id), specie VARCHAR(20) NOT NULL, age int NOT NULL, weight INT NOT NULL, gender VARCHAR(10), chip BOOLEAN NOT NULL, photo VARCHAR(255) NOT NULL, description VARCHAR (255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE users (id SERIAL PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, rut VARCHAR(12) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(50) NOT NULL, photo VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, role VARCHAR(20) DEFAULT 'usuario' CHECK (role IN ('usuario', 'administrador')));

CREATE TABLE request ( id SERIAL PRIMARY KEY, age INT NOT NULL,  phone VARCHAR(20) NOT NULL, address VARCHAR(255) NOT NULL, housing_type VARCHAR(50), allows_pets BOOLEAN NOT NULL, pet_name VARCHAR(100), reason TEXT, household VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INT REFERENCES users(id), status VARCHAR(10) CHECK (status IN ('pendiente', 'aceptada')) DEFAULT 'pendiente'
);


SELECT * FROM pets;
SELECT * FROM users;
SELECT * FROM request;

