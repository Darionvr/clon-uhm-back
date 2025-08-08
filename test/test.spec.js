import request from "supertest";
import { app } from "../index.js"


describe("Rutas con GET en PETS", () => {
    it("Ver todas las mascotas", async () => {
        const response = await request(app).get("/pets");
        expect(response.statusCode).toBe(200);

    });
    it("Ver mascotas por ID", async () => {
        const response = await request(app).get("/pets/1")
        expect(response.statusCode).toBe(200);
    })
});

describe('Registro y login de nuevo usuario', () => {
    const newUser = {
        first_name: 'Nico',
        last_name: 'Test',
        email: 'nico@example.com',
        password: '123456',
        rut: '12345678-0',
        photo: 'avatar.jpg'
    };
    it('debería registrar un nuevo usuario', async () => {
        const res = await request(app)
            .post('/users/register')
            .set('Content-Type', 'application/json')
            .send(newUser);

        console.log('Datos para el create:', newUser);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.email).toBe(newUser.email);
    });

    it('debería loguear al usuario recién registrado', async () => {
        const res = await request(app)
            .post('/users/login')
            .send({
                email: newUser.email,
                password: newUser.password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});