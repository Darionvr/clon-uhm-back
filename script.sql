CREATE DATABASE unhogarmas;
\c unhogarmas;

CREATE TABLE pets (id SERIAL PRIMARY KEY, name VARCHAR(20) NOT NULL, author_post INT REFERENCES users(id), specie VARCHAR(20) NOT NULL, age int NOT NULL, weight INT NOT NULL, gender VARCHAR(10), chip BOOLEAN NOT NULL, photo VARCHAR(255) NOT NULL, description VARCHAR (255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

INSERT INTO pets (name, author_post, specie, age, weight, gender, chip, photo, description)
VALUES 
('Luna', 1, 'perro', 2, 4, 'female', true, 'luna.jpg', 'Tranquila, ideal para departamentos.'),
('Rayo', 2, 'gato', 0, 2, 'male', false, 'rayo.jpg', 'Juguetón y curioso, necesita compañía.'),
('Simón', 1, 'conejo', 5, 12, 'male', true, 'simon.jpg', 'Amigable y bien entrenado.'),
('Mora', 3, 'gato', 3, 6, 'female', true, 'mora.jpg', 'Sociable con niños y otras mascotas.'),
('Toby', 2, 'perro', 7, 18, 'male', false, 'toby.jpg', 'Enérgico y protector, busca espacio.'),
('Lila', 4, 'conejo', 1, 3, 'female', false, 'lila.jpg', 'Muy cariñosa, le encanta dormir al sol.'),
('Nico', 3, 'perro', 4, 25, 'male', true, 'nico.jpg', 'Leal y obediente, necesita ejercicio.'),
('Brisa', 1, 'gato', 2, 5, 'female', true, 'brisa.jpg', 'Independiente y silenciosa, ideal para adultos.');


CREATE TABLE users (id SERIAL PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, rut VARCHAR(12) UNIQUE NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, password VARCHAR(50) NOT NULL, photo VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, role VARCHAR(20) DEFAULT 'usuario' CHECK (role IN ('usuario', 'administrador')));

INSERT INTO users (first_name, last_name, rut, email, password, photo, role)
VALUES 
('Camila', 'Rodríguez', '12345678-9', 'camila@example.com', 'hashed_pass1', 'camila.jpg', 'usuario'),
('Javier', 'Fuentes', '22345678-5', 'javier@example.com', 'hashed_pass2', 'javier.jpg', 'usuario'),
('Sofía', 'Navarro', '32345678-1', 'sofia@example.com', 'hashed_pass3', 'sofia.jpg', 'usuario'),
('Esteban', 'Leiva', '42345678-0', 'esteban@example.com', 'hashed_pass4', 'esteban.jpg', 'usuario'),
('Valentina', 'Salas', '52345678-3', 'valentina.admin@hogarmas.cl', 'hashed_admin_pass', 'valentina.jpg', 'administrador');


CREATE TABLE request ( id SERIAL PRIMARY KEY, age INT NOT NULL,  phone VARCHAR(20) NOT NULL, address VARCHAR(255) NOT NULL, housing_type VARCHAR(50), allows_pets BOOLEAN NOT NULL, pet_name VARCHAR(100), reason TEXT, household VARCHAR(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, user_id INT REFERENCES users(id), status VARCHAR(10) CHECK (status IN ('pendiente', 'aceptada')) DEFAULT 'pendiente'
);


SELECT * FROM pets;
SELECT * FROM users;
SELECT * FROM request;

