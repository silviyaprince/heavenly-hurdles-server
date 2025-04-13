
import {client} from "./index.js";
import bcrypt from "bcrypt";
import { ObjectId } from 'mongodb';


async function updateProductById(category, id, updateProduct) {
    return await client.db("Inventory").collection(`${category}`).updateOne({ id: id }, { $set: updateProduct });
  }
  
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
    return await client.db("Inventory").collection(`${category}`).findOne({ id: parseInt(id) });
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
  async function createUser(username,hashedPassword,email,country,street,city,state,postalCode,phonenumber) {
    return await client.db("Inventory").collection("users").insertOne({username:username,password:hashedPassword,email:email,country:country,street:street,state:state,city:city,postalCode:postalCode,phonenumber:phonenumber,role:"customer"});
  }
  async function getAllUser() {
    return await client.db("Inventory").collection("users").find().toArray();
  }
  async function getUserByEmail(email) {
    return await client.db("Inventory").collection("users").findOne({email:email});
  }
  
async function getUserDetail(req){
  return await client.db("Inventory").collection("users").findOne({user:req.user._id});
  }
  

  
 async  function getUserById(id){
  return await client.db("Inventory").collection("users").findOne({ _id: new ObjectId(id)})
  
}
const generateToken=(id)=>{
  return jsonwebtoken.sign({id},process.env.SECRET_KEY)
}




async function insertOrder(order) {
  await client.db("Inventory").collection("orders").insertOne(order);
}

async function getOrders() {
  return await client.db("Inventory").collection("orders").find().toArray();
}

async function deleteOrderById(orderId) {
  return await client.db("Inventory").collection("orders").deleteOne({ orderId }); // or {_id: orderId} if you use MongoDB ObjectIds
}

export {updateProductById,getOrders,insertOrder,generateToken,getUserById,getUserDetail,getAllProducts,getProductById,addProducts,genPassword,getUserByEmail,createUser,getAllUser,deleteProducts,deleteOrderById}  
//deleteProductById