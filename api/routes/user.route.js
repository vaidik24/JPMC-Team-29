import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { verifyToken,verifySuperAdmin } from '../utils/verifyUser.js';
import User from '../models/user.model.js'; 
import multer from 'multer';
import bcrypt from 'bcryptjs';
const router = express.Router();

router.get('/', test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);


// New add to the code
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Route to get all subadmin for superadmin dashboar
router.get('/sub-admins', async (req, res) => {
  try {
    const admins = await User.find({ role: 'subadmin' });
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update admin user by superadmin
router.put('/admin/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAdmin = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Error updating admin', error: error.message });
  }
});

// Route to delete admin user by superadmin
router.delete('/admin/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Error deleting admin', error: error.message });
  }
});


// route to create subadmin by superadmin
router.post('/superadmin/create-subadmin', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new subadmin user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'subadmin', // Assign the subadmin role
    });

    // Save the new user
    await newUser.save();

    res.status(201).json({ message: 'Subadmin created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating subadmin:', error); // Log detailed error
    res.status(500).json({ message: 'Server error' }); // Send generic server error response
  }
});


//  route for getting all sellers by superadmin
router.get('/get-sellers', async (req, res) => {
  try {
    const seller = await User.find({ role: 'seller' });
    res.json(seller);
  } catch (error) {
    console.error('Error fetching seller', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update seller user by superadmin
router.put('/seller/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateSeller = await User.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updateSeller);
  } catch (error) {
    console.error('Error updating seller:', error);
    res.status(500).json({ message: 'Error updating seller', error: error.message });
  }
});


// route to create subadmin by superadmin
router.post('/superadmin/create-seller', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new subadmin user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'seller', // Assign the subadmin role
    });

    // Save the new user
    await newUser.save();

    res.status(201).json({ message: 'seller created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating seller:', error); // Log detailed error
    res.status(500).json({ message: 'Server error' }); // Send generic server error response
  }
});


// Route to delete seller user by superadmin
router.delete('/seller/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'seller deleted successfully' });
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ message: 'Error deleting seller', error: error.message });
  }
});

router.delete('/delete-subadmin/:user_id',  async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find the user by user_id and check if they are a subadmin
    const user = await User.findOne({ _id: user_id, role: 'admin' });

    if (!user) {
      return res.status(404).json({ message: 'Subadmin not found' });
    }

    // Delete the user
    await User.deleteOne({ _id: user._id });

    res.status(200).json({ message: 'Subadmin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});




export default router;
