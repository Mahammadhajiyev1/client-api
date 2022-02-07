require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 3001;

// API security
app.use(helmet());

// Handle cors error
app.use(cors());

// MongoDB connection

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  // useFindAndModify: false,
  useUnifiedTopology: true,
  // useCreateIndex: true,

  dbName: "CRM-ticket-system-backend",
});

if (process.env.NODE_ENV !== "production") {
  mongoose.connection.on("open", () => {
    console.log("MongoDB is connected");
  });
  mongoose.connection.on("error", (error) => {
    console.log(error);
  });

  // Logger
  app.use(morgan("tiny"));
}

// Set body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load routers

const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");
// Use Routers

app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

// Error handler
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
  const error = new Error("Resource in not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => console.log(`API is running on port: ${port}`));
