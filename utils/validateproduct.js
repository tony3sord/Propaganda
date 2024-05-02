import Products from "../models/products.js";

const validate = async (name, shop) => {
  const validar = await Products.findOne({ name, shop });
  if (validar) return validar;
  return false;
};

export default validate;
