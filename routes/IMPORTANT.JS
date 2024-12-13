allCategories.map((category) => {
    router.put(`${category}/bulkupdate`, async (req, res) => {
      const { ids, updateFields } = req.body;
    
      if (!ids || ids.length === 0) {
        return res.status(400).json({ error: 'No product IDs provided for bulk update.' });
      }
    
      try {
        // Update the products with the provided fields
        const result = await client.db("Inventory").collection(`${category}`).updateMany(
          { _id: { $in: ids } },
          { $set: updateFields }
        );
    
        if (result.modifiedCount > 0) {
          res.json({ message: 'Bulk update successful', modifiedCount: result.modifiedCount });
        } else {
          res.status(404).json({ error: 'No products were updated.' });
        }
      } catch (error) {
        console.error('Error in bulk update:', error);
        res.status(500).json({ error: 'An error occurred during the bulk update.' });
      }
    });
    
  });