const { verifyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT } = require("../helpers/redis.helper");

const userAuthorisation = async (req, res, next) => {
  const { authorisation } = req.headers;

  // 1. verify if jwt is valid
  const decoded = await verifyAccessJWT(authorisation);

  if (decoded.email) {
    // 2. check if jwt exist in redis

    const userId = await getJWT(authorisation);

    if (!userId) {
      return res.status(403).json({ message: "Forbiden" });
    }
    req.userId = userId;

    return next();
  }

  res.status(403).json({ message: "Forbiden" });
};

module.exports = {
  userAuthorisation,
};
