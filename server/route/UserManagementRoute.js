const router = require('express').Router()
const User = require('../model/user.model')
const {isAdmin} = require("../middleware/AdminAuth")

router.get('/users', isAdmin, async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

router.patch('/users/:id', isAdmin, async (req, res) => {
    try {
      const { role } = req.body;
      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ error: 'Update failed' });
    }
  });
 
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Deletion failed' });
    }
  });
  
  module.exports = router;
