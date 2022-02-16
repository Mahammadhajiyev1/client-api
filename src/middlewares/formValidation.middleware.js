const Joi = require("joi");

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net"] },
});

const pin = Joi.string().min(6).max(6).required();

const newPassword = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
  .required();

const shortString = Joi.string().min(2).max(50);
const longString = Joi.string().min(6).max(1000);

const resetPasswordRequestValidation = (req, res, next) => {
  const schema = Joi.object({ email });
  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};
const updatePasswordRequestValidation = (req, res, next) => {
  const schema = Joi.object({ email, pin, newPassword });
  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

const createNewTicketValidation = (req, res, next) => {
  const schema = Joi.object({
    subject: shortString.required(),
    sender: shortString.required(),
    message: longString.required(),
  });
  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }

  next();
};
const replyTicketMessageValidation = (req, res, next) => {
  const schema = Joi.object({
    sender: shortString.required(),
    message: longString.required(),
  });
  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }

  next();
};

module.exports = {
  resetPasswordRequestValidation,
  updatePasswordRequestValidation,
  createNewTicketValidation,
  replyTicketMessageValidation,
};
