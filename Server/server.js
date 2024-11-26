const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const initRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const app = express();
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      process.env.SUPERVISOR,
      process.env.CLIENT_MOBILE,
      process.env.CONNECTION_MOBILE,
    ],
    methods: ["POST", "PUT", "GET", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(cookieParser());
const port = process.env.PORT || 8888;

app.use(express.json()); // write data client rp server

app.use(express.urlencoded({ extended: true }));
dbConnect();
initRoutes(app);
app.use("/", (req, res) => {
  res.send("Server ON");
});

app.listen(port, () => {
  console.log("Server running on the port " + port);
});
