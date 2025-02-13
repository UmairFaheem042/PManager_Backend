const express = require("express");
const app = express();
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const domainRoutes = require("./routes/domain.routes");
const connectCloud = require("./config/cloudinary");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

connectDB();
connectCloud();


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/domains", domainRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
