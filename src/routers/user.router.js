const { json } = require("body-parser");
const express = require("express");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const router = express.Router();
const { insertUser, getUserByEmail } = require("../model/user/User.model");

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" });
  next();
});

// Create user route

router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;

  try {
    //hash password
    const hashedPassword = await hashPassword(password);

    const newUserObject = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPassword,
    };

    const result = await insertUser(newUserObject);
    console.log(result);

    res.json({ message: "New user has been created", result });
  } catch (error) {
    // console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// User Sign in router

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid form submission!" });
  }
  // Get user email from db

  const user = await getUserByEmail(email);
  console.log(user);

  // Hash password and compare with db one
  const passwordFromDB = user && user._id ? user.password : null;
  if (!passwordFromDB) {
    return res.json({ status: "error", message: "Invalid email or password!" });
  }

  const result = await comparePassword(password, passwordFromDB);
  if (!result) {
    return res.json({ status: "error", message: "Invalid email or password!" });
  }
  const accessJWT = await createAccessJWT(user.email);

  const refreshJWT = await createRefreshJWT(user.email);

  console.log(result);

  res.json({ status: "success", message: "Login Succesfully!", accessJWT });
});

module.exports = router;
