import express from "express";
const router=express.Router();
import { getAllProducts,getProductById,updateProductById,deleteProductById,addProducts } from "../helpers.js";

const allCategories=[ "Hiking&Trekking", "Camping","Skiing&Snowboarding", "RockClimbing","Fishing","HorseRiding","FitnessCardio","BodyBuilding","KidsSports", "Yoga","Swimming", "Sailing", "Surfing&BeachSports","Badminton", "Tennis", "Tabletennis", "Squash","Football", "Basketball", "Cricket", "Volleyball", "Hockey","Running", "Walking","Cycling", "CycleServicing","Skating", "Skateboarding", "Scooter"]

allCategories.map((category)=>{
  router.get(`/${category}`, async (req, res) => {
    try{
    const {  rating } = req.query;
    if (req.query.rating) {
      req.query.rating = +req.query.rating;
    }
    const product = await getAllProducts(category, req);
    
    res.send(product);
  }catch(err){
    console.log(err)
  }
  });
})

allCategories.map((category)=>{
  router.post(`/${category}`,async (req,res)=>{
    const newProduct=req.body
    const result=await addProducts(category, newProduct)
    res.send(result);
  })
})

allCategories.map((category)=>{
  router.get(`/${category}/:id`,async(req,res)=>{
    const {id}=req.params;
    const product=await getProductById(category, id)
    res.send(product);
  })
  
})

allCategories.map((category)=>{
  router.delete(`/${category}`,async(req,res)=>{
    
    const product=await deleteProduct(category);
    res.send(product)
  })
  
})

allCategories.map((category)=>{
  router.put(`/${category}/:id`,async(req,res)=>{
    const{id}=req.params;
    const updateProduct=req.body
    const result=await updateProductById(category, id, updateProduct);
    res.send(result)
  })
  
})

export const productsRouter=router