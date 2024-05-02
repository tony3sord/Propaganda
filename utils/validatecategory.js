import Category from "../models/category.js";

const validate = async (name, shop) => {
  const validar = await Category.findOne({ name, shop });
  if (validar) return validar;
  return false;
};

export default validate;
