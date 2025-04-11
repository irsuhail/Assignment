const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    const attendance = new Attendance({ employeeId, date, status });
    await attendance.save();

    res.status(200).json({ message: "Attendance recorded", attendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
