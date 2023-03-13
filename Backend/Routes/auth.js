const { Router, json } = require("express");
const express = require("express");
const User = require("../Models/User");
const router = express.Router();
// Validator from express
const { body, validationResult } = require("express-validator");
//Bcryptjs import for password salt hash
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "HUHUHUH";
//Middleware import 
const fetchUser = require("../middleware/fetchUser")
// Create a user using /api/auth

//CREATE USER ROUTE

router.post(
  "/createUser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res.status(400).json({ success,  error: " bosdike new id likh" });
      }

      //SALT HASHING

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //cREATE USER

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true
      res.json({  success, authToken });

      // res.json(user)
    } catch (error) {
      console.log("nalla coder ");
      res.status(500).send("Kuch toh garbad hai daya");
    }
  }
);

//Login endpoint

router.post(
  "/loginUser",
  [body("email").isEmail(), body("password").exists()],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(400).json({   error: "Credentials does not match" });
      }

      const bcryptCompare = await bcrypt.compare(password, user.password);
      if (!bcryptCompare) {
        success = false;
        return res.status(400).json({ error: "Credentials does not match" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success,  authToken });
    } catch (error) {
      console.log("Error in logging in ");
      res.status(500).send({error : "Some error occured while logging in"});
    }
  }
);

//ROUTE 3 : LOGGED IN USER INFORMATION AND USER DETAIL .....
router.post(
  "/getUser", fetchUser  ,
  async (req, res) => {
try {
  userId = req.user.id;
  const user = await User.findById(userId).select('-password')
  res.send(user);
} catch (error) {
  console.log("nalla coder ");
  res.status(500).send({error : " ja yar galat hai"})
}
  });

module.exports = router;
