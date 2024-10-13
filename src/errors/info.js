export const productErrorInfo = (product) => {
    return `Una o más propiedades están incompletas o no son válidas.
    Lista de propiedades requeridas:
    * title : Debe ser un string, se recibió: ${product.title}
    * description: Debe ser un string, se recibió: ${product.description}
    * code: Debe ser un string, se recibió: ${product.code}
    * stock: Debe ser un number, se recibió: ${product.stock}
    * price: Debe ser un number, se recibió: ${product.price}`
};