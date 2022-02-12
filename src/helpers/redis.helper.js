const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

const setJWT = async (key, value) => {
  // const client = redis.createClient(process.env.REDIS_URL);

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  await client.set(key, value);
};
const getJWT = async (key) => {
  // const client = redis.createClient(process.env.REDIS_URL);

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return await client.get(key);
};

const deleteJWT = async (key) => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return await client.del(key);
};

module.exports = {
  setJWT,
  getJWT,
  deleteJWT,
};
