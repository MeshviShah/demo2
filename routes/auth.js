const express = require('express');
const User = require('../models/User');
const router = express.Router();
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


const JWT_SECRET = 'mesh$oy';
// route 1: creat user using "api/auth/creatuser"
router.post('/creatuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


   
    res.json({ authtoken })

  }
    catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
})


router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
   
 
});

//delete
router.delete('/delete/:id',fetchuser , async(req,res) =>{
 
  try{

  let user = await  User.findById(req.params.id);
  if (!user) {
    return res.status(400).send("not found")}
  
  
  user =  await User.findByIdAndDelete(req.params.id)
  res.json({"sucess" : "deleted" ,user:user});
}
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//getusere
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
//update

router.put('/update/:id', fetchuser, async (req, res) => {
  const { name,email,secPass } = req.body;
  try {
      // Create a user object
      const newUser = {};
      if (name) { newUser.name = name };
      if (email) { newUser.email = email };
      if (secPass) { newUser.secPass = secPass };

      // Find the note to be updated and update it
      let user = await User.findById(req.params.id);
      if (!user) { return res.status(404).send("Not Found") }

     
      user = await User.findByIdAndUpdate(req.params.id, { $set: newUser }, { new: true })
      res.json({ user });
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})


module.exports = router