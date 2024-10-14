import productsRepository from "../persistences/mongo/repositories/product.repository.js";
import { productResponseDto } from "../dto/product-response.dto.js";
import { generateProductsMocks } from "../mocks/product.mock.js";
import error from  "../errors/customErrors.js";
import { sendMail } from "../utils/sendMails.js";

const getAll = async (query, options) => {
    const products = await productsRepository.getAll(query, options);
    if (!products) throw error.notFoundError("No se encontraron productos");
    return products;
};

const getById = async (id) => {
    const productData = await productsRepository.getById(id);
    if (!productData) throw error.notFoundError(`Producto con id ${id} no encontrado`);
    const product = productResponseDto(productData);
    return product;
};

const create = async (data, user) => {
    let productData = data;
    if (user.role === "premium") {
        productData = { ...data, owner: user.email };
    }

    const product = await productsRepository.create(productData);
    return product;
};

const update = async (id, data) => {
    const product = await productsRepository.update(id, data);
    if (!product) throw error.notFoundError(`Producto con id ${id} no encontrado`);
    return product;
};

const deleteOne = async (id, user) => {
    const productData = await productsRepository.getById(id);
    if (!productData) throw error.notFoundError(`Producto con id ${id} no encontrado`);

    if (user.role === "premium" && productData.owner !== user.email) {
        throw error.unauthorizedError(`Usuario no autorizado para eliminar el producto con id ${id}`);
    }

    if (user.role === "admin" && productData.owner !== "admin") {
        await sendMail(
            productData.owner, 
            "Producto eliminado", `El producto ${productData.title} ha sido eliminado por el usuario administrador`
        );
    }
    
    const product = await productsRepository.deleteOne(id);
    return product;
};

const createMocks = () => {
    return generateProductsMocks(50);
}


export default {
    getAll,
    getById,
    update,
    deleteOne,
    create,
    createMocks
  }