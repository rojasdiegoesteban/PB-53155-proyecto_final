import { Router } from "express";
import { authorization, passportCall } from "../middlewares/passport.middleware.js";
import { checkProductAndCart } from "../middlewares/checkProductAndCart.middleware.js";
import cartsController from "../controllers/cart.controller.js";
import { isUserCart } from "../middlewares/isUserCart.js";

const router = Router();

// create cart
router.post("/", passportCall("jwt"), authorization("admin"), cartsController.createCart);

// add product to cart
router.post("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, isUserCart, cartsController.addProductToCart);

// update product quantity from cart
router.put("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, cartsController.updateQuantityProductInCart);

// delete product in cart
router.delete("/:cid/product/:pid", passportCall("jwt"), authorization(["user", "premium"]), checkProductAndCart, cartsController.deleteProductInCart);

// get cart by id
router.get("/:cid", passportCall("jwt"), authorization(["user", "premium"]), cartsController.getCartById);

// delete all products in cart
router.delete("/:cid", passportCall("jwt"), authorization(["user", "premium"]), cartsController.deleteAllProductsInCart);

// purchese cart
router.get("/:cid/purchase", passportCall("jwt"), authorization(["user", "premium"]), cartsController.purchaseCart);


export default router;