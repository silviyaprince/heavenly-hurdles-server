import express from "express";
const router = express.Router();
import { ObjectId } from 'mongodb';
import {
  getAllProducts,
  getProductById,
 updateProductById,
  addProducts,
  deleteProducts,
  
} from "../helpers.js";

const allCategories = [
  "Hiking&Trekking",
  "Camping",
  "Skiing&Snowboarding",
  "RockClimbing",
  "Fishing",
  "HorseRiding",
  "Fitness Cardio",
  "Body Building",
  "Kids Sports",
  "Yoga",
  "Swimming",
  "Sailing",
  "Surfing & Beach Sports",
  "Badminton",
  "Tennis",
  "Table tennis",
  "Squash",
  "Football",
  "Basketball",
  "Hockey",
  "Running",
  "Walking",
  "Cycling",
  "Cycle Servicing",
  "Skating",
  "Skateboarding",
  "Scooter",
  "Men Athleisure",
        "Men Cotton T-shirt",
        "Men Tank Tops",
        "Men Shirts",
        "Men Fleeces & Pullovers",
        "Men Shorts",
        "Men Track Pants & Joggers",
        "Men Trousers & Chinos",
        "Men Tights & Compression",
        "Men Sports Shoes",
        "Men Sandals",
        "Men Flip Flops & Aqua Shoes",
        "Men Running Shoes",
        "Men Football Boots",
        "Socks",
        "Men Raincoat & Ponchos",
        "Men Winter Jackets",
        "Men Sports Jackets",
        "Men Thermals", 
        "Men Brief Underwear",
        "Women T-shirts",
        "Women Tank Tops",
        "Wome Crop Tops",
        "Women Swim Costumes",
        "Women Raincoats",
        "Women Sports Shoes",
        "Women Flip Flops",
        "Women Walking Shoes",
        "Women Outdoor Shoes & Boots",
        "Socks",
        "Women Shorts",
        "Women Leggings",
        "Women Track Pants",
        "Women Trousers",
        "Women Skirts",
        "Women Raincoats",
        "Women Sweaters",
        "Women Winter Jackets",
        "Women Snow Jackets",
        "Sports Bra", "Women Thermal Innerwear"
];

allCategories.map((category) => {
  router.get(`/${encodeURIComponent(category)}`, async (req, res) => {
   
    console.log("Category param:", category);


    try {
      const { rating } = req.query;
      if (req.query.rating) {
        req.query.rating = +req.query.rating;
      }
      const product = await getAllProducts(category, req);

      res.send(product);
       console.log("Products found:", product.length);
    } catch (err) {
      console.log(err);
    }
  });
});



allCategories.map((category) => {
  router.post(`/${encodeURIComponent(category)}`, async (req, res) => {
    const newProduct = req.body;
    const result = await addProducts(category, newProduct);
    console.log(result)
    res.send(result);
  });
});

allCategories.map((category) => {
  
  router.get(`/${category}/:id`, async (req, res) => {
    const { id } = req.params;
    console.log(category,id)

    const product = await getProductById(category, id);
    console.log(product)
    res.send(product);
  });
});
// allCategories.forEach((category) => {
//   router.get(`/${category}/:id`, async (req, res) => {
//     const { id } = req.params;
// console.log(id)
//     try {
//       const product = await getProductById(category, id);
//       if (!product) {
//         return res.status(404).json({ error: "Product not found" });
//       }
//       res.json(product);
//     } catch (err) {
//       console.error("Error fetching product:", err);
//       res.status(500).json({ error: "Server error" });
//     }
//   });
// });

// allCategories.map((category)=>{
//   router.delete(`/${category}`,async(req,res)=>{

//     const product=await deleteProductById(category,id);
//     res.send(product)
//   })

// })

allCategories.map((category) => {
  router.delete(`/${category}/deleteMany`, async (req, res) => {
    try {
      const { ids } = req.body; // Get the array of IDs from the request body
      console.log("Received IDs to delete:", ids);
      // Delete many products from the database
      const result = await deleteProducts(category, ids);

      res
        .status(200)
        .json({ message: "Products deleted successfully", result });
    } catch (error) {
      console.error("Error deleting products:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});

// allCategories.map((category) => {
//   router.put(`/${category}/:id`, async (req, res) => {
//     const { id } = req.params;
//     const updateProduct = req.body;
//     const result = await updateProductById(category, id, updateProduct);
//     res.send(result);
//   });
// });



// PUT /products/:category/:id
allCategories.map((category) => {
  router.put(`/${encodeURIComponent(category)}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;

      console.log(`Updating product in category '${category}' with ID: ${id}`);
      const result = await updateProductById(category, id, updatedData);
console.log("put change",updatedData)
      if (!result) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product updated successfully", product: result });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
});



export const productsRouter = router;
