import { error } from "console";
import fs from "fs";

let products = [];
let pathFile = "./src/data/products.json";

const addProduct = async (product) => {
  const { title, description, price, thumbnail, code, stock, category } = product;
  await getProducts();
  const newProduct = {
    id: products.length + 1,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
    status: true
  };

  // Verificar que todos los campos obligatorios estén presentes
  if (!title || !description || !price || !code || !stock || !category) {
    throw Error("Todos los campos son obligatorios, excepto 'thumbnail'");
  }

  // Verificar que el codigo del nuevo producto no exista en la base
  const productExists = products.find((product) => product.code === code);
  if (productExists) {
    throw Error(`El producto con el código ${code} ya existe`);
  }

  products.push(newProduct);

  await fs.promises.writeFile(pathFile, JSON.stringify(products));
};

const getProducts = async (limit) => {
  const productsJson = await fs.promises.readFile(pathFile, "utf8");
  products = JSON.parse(productsJson) || [];

  if (!limit) return products;

  return products.slice(0, limit);
};

const getProductById = async (id) => {
  await getProducts();
  const product = products.find((product) => product.id === id);
  if (!product) {
    throw Error(`No se encontró el producto con el id ${id}`);
  }

  console.log(product);
  return product;
};


const updateProduct = async (id, dataProduct) => {
  await getProducts();
  const index = products.findIndex((product) => product.id === id);

  // verifico que el id exista
  if (index === -1) {
    throw Error(`No se encontró el producto con el id ${id}`);
  }

  // Si se envia codigo verifico que no exista en la base
  if (dataProduct.code) {
    const productExists = products.find((product) => product.code === dataProduct.code);
    if (productExists) {
      throw Error(`El producto con el código ${dataProduct.code} ya existe`);
    }
  }

  // Conservar los campos que no están presentes en dataProduct
  const updatedProduct = {
    id: products[index].id,
    title: dataProduct.title || products[index].title,
    description: dataProduct.description || products[index].description,
    price: dataProduct.price || products[index].price,
    thumbnail: dataProduct.thumbnail || products[index].thumbnail,
    code: dataProduct.code || products[index].code,
    stock: dataProduct.stock || products[index].stock,
    category: dataProduct.category || products[index].category,
    status: dataProduct.status || products[index].status
  };

  // Reemplazar el producto en la posición index con el producto actualizado
  products[index] = updatedProduct;

  /* products[index] = {
      ...products[index],
      ...dataProduct,
    }; */

  await fs.promises.writeFile(pathFile, JSON.stringify(products));
};


const deleteProduct = async (id) => {
  await getProducts();
  products = products.filter((product) => product.id !== id);
  await fs.promises.writeFile(pathFile, JSON.stringify(products));
};


export default {
  addProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
};
