const { request } = require("express");
const e = require("express");
const express = require("express");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { emailProcessor } = require("../helpers/email.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const { deleteJWT } = require("../helpers/redis.helper");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const {
  resetPasswordRequestValidation,
  updatePasswordRequestValidation,
  newUserValidation,
} = require("../middlewares/formValidation.middleware");
const {
  setPasswordResetPin,
  getPinByEmailPin,
  deletePinByEmailPin,
} = require("../model/resetPin/ResetPin.model");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  storeUserRefreshJWT,
  verifyUser,
} = require("../model/user/User.model");

const verificationUrl = "http://localhost:3000/verification/";

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" });
  next();
});
// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  // this data going to be geted from database
  const _id = req.userId;
  // 3. extract user id
  const userProfile = await getUserById(_id);
  // 4. get user profile based on user id
  const { name, email } = userProfile;
  res.json({
    user: {
      _id,
      name,
      email,
    },
  });
});

// verify user after sign up
router.patch("/verify", async (req, res) => {
  try {
    const { _id, email } = req.body;
    const result = await verifyUser(_id, email);
    if (result && result._id) {
      return res.json({
        status: "success",
        message: "Your account has been approved, You can sign in now",
      });
    }
    return res.json({
      status: "error",
      message: "Invalid request",
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: "Invalid request",
    });
  }
});

// Create user route

router.post("/", newUserValidation, async (req, res) => {
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

    await emailProcessor({
      email,
      type: "new-user-confirmation",
      verificationLink: verificationUrl + result._id + "/" + email,
    });

    res.json({
      status: "success",
      message: "New user has been created",
      result,
    });
  } catch (error) {
    // console.log(error);
    let message =
      "Unable to create a new user at the moment. Please try again or contact with adminstration ";
    if (error.message.includes("duplicate key error collection")) {
      message = "This e-mail already has an account";
    }
    res.json({ status: "error", message });
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

  if (!user.isVerified) {
    return res.json({
      status: "error",
      message:
        "Your e-mail is not verified. Please check your e-mail to verify your account",
    });
  }

  // Hash password and compare with db one
  const passwordFromDB = user && user._id ? user.password : null;
  if (!passwordFromDB) {
    return res.json({ status: "error", message: "Invalid email or password!" });
  }

  const result = await comparePassword(password, passwordFromDB);
  if (!result) {
    return res.json({ status: "error", message: "Invalid email or password!" });
  }
  const accessJWT = await createAccessJWT(user.email, `${user._id}`);

  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.json({
    status: "success",
    message: "Login Successfully!",
    accessJWT,
    refreshJWT,
  });
});

router.post(
  "/reset-password",
  resetPasswordRequestValidation,
  async (req, res) => {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (user && user._id) {
      const setPin = await setPasswordResetPin(email);
      await emailProcessor({
        email,
        pin: setPin.pin,
        type: "request-new-password",
      });
    }
    res.json({
      status: "success",
      message:
        "If your email exist in database you will get 6 digit pin shortly by email",
    });
  }
);

router.patch(
  "/reset-password",
  updatePasswordRequestValidation,
  async (req, res) => {
    const { email, pin, newPassword } = req.body;
    const getPin = await getPinByEmailPin(email, pin);
    if (getPin?._id) {
      const dataBaseDate = getPin.addedAt;
      const expiresIn = 1;
      let expireDate = dataBaseDate.setDate(dataBaseDate.getDate() + expiresIn);
      const today = new Date();
      if (today > expireDate) {
        return res.json({
          status: "error",
          message: "Invalid pin or expired pin",
        });
      }
      const hashedPassword = await hashPassword(newPassword);

      const user = await updatePassword(email, hashedPassword);
      if (user._id) {
        await emailProcessor({ email, type: "password-update-success" });
        await deletePinByEmailPin(email, pin);

        return res.json({
          status: "success",
          message: "Your password has been updated",
        });
      }
    }
    res.json({
      status: "error",
      message: "Unable to update your password.Please try again later ",
    });
  }
);

// User logout and invalidate accessJWT

router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;

  const _id = req.userId;

  await deleteJWT(authorization);
  const result = await storeUserRefreshJWT(_id, "");
  if (result._id) {
    return res.json({ status: "success", message: "Logged out successfully" });
  }

  res.json({ status: "error", message: "Unable to log out " });
});

module.exports = router;
