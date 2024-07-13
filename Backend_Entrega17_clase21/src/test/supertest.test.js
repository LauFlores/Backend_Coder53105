const supertest = require("supertest");
let expect;
let requester;


before(async function () {
    const chai = await import("chai");
    expect = chai.expect;
    requester = supertest("http://localhost:8080");
});

describe("Sessions Test", () => {
    it("Debe registrar un nuevo usuario", async () => {
        const mockUsuario = {
            first_name: "Juan",
            last_name: "Perez",
            email: "example@admin.com",
            password: "password123",
            age: 25
        };

        const response = await requester.post("/api/user").send(mockUsuario);
        

    });

    it("Debe iniciar sesión con el usuario usando email y contraseña", async () => {
        const datosLogin = {
            email: "example@admin.com",
            password: "password123"
        };

        const resultado = await requester.post("/api/user/login").send(datosLogin);


    });

    it("Debe cerrar sesión correctamente", async () => {
        // Realiza una solicitud HTTP GET a la ruta de logout
        const response = await requester.get("/api/user/logout");


    });
});

describe("Product Controller", () => {
    before(async function () {
        // Inicia sesión antes de las pruebas de productos
        const datosLogin = {
            email: "example@admin.com",
            password: "password123"
        };

        const resultado = await requester.post("/api/user/login").send(datosLogin);

    });


    it("Debe obtener una lista de productos", async () => {
        const response = await requester.get("/api/products");


        const productos = response.body.docs;
        expect(productos).to.be.an("array").that.is.not.empty;
    });

    it("Debe obtener un producto por su ID", async () => {
        const response = await requester.get("/api/products");


        const productos = response.body.docs;
        expect(productos).to.be.an("array").that.is.not.empty;

        const productId = productos[0]._id;
        expect(productId).to.exist;

        const responseById = await requester.get(`/api/products/${productId}`);


        expect(responseById.status, `Error: ${responseById.text}`).to.equal(200);
        expect(responseById.body).to.have.property("title");
        expect(responseById.body).to.have.property("description");
    });
});