const express = require("express");
const router = express.Router();
const {
  totalAttendance,
  attendanceHistory,
  topAttendees,
  absentEmployees,
  recentAttendance
} = require("../controllers/analyticsController");

router.get("/total-attendance", totalAttendance);
router.get("/attendance-history/:id", attendanceHistory);
router.get("/top-attendees", topAttendees);
router.get("/absent-employees", absentEmployees);
router.get("/recent-attendance", recentAttendance);

module.exports = router;
