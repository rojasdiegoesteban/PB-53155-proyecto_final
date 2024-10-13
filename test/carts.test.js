import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../src/config/env.config.js";
import mongoose from "mongoose";
import { userModel } from "../src/persistences/mongo/models/user.model.js";
import { cartModel } from "../src/persistences/mongo/models/cart.model.js";

mongoose.connect(envConfig.MONGO_URL);

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Test carts", () => {

    let cookie;
    let cartId;
    let productId = "66de3bb809913836b1569fc3";

    //creo usuario tipo premium
    before(async () => {
        const newUser = {
            first_name: "User Test",
            last_name: "Premium",
            email: "user-test@premium.com",
            password: "1234",
            age: 30,
            role: "premium"
        };
        await requester.post("/api/session/register").send(newUser);
    });

    //login 
    before(async () => {
        const loginUser = {
            email: "user-test@premium.com",
            password: "1234",
        };

        const { headers } = await requester.post("/api/session/login").send(loginUser);
        const cookieResult = headers["set-cookie"][0];

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        };
    });

    //obtengo cartId relacionado con el usuario creado
    before(async () => {

        const { _body } = await requester.get("/api/session/current").set("Cookie", [`${cookie.name}=${cookie.value}`]);
        cartId = _body.payload.cart;
    });


    it("[POST] /api/carts/:cid/product/:pid este endpoint debe agregar un producto al carrito", async () => {

        const { status, _body, ok } = await requester
            .post(`/api/carts/${cartId}/product/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.status).to.be.equal("success");
    });

    it("[PUT] /api/carts/:cid/product/:pid este endpoint debe actualizar la cantidad de un producto en el carrito", async () => {
        const updateData = {
            quantity: 50
        };

        const { status, _body, ok } = await requester
            .put(`/api/carts/${cartId}/product/${productId}`)
            .send(updateData)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.status).to.be.equal("success");
    });

    it("[GET] /api/carts/:cid este endpoint debe devolver un carrito", async () => {
        const { status, _body, ok } = await requester.get(`/api/carts/${cartId}`).set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.status).to.be.equal("success");
    });

    it("[DELETE] /api/carts/:cid/product/:pid este endpoint debe eliminar un producto del carrito", async () => {

        const { status, ok } = await requester
            .delete(`/api/carts/${cartId}/product/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
    });

    it("[DELETE] /api/carts/:cid este endpoint debe eliminar todos los productos del carrito", async () => {

        const { status, ok } = await requester
            .delete(`/api/carts/${cartId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
    });

    after(async () => {
        await userModel.deleteOne({ email: "user-test@premium.com" });
        await cartModel.deleteOne({ _id: cartId });
        mongoose.disconnect();
    });

});