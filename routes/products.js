import express from "express";
const router = express.Router();
//deleteProductById,
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
  "FitnessCardio",
  "BodyBuilding",
  "KidsSports",
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
  "CycleServicing",
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
  router.get(`/${category}`, async (req, res) => {
    try {
      const { rating } = req.query;
      if (req.query.rating) {
        req.query.rating = +req.query.rating;
      }
      const product = await getAllProducts(category, req);

      res.send(product);
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

allCategories.map((category) => {
  router.put(`/${category}/:id`, async (req, res) => {
    const { id } = req.params;
    const updateProduct = req.body;
    const result = await updateProductById(category, id, updateProduct);
    res.send(result);
  });
});

// allCategories.map((category) => {
//   router.put(`${category}/bulkupdate`, async (req, res) => {
//     const { ids, updateFields } = req.body;
  
//     if (!ids || ids.length === 0) {
//       return res.status(400).json({ error: 'No product IDs provided for bulk update.' });
//     }
  
//     try {
//       // Update the products with the provided fields
//       const result = await client.db("Inventory").collection(`${category}`).updateMany(
//         { _id: { $in: ids } },
//         { $set: updateFields }
//       );
  
//       if (result.modifiedCount > 0) {
//         res.json({ message: 'Bulk update successful', modifiedCount: result.modifiedCount });
//       } else {
//         res.status(404).json({ error: 'No products were updated.' });
//       }
//     } catch (error) {
//       console.error('Error in bulk update:', error);
//       res.status(500).json({ error: 'An error occurred during the bulk update.' });
//     }
//   });
  
// });
allCategories.map((category) => {
router.put(`${category}/bulkupdate`, async (req, res) => {
  const { ids, updateFields } = req.body;
  console.log(`Bulk update endpoint hit for category: ${category}`);

  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'No product IDs provided for bulk update.' });
  }

  try {
    const operations = ids.map((id) => {
      const updates = updateFields[id];
      return client
        .db("Inventory")
        .collection(category)
        .updateOne(
          { _id: new ObjectId(id) },
          { $set: updates } // Individual updates for each product
        );
    });

    const results = await Promise.all(operations);
    const modifiedCount = results.reduce((count, result) => count + result.modifiedCount, 0);

    if (modifiedCount > 0) {
      res.json({ message: 'Bulk update successful', modifiedCount });
    } else {
      res.status(404).json({ error: 'No products were updated.' });
    }
  } catch (error) {
    console.error('Error in bulk update:', error);
    res.status(500).json({ error: 'An error occurred during the bulk update.' });
  }
});
})


export const productsRouter = router;
