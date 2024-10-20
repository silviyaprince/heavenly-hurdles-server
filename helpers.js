
import {client} from "./index.js";

async function updateProductById(category, id, updateProduct) {
    return await client.db("Inventory").collection(`${category}`).updateOne({ id: id }, { $set: updateProduct });
  }
  
  async function deleteProductById(category, id) {
    return await client.db("Inventory").collection(`${category}`).deleteOne({ id: id });
  }
  
  async function getProductById(category, id) {
    return await client.db("Inventory").collection(`${category}`).findOne({ id: id });
  }
  
  async function addProducts(category, newProduct) {
    return await client.db("Inventory").collection(`${category}`).insertMany(newProduct);
  }
  
  async function getAllProducts(category, req) {
    return await client.db("Inventory").collection(`${category}`).find(req.query).toArray();
  }
  
export {getAllProducts,getProductById,updateProductById,deleteProductById,addProducts}  