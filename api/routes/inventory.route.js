import express from 'express';
import Inventory from '../models/invetory.model.js'; // Ensure correct path to your model

const router = express.Router();

router.get('/get-inventory', async (req, res) => {
  try {
    const products = await Inventory.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory products', error });
  }
});

router.put('/:sku_id/put-availability', async (req, res) => {
  const { sku_id } = req.params;
  const { availability } = req.body;

  try {
    const product = await Inventory.findOneAndUpdate(
      { sku_id },
      { availability },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product availability updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product availability', error });
  }
});

// edit inventory product details
router.put('/:sku_id', async (req, res) => {
  const { sku_id } = req.params;
  const { name, description, quantity } = req.body;

  try {
    const product = await Inventory.findOneAndUpdate(
      { sku_id },
      { name, description, quantity },
      { new: true }
    );
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

router.get('/available-products', async (req, res) => {
  try {
    const products = await Inventory.find({ availability: true });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching available products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
