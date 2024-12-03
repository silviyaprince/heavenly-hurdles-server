
import {client} from "./index.js";
import bcrypt from "bcrypt";

// async function updateProductById(category, id, updateProduct) {
//     return await client.db("Inventory").collection(`${category}`).updateOne({ id: id }, { $set: updateProduct });
//   }
  
  // async function deleteProductById(category,id) {
  //   return await client.db("Inventory").collection(`${category}`).deleteOne({ id: id });
  // }
  
  async function deleteProducts(category, ids) {
    return await client.db("Inventory").collection(`${category}`).deleteMany({ id: { $in: ids } });
  }

  // async function updateProducts(category, bulkOperations) {
  //   return await client.db("Inventory").collection(`${category}`).bulkWrite(bulkOperations);
  // }

  async function getProductById(category, id) {
    return await client.db("Inventory").collection(`${category}`).findOne({ id: id });
  }
  
  async function addProducts(category, newProduct) {
    return await client.db("Inventory").collection(`${category}`).insertOne(newProduct);
  }
  
  async function getAllProducts(category, req) {
    return await client.db("Inventory").collection(`${category}`).find(req.query).toArray();
  }
  async function genPassword(password) {
    const salt=await bcrypt.genSalt(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    return hashedPassword
  }
  async function createUser(username,hashedPassword,email,country,street,city,state,postalCode) {
    return await client.db("Inventory").collection("users").insertOne({username:username,password:hashedPassword,email:email,country:country,street:street,state:state,city:city,postalCode:postalCode,role:"customer"});
  }
  async function getAllUser() {
    return await client.db("Inventory").collection("users").find().toArray();
  }
  async function getUserByEmail(email) {
    return await client.db("Inventory").collection("users").findOne({email:email});
  }
  


export {getAllProducts,getProductById,addProducts,genPassword,getUserByEmail,createUser,getAllUser,deleteProducts}  
//deleteProductById