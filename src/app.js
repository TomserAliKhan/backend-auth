const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
res.send("Welcome to the E-commerce API");

})
  


// USER
const userRoutes = require("./routes/user.routes");
app.use("/api/user", userRoutes);


app.use((err, req, res, next) => {
  console.log("ERROR 👉", err); // 👈 VERY IMPORTANT

  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
});
module.exports = app;
