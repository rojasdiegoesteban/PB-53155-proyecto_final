import cartsRepository from "../persistences/mongo/repositories/cart.repository.js";
import productsRepository from "../persistences/mongo/repositories/product.repository.js";
import error from  "../errors/customErrors.js";

// create cart
const createCart = async () => {
    return await cartsRepository.create();
};

// add product to cart
const addProductToCart = async (cid, pid, user) => {
    const product = await productsRepository.getById(pid);
  
    if (user.role === "premium" && product.owner === user._id) {
      throw error.unauthorizedError("No puede agregar productos de su propiedad al carrito");
    }
    return await cartsRepository.addProductToCart(cid, pid);
  };

// update product quantity from cart
const updateQuantityProductInCart = async (cid, pid, quantity) => {
    if (quantity < 1) throw error.badRequestError("Cantidad incorrecta, por favor ingrese un valor mayor a cero");
    const cart = await cartsRepository.updateQuantityProductInCart(cid, pid, quantity);
    if(!cart) throw error.notFoundError(`El producto con id ${pid} no se encotró en el carrito`);
    return cart;
};

// delete product in cart
const deleteProductInCart = async (cid, pid) => {
    const cart = await cartsRepository.deleteProductInCart(cid, pid);
    if(!cart) throw error.notFoundError(`El producto con id ${pid} no se encotró en el carrito`);
    return cart;
};

// get cart by id
const getCartById = async (cid) => {
    const cart = await cartsRepository.getById(cid);
    if(!cart) throw error.notFoundError(`No se encontró el carrito con id ${cid}`);
    return cart;
};

// delete all products in cart
const deleteAllProductsInCart = async (cid) => {
    const cart = await cartsRepository.deleteAllProductsInCart(cid);
    if(!cart) throw error.notFoundError(`No se encontró el carrito con id ${cid}`);
    return cart;
};

// purchese cart
const purchaseCart = async (cid) => {
    const cart = await cartsRepository.getById(cid);
    let total = 0;
    const products = [];

    for( const product of cart.products) {
        const prod = await productsRepository.getById(product.product);
        if(prod.stock >= product.quantity) {
          total += prod.price * product.quantity;
        } else {
          products.push(product)
        }
         
        // Modificar los productos del carrito
        await cartsRepository.updateCart(cid, products);
    }

    return total;
};


export default {
    createCart,
    addProductToCart,
    updateQuantityProductInCart,
    deleteProductInCart,
    getCartById,
    deleteAllProductsInCart,
    purchaseCart
};