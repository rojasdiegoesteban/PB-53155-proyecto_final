import { fakerES as faker } from "@faker-js/faker";
import { productModel } from "../persistences/mongo/models/product.model.js";

export const generateProductsMocks = (amount) => {
    const products = [];

    for (let i = 0; i < amount; i++) {
        const product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            thumbnail: [faker.image.url()],
            code: faker.string.alphanumeric(10),
            stock: faker.number.int(9999),
            status: true,
            price: faker.number.int(99999),
            category: faker.commerce.department()
        };

        products.push(product);
    };

    //inserto los productos en la bd
    productModel.insertMany(products);

    return products;
}