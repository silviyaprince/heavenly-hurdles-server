
import {client} from "./index.js";
import bcrypt from "bcrypt";

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
  async function genPassword(password) {
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    return hashedPassword
  }
  async function createUser(username,hashedPassword) {
    return await client.db("Inventory").collection("users").insertOne({username:username,password:hashedPassword});
  }
  async function getAllUser() {
    return await client.db("Inventory").collection("users").find().toArray();
  }
  async function getUserByName(username) {
    return await client.db("Inventory").collection("users").findOne({username:username});
  }
  
export {getAllProducts,getProductById,updateProductById,deleteProductById,addProducts,genPassword,getUserByName,createUser,getAllUser}  