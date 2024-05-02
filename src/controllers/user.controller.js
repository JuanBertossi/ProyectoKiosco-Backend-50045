const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const CustomError = require("../services/errors/custom-error.js");
const EErrors = require("../services/errors/enums.js");
const { generarInfoError } = require("../services/errors/info.js");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existeUsuario = await UserModel.findOne({ email });
      if (existeUsuario) {
        throw new CustomError(
          "El usuario ya existe",
          "ErrorUsuarioExistente",
          "Usuario duplicado",
          EErrors.USUARIO_EXISTENTE
        );
      }

      const infoError = generarInfoError({ first_name, last_name, email });
      if (infoError) {
        throw new CustomError(
          "Datos de usuario incompletos o inválidos",
          "ErrorDatosUsuario",
          infoError,
          EErrors.DATOS_USUARIO_INVALIDOS
        );
      }

      const nuevoCarrito = new CartModel();
      await nuevoCarrito.save();

      const nuevoUsuario = new UserModel({
        first_name,
        last_name,
        email,
        cart: nuevoCarrito._id,
        password: createHash(password),
        age,
      });

      await nuevoUsuario.save();

      const token = jwt.sign({ user: nuevoUsuario }, "coderhouse", {
        expiresIn: "1h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      if (error instanceof CustomError) {
        console.error(error);
        return res.status(400).json({
          error: {
            name: error.name,
            cause: error.cause,
            message: error.message,
            code: error.code,
          },
        });
      } else {
        console.error(error);
        return res.status(500).json({
          error: {
            name: "ErrorInterno",
            cause: "Desconocido",
            message: "Error interno del servidor",
            code: EErrors.ERROR_INTERNO,
          },
        });
      }
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const usuarioEncontrado = await UserModel.findOne({ email });

      if (!usuarioEncontrado) {
        throw new CustomError({
          name: "ErrorUsuarioNoValido",
          message: "Usuario no válido",
          code: EErrors.USUARIO_NO_VALIDO,
        });
      }

      const esValido = isValidPassword(password, usuarioEncontrado);
      if (!esValido) {
        throw new CustomError({
          name: "ErrorContraseñaIncorrecta",
          message: "Contraseña incorrecta",
          code: EErrors.CONTRASEÑA_INCORRECTA,
        });
      }

      const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
        expiresIn: "1h",
      });

      res.cookie("coderCookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      if (error instanceof CustomError) {
        console.error(error);
        return res.status(400).json({
          error: {
            name: error.name,
            cause: error.cause,
            message: error.message,
            code: error.code,
          },
        });
      } else {
        console.error(error);
        return res.status(500).json({
          error: {
            name: "ErrorInterno",
            cause: "Desconocido",
            message: "Error interno del servidor",
            code: EErrors.ERROR_INTERNO,
          },
        });
      }
    }
  }

  async profile(req, res) {
    const userDto = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role
    );
    const isAdmin = req.user.role === "admin";
    res.render("profile", { user: userDto, isAdmin });
  }

  async logout(req, res) {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }

  async admin(req, res) {
    if (req.user.user.role !== "admin") {
      return res.status(403).send("Acceso denegado");
    }
    res.render("admin");
  }
}

module.exports = UserController;
