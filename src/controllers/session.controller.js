import { createToken } from "../utils/jwt.js";
import { userResponseDto } from "../dto/user-response.dto.js";

const register = async (req, res) => {
    try {
        res.status(201).json({ status: "success", msg: "Usuario creado" });

    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const user = req.user;
        const token = createToken(user);
        // Guardamos el token en una cookie
        res.cookie("token", token, { httpOnly: true });
        const userDto = userResponseDto(user);
        return res.status(200).json({ status: "success", payload: userDto, token });
    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Internal Server Error" });
    }
};

const current = async (req, res) => {
    try {
        //const userDto = userResponseDto(req.user);
        return res.status(200).json({ status: "success", payload: req.user });
    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Internal Server Error" });
    }
};

const loginGoogle = async (req, res) => {
    try {
        return res.status(200).json({ status: "success", payload: req.user });

    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({ status: "success", msg: "Sesion finalizada con éxito" });

    } catch (error) {
        res.status(500).json({ status: "Error", msg: "Internal server error" });
    }
};

export default {
    register,
    login,
    current,
    loginGoogle,
    logout
};