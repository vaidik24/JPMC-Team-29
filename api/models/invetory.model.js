import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
  sku_id: {
    type: String,
  },
  name: {
    type: String,
  },
  shape: {
    type: String,
  },
  color: {
    type: String,
  },
  description: {
    type: String,
  },
  image_url: {
    type: String,
  },
  category: {
    type: String,
  },
  quantity: {
    type: Number,
    default: 0
  },
  availability: {
    type: Boolean,
    default: false,
  }
});

const Inventory = mongoose.model('Inventory', InventorySchema);

export default Inventory;
