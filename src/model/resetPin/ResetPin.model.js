const { reject } = require("bcrypt/promises");
const { response } = require("express");
const { randomPinNumber } = require("../../utils/randomGenerator");

const { ResetPinSchema } = require("./ResetPin.schema");

const setPasswordResetPin = async (email) => {
  const pinLength = 6;
  const randomPin = await randomPinNumber(pinLength);
  const resetObject = {
    email,
    pin: randomPin,
  };
  return new Promise((resolve, reject) => {
    ResetPinSchema(resetObject)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};
const getPinByEmailPin = (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findOne({ email, pin }, (error, data) => {
        if (error) {
          console.log(error);
          resolve(false);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

const deletePinByEmailPin = (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findOneAndDelete({ email, pin }, (error, data) => {
        if (error) {
          console.log(error);
          resolve(false);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};

module.exports = {
  setPasswordResetPin,
  getPinByEmailPin,
  deletePinByEmailPin,
};
