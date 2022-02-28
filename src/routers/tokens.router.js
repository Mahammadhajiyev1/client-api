const express = require("express");
const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.helper");
const { getUserByEmail } = require("../model/user/User.model");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const { authorization } = req.headers;
  const decoded = await verifyRefreshJWT(authorization);
  if (decoded.email) {
    const userProfile = await getUserByEmail(decoded.email);
    if (userProfile._id) {
      let tokenExp = userProfile.refreshJWT.addedAt;
      const dataBaseRefreshToken = userProfile.refreshJWT.token;
      tokenExp = tokenExp.setDate(
        tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
      );
      const today = new Date();
      if (dataBaseRefreshToken !== authorization && tokenExp < today) {
        return res.status(403).json({ message: "Forbidden" });
      }
      const accessJWT = await createAccessJWT(
        decoded.email,
        userProfile._id.toString()
      );

      // Delete old token from redis database

      return res.json({ status: "success", accessJWT });
    }
  }
  res.status(403).json({ message: "Forbidden" });
});

module.exports = router;
