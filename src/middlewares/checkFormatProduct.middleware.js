import { request, response } from "express";
import error from  "../errors/customErrors.js";
import { productErrorInfo } from "../errors/info.js";

export const checkFormatProduct = async (req = request, res = response, next) => {

    const {title, description, code, stock, price} = req.body;

    try {

        if (!title||!description||!code||!stock||!price){
            console.error(productErrorInfo({ title, description, code, stock, price }));
            throw error.badRequestError("Error: formato invalido");
        }
        
    } catch (error) {
        next(error);
    }

    next();
};