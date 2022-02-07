const express = require("express");
const hashPassword = require("../helpers/bcrypt.helper");
const router = express.Router();
const { insertUser } = require("../model/user/User.model");

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" });
  next();
});

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

module.exports = router;
