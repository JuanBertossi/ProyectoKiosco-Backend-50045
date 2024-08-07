const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashbcryp.js");
const UserDTO = require("../dto/user.dto.js");
const { generateResetToken } = require("../utils/tokenreset.js");

const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;
    try {
      const existeUsuario = await UserModel.findOne({ email });
      if (existeUsuario) {
        return res.status(400).send("El usuario ya existe");
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
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const usuarioEncontrado = await UserModel.findOne({ email });

      if (!usuarioEncontrado) {
        return res.status(401).send("Usuario no válido");
      }

      const esValido = isValidPassword(password, usuarioEncontrado);
      if (!esValido) {
        return res.status(401).send("Contraseña incorrecta");
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
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async profile(req, res) {
    try {
      const isPremium = req.user.role === "premium";
      const userDto = new UserDTO(
        req.user.first_name,
        req.user.last_name,
        req.user.role
      );
      const isAdmin = req.user.role === "admin";

      res.render("profile", { user: userDto, isPremium, isAdmin });
    } catch (error) {
      res.status(500).send("Error interno del servidor");
    }
  }

  async logout(req, res) {
    res.clearCookie("coderCookieToken");
    res.redirect("/login");
  }

  async admin(req, res) {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).send("Acceso denegado");
      }

      if (req.user.role !== "admin") {
        return res.status(403).send("Acceso denegado");
      }

      const users = await UserModel.find({}, { _id: 0, password: 0, __v: 0 }); // Excluye _id, password y __v del resultado

      res.render("admin", { users });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async requestPasswordReset(req, res) {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      const token = generateResetToken();
      user.resetToken = {
        token: token,
        expiresAt: new Date(Date.now() + 3600000),
      };
      await user.save();

      await emailManager.enviarCorreoRestablecimiento(
        email,
        user.first_name,
        token
      );

      res.redirect("/confirmacion-envio");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async resetPassword(req, res) {
    const { email, password, token } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.render("passwordcambio", { error: "Usuario no encontrado" });
      }

      const resetToken = user.resetToken;
      if (!resetToken || resetToken.token !== token) {
        return res.render("passwordreset", {
          error: "El token de restablecimiento de contraseña es inválido",
        });
      }

      const now = new Date();
      if (now > resetToken.expiresAt) {
        return res.redirect("/passwordcambio");
      }

      if (isValidPassword(password, user)) {
        return res.render("passwordcambio", {
          error: "La nueva contraseña no puede ser igual a la anterior",
        });
      }

      user.password = createHash(password);
      user.resetToken = undefined;
      +(await user.save());

      return res.redirect("/login");
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .render("passwordreset", { error: "Error interno del servidor" });
    }
  }

  async cambiarRolPremium(req, res) {
    try {
      const { uid } = req.params;

      const user = await UserModel.findById(uid);

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const nuevoRol = user.role === "usuario" ? "premium" : "usuario";

      const actualizado = await UserModel.findByIdAndUpdate(
        uid,
        { role: nuevoRol },
        { new: true }
      );
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserModel.find({}, { _id: 0, password: 0, __v: 0 });
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async deleteInactiveUsers(req, res) {
    try {
      const deletedUsers = [];
      const users = await UserModel.find({});

      for (const user of users) {
        const lastConnectionDate = new Date(user.last_connection);
        const now = new Date();
        const timeDifference = Math.abs(now - lastConnectionDate);
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));

        if (minutesDifference > 30) {
          const deletedUser = await UserModel.findByIdAndDelete(user._id);

          await emailManager.enviarCorreoEliminacionPorInactividad(
            user.email,
            user.first_name
          );

          deletedUsers.push(deletedUser);
        }
      }

      res.json({ deletedUsers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  }
}

module.exports = UserController;
