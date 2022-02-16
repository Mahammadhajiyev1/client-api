const { TicketSchema } = require("./ticket.schema");

const insertTicket = (ticketObeject) => {
  return new Promise((resolve, reject) => {
    try {
      TicketSchema(ticketObeject)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertTicket,
};
