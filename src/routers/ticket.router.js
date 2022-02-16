const express = require("express");
const { insertTicket } = require("../model/ticket/ticket.model");
const router = express.Router();

router.all("/", (req, res, next) => {
  // res.json({ message: "return from ticket router" });
  next();
});

/// Create ticket router
router.post("/", async (req, res) => {
  try {
    const { subject, sender, message } = req.body;

    const ticketObject = {
      clientId: "6202df62612aeea975b45dd4",
      subject,
      conversations: [
        {
          sender,
          message,
        },
      ],
    };

    const result = await insertTicket(ticketObject);

    if (result._id) {
      return res.json({
        status: "succes",
        message: "New ticket has been created",
      });
    }
    res.json({
      status: "error",
      message: "Unable to create ticket,please try again later",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
