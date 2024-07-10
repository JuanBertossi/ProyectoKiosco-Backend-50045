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
}

module.exports = EmailManager;
