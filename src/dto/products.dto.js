class ProductoDto {
  constructor(
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    status,
    thumbnails
  ) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.img = img;
    this.code = code;
    this.stock = stock;
    this.category = category;
    this.status = status;
    this.thumbnails = thumbnails;
    this.fullname = `${title} ${category}`;
  }
}
module.exports = ProductoDto;
