const router = require('express').Router()
const User = require('../model/user.model')
const {isAdmin} = require("../middleware/AdminAuth");
const authenticateUser = require('../middleware/authenticateuser');

router.get('/users',authenticateUser ,isAdmin, async (req, res) => {
    try {
      const users = await User.find().select('-password');
      if(users.length === 0 ){
        res.status(404).json({error:"User is not found!"})
      }
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

//get only one user
router.get('/user/:id',async (req,res)=>{
  try {
    const {id} = req.params;
    const user = await User.findOne({_id:id});
    if(user){
      res.status(200).json(user)
    }else{
      res.status(404).json({error:"No user"})
    }

  } catch (error) {
    res.status(500).json({ error: 'Get user failed' });
  }
})

router.put('/edit/:id',authenticateUser, isAdmin, async (req, res) => {
    try {
      const { role,email,username } = req.body;

      const user = await User.findByIdAndUpdate(req.params.id, { username, email, role }, { new: true });
      console.log(role)

      if(user){
        res.json( user);
      }else {
        res.status(404).json({error:"No user"})
      }
    } catch (error) {
      res.status(500).json({ error: 'Update failed' });
    }
  });

  router.delete('/delete/:id', authenticateUser, isAdmin, async (req, res) => {
    try {
      const userToDelete = await User.findById(req.params.id);
      if (!userToDelete) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Prevent deleting other admins, but allow self-deletion
      if (userToDelete.role === "admin" && req.user.id !== req.params.id) {
        return res.status(403).json({ error: "You cannot delete another admin!" });
      }
  
      // Soft delete: Set the deleted flag to true
      userToDelete.deleted = true;
      await userToDelete.save();
  
      if (req.user.id === req.params.id) {
        return res.json({ message: "User deleted successfully. Logout required.", selfDeleted: true });
      }
  
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Deletion failed" });
    }
  });
  
  
  
  module.exports = router;
