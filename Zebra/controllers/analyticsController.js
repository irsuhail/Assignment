const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const mongoose = require("mongoose");

// Total attendance count for each employee
exports.totalAttendance = async (req, res) => {
  try {
    const data = await Attendance.aggregate([
      { $match: { status: "Present" } },
      {
        $group: {
          _id: "$employeeId",
          presentCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" },
      {
        $project: {
          name: "$employee.name",
          department: "$employee.department",
          presentCount: 1
        }
      }
    ]);

    if (!data.length) return res.status(404).json({ message: "No data found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Attendance history of an employee
exports.attendanceHistory = async (req, res) => {
  try {
    const employeeId = req.params.id;
    const data = await Attendance.find({ employeeId }).sort({ date: -1 });

    if (!data.length) return res.status(404).json({ message: "No data found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Employees with > 95% attendance
exports.topAttendees = async (req, res) => {
  try {
    const totalDays = await Attendance.aggregate([
      {
        $group: {
          _id: "$date"
        }
      }
    ]);
    const total = totalDays.length;

    const data = await Attendance.aggregate([
      { $match: { status: "Present" } },
      {
        $group: {
          _id: "$employeeId",
          presentDays: { $sum: 1 }
        }
      },
      {
        $project: {
          presentDays: 1,
          attendancePercentage: {
            $multiply: [{ $divide: ["$presentDays", total] }, 100]
          }
        }
      },
      { $match: { attendancePercentage: { $gt: 95 } } },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" },
      {
        $project: {
          name: "$employee.name",
          attendancePercentage: 1
        }
      }
    ]);

    if (!data.length) return res.status(404).json({ message: "No data found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Absent more than 5 times in a month
exports.absentEmployees = async (req, res) => {
  try {
    const currentMonth = new Date().getMonth();

    const data = await Attendance.aggregate([
      {
        $project: {
          employeeId: 1,
          status: 1,
          month: { $month: "$date" }
        }
      },
      { $match: { status: "Absent", month: currentMonth + 1 } },
      {
        $group: {
          _id: "$employeeId",
          absentCount: { $sum: 1 }
        }
      },
      { $match: { absentCount: { $gt: 5 } } },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" },
      {
        $project: {
          name: "$employee.name",
          department: "$employee.department",
          absentCount: 1
        }
      }
    ]);

    if (!data.length) return res.status(404).json({ message: "No data found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Last 5 attendance records for all employees
exports.recentAttendance = async (req, res) => {
  try {
    const data = await Attendance.aggregate([
      {
        $sort: { date: -1 }
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" },
      {
        $project: {
          date: 1,
          status: 1,
          name: "$employee.name"
        }
      },
      { $limit: 5 }
    ]);

    if (!data.length) return res.status(404).json({ message: "No data found" });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
