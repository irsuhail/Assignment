const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const attendanceRoutes = require("./routes/attendanceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/attendance", attendanceRoutes);
app.use("/analytics", analyticsRoutes);

module.exports = app;
