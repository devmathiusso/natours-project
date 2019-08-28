const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", err => {
  console.log("Uncaught exception 😢 ! Shutting down...");
  console.log(err.name, ":", err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB Connection Successful!"));

const port = process.env.PORT || 3003;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", err => {
  console.log("Unhandled rejection 😢 ! Shutting down...");
  console.log(err.name, ":", err.message);
  server.close(() => {
    process.exit(1);
  });
});
