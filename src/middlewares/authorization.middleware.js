const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;

  // 1. verify if jwt is valid

  const decoded = await verifyAccessJWT(authorization);
  console.log(decoded);

  if (decoded.email) {
    // 2. check if jwt exist in redis

    const userId = await getJWT(authorization);

    if (!userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.userId = userId;

    return next();
  }
  deleteJWT(authorization);

  res.status(403).json({ message: "Forbidden" });
};

module.exports = {
  userAuthorization,
};
