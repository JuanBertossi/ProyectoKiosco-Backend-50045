class CartItemDTO {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }
}

class CartDTO {
  constructor(products) {
    this.products = products;
  }
}

module.exports = { CartItemDTO, CartDTO };
