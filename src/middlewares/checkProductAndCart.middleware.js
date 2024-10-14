import { request, response } from "express";
import productsServices from "../services/product.services.js";
import cartsServices from "../services/cart.services.js";

export const checkProductAndCart = async (req = request, res = response, next) => {
  const { cid, pid } = req.params;

  try {
    const product = await productsServices.getById(pid);
    const cart = await cartsServices.getCartById(cid);
    
  } catch (error) {
    next(error);
  }

  next();
};
