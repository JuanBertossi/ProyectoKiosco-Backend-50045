const { faker } = require("@faker-js/faker");

// Función para generar un producto ficticio
const generarProducto = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: faker.commerce.price(),
    img: faker.image.url(),
    code: faker.string.uuid(),
    stock: faker.number.int({ min: 0, max: 100 }),
    category: faker.commerce.department(),
    status: faker.datatype.boolean(),
    thumbnails: [faker.image.url()],
  };
};

// Controlador para generar y entregar productos ficticios
class MockingProductsController {
  async generateMockProducts(req, res) {
    try {
      // Generar 100 productos ficticios
      const mockProducts = [];
      for (let i = 0; i < 100; i++) {
        const mockProduct = generarProducto();
        mockProducts.push(mockProduct);
      }

      // Devolver los productos ficticios en la respuesta
      res.json({
        status: "success",
        message: "Mock products generated",
        products: mockProducts,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
}

module.exports = new MockingProductsController();
