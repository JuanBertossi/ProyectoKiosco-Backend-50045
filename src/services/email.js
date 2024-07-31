const nodemailer = require("nodemailer");

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "testingprogramacion0@gmail.com",
        pass: "wsvc zmps hywv ilva",
      },
    });
  }

  async enviarCorreoProductoEliminado(email, productName) {
    try {
      const mailOptions = {
        from: "bertossijuani@gmail.com",
        to: "testingprogramacion0@gmail.com",
        subject: "Producto Eliminado",
        html: `
          <h1>Producto Eliminado</h1>
          <p>Estimado usuario,</p>
          <p>El producto ${productName} ha sido eliminado de su cuenta.</p>
          <p>Atentamente,</p>
          <p>Tu equipo de soporte</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(
        `Correo enviado a ${email} sobre la eliminación del producto ${productName}`
      );
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw new Error("Error al enviar correo electrónico");
    }
  }

  async enviarCorreoCompra(email, nombre, ticketId, productos, total) {
    try {
      const productosHTML = productos
        .map(
          (item) => `
        <li>
          <strong>Producto:</strong> ${item.product.title} <br>
          <strong>Cantidad:</strong> ${item.quantity} <br>
          <strong>Precio:</strong> $${item.product.price} <br>
        </li>
      `
        )
        .join("");

      const mailOptions = {
        from: "bertossijuani@gmail.com",
        to: email,
        subject: "Compra Realizada",
        html: `
          <h1>Compra Realizada</h1>
          <p>Estimado ${nombre},</p>
          <p>Su compra ha sido realizada con éxito. Su número de ticket es ${ticketId}.</p>
          <p>Detalles de la compra:</p>
          <ul>
            ${productosHTML}
          </ul>
          <p><strong>Total de la compra:</strong> $${total}</p>
          <p>Atentamente,</p>
          <p>Tu equipo de soporte</p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(
        `Correo enviado a ${email} sobre la compra con ticket ${ticketId}`
      );
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw new Error("Error al enviar correo electrónico");
    }
  }
}

module.exports = EmailManager;
