const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());


const loanRoutes = require("./routes/loans");
const analyticsRoutes = require("./routes/analytics");

app.use("/loans", loanRoutes);
app.use("/analytics", analyticsRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
