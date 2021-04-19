const express = require("express");
const cors = require("cors");
const ip = require("ip");
const db = require("./db/models");

const userRoutes = require("./routes/user");

const passport = require("passport");
const { localStrategy } = require("./middleware/passport");


const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(passport.initialize());
passport.use(localStrategy);

app.use("/user", userRoutes);
//path not found middleware
app.use((_, response, __) => {
  response.status(404).json({ message: "Path not found" });
});

//error handling middleware
app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.json({
    message: error.message || "Internal Server Error",
  });
});

const run = async () => {
  try {
    await db.sequelize.sync({ alter: true });
    console.log("Connection to the database successful!");
    await app.listen( process.env.PORT , () => { 
      console.log(
        `Express application running on ${ip.address()}:${process.env.PORT}`
      );
    });
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

run();
