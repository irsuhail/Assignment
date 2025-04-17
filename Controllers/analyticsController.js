const Loan = require("../models/Loan");
const Book = require("../models/Book");
const Borrower = require("../models/Borrower");

exports.getBorrowedBooksByBorrower = async (req, res) => {
  try {
    const data = await Loan.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book"
        }
      },
      {
        $lookup: {
          from: "borrowers",
          localField: "borrowerId",
          foreignField: "_id",
          as: "borrower"
        }
      },
      {
        $unwind: "$book"
      },
      {
        $unwind: "$borrower"
      },
      {
        $group: {
          _id: "$borrower._id",
          borrowerName: { $first: "$borrower.name" },
          borrowedBooks: { $push: "$book.title" }
        }
      }
    ]);

    if (data.length === 0) {
      return res.status(200).json({ message: "No data found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getTopBorrowedBooks = async (req, res) => {
  try {
    const data = await Loan.aggregate([
      {
        $group: {
          _id: "$bookId",
          borrowCount: { $sum: 1 }
        }
      },
      {
        $sort: { borrowCount: -1 }
      },
      {
        $limit: 3
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book"
        }
      },
      {
        $unwind: "$book"
      },
      {
        $project: {
          title: "$book.title",
          borrowCount: 1
        }
      }
    ]);

    if (data.length === 0) {
      return res.status(200).json({ message: "No data found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getBorrowerHistory = async (req, res) => {
  try {
    const borrowerId = req.params.id;

    const data = await Loan.aggregate([
      { $match: { borrowerId: require("mongoose").Types.ObjectId(borrowerId) } },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book"
        }
      },
      {
        $unwind: "$book"
      },
      {
        $project: {
          bookTitle: "$book.title",
          loanDate: 1,
          returnDate: 1,
          status: 1
        }
      }
    ]);

    if (data.length === 0) {
      return res.status(200).json({ message: "No data found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getFrequentBorrowers = async (req, res) => {
  try {
    const data = await Loan.aggregate([
      {
        $group: {
          _id: "$borrowerId",
          totalLoans: { $sum: 1 }
        }
      },
      {
        $match: { totalLoans: { $gt: 5 } }
      },
      {
        $lookup: {
          from: "borrowers",
          localField: "_id",
          foreignField: "_id",
          as: "borrower"
        }
      },
      {
        $unwind: "$borrower"
      },
      {
        $project: {
          name: "$borrower.name",
          totalLoans: 1
        }
      }
    ]);

    if (data.length === 0) {
      return res.status(200).json({ message: "No data found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.getLoanReports = async (req, res) => {
  try {
    const data = await Loan.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book"
        }
      },
      {
        $lookup: {
          from: "borrowers",
          localField: "borrowerId",
          foreignField: "_id",
          as: "borrower"
        }
      },
      { $unwind: "$book" },
      { $unwind: "$borrower" },
      {
        $project: {
          bookTitle: "$book.title",
          borrowerName: "$borrower.name",
          loanDate: 1,
          returnDate: 1,
          status: 1
        }
      }
    ]);

    if (data.length === 0) {
      return res.status(200).json({ message: "No data found" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
