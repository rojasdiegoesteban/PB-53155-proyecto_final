import jwt from "jsonwebtoken";
import env from "../config/env.config.js";

// Crear el token
export const createToken = (user) => {
  const { _id, email, role, cart } = user;
  const token = jwt.sign({ _id, email, role, cart }, env.SECRET_CODE, { expiresIn: "60m" });
  return token;
};

// Verificar el token
export const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, env.SECRET_CODE);
    return decode;
  } catch (error) {
    return null;
  }
};
