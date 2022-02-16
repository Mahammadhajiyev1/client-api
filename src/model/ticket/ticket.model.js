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

const getTickets = (clientId) => {
  return new Promise((resolve, reject) => {
    if (!clientId) return false;
    try {
      TicketSchema.find({ clientId }, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};
const getTicketById = (_id, clientId) => {
  return new Promise((resolve, reject) => {
    if (!clientId && !_id) return false;
    try {
      TicketSchema.find({ _id, clientId }, (error, data) => {
        if (error) {
          reject(error);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  insertTicket,
  getTickets,
  getTicketById,
};