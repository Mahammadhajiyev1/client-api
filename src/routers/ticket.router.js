const express = require("express");
const {
  insertTicket,
  getTickets,
  getTicketById,
} = require("../model/ticket/ticket.model");
const router = express.Router();
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");

router.all("/", (req, res, next) => {
  // res.json({ message: "return from ticket router" });
  next();
});

/// Create ticket router
router.post("/", userAuthorization, async (req, res) => {
  try {
    const { subject, sender, message } = req.body;

    const userId = req.userId;

    const ticketObject = {
      clientId: userId,
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

/// Get all tickets for spesific user
router.get("/", userAuthorization, async (req, res) => {
  try {
    const clientId = req.userId;

    const result = await getTickets(clientId);

    return res.json({
      status: "succes",
      result,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

/// Get single ticket for spesific user
router.get("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params;
    const clientId = req.userId;

    const result = await getTicketById(_id, clientId);

    return res.json({
      status: "succes",
      result,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
