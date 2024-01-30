const products = require("../data/products");

exports.getAllProducts = (req, res) => {
  res.json(products);
};
