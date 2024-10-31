import express from "express";
const router=express.Router();
//deleteProductById,
import { getAllProducts,getProductById,updateProductById,addProducts ,deleteProducts} from "../helpers.js";

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

// allCategories.map((category)=>{
//   router.delete(`/${category}`,async(req,res)=>{
    
//     const product=await deleteProductById(category,id);
//     res.send(product)
//   })
  
// })

allCategories.map((category)=>{
  router.delete(`/${category}/deleteMany`, async (req, res) => {
    try {
      const { ids } = req.body; // Get the array of IDs from the request body
      console.log('Received IDs to delete:', ids);
      // Delete many products from the database
      const result = await deleteProducts(category, ids);
  
      res.status(200).json({ message: 'Products deleted successfully', result });
    } catch (error) {
      console.error("Error deleting products:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
})


allCategories.map((category)=>{
  router.put(`/${category}/:id`,async(req,res)=>{
    const{id}=req.params;
    const updateProduct=req.body
    const result=await updateProductById(category, id, updateProduct);
    res.send(result)
  })
  
})

allCategories.map((category)=>{
  router.put(`${category}/updateMany`, async (req, res) => {
    const updates = req.body; // Array of updates
    console.log(updates)
    try {
      const bulkOperations = await updates.map(update => ({
        updateOne: {
          filter: { id: update.id },
          update: { $set: update.data }
        }
      }));
  
      // Perform all updates in a single bulkWrite operation
      const result = await client.db("Inventory").collection(`${category}`).bulkWrite(bulkOperations);
      console.log('Bulk write result:', result);
      res.json(result); // Respond with the result
    } catch (error) {
      console.error('Error updating products:', error);
      res.status(500).send('Failed to update products');
    }
  });
})




export const productsRouter=router


