const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

// import { createClient } from "redis";

// (async () => {
//   const client = createClient();

//   client.on("error", (err) => console.log("Redis Client Error", err));

//   await client.connect();

//   await client.set("key", "value");
//   const value = await client.get("key");
// })();

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

  await client.get(key);
};

module.exports = {
  setJWT,
  getJWT,
};
