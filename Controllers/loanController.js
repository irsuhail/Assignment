const Loan = require("../models/Loan");

exports.createLoan = async (req, res) => {
  try {
    const { bookId, borrowerId, loanDate, returnDate, status } = req.body;
    const loan = await Loan.create({ bookId, borrowerId, loanDate, returnDate, status });
    res.status(200).json(loan);
  } catch (error) {
    console.error("Loan creation error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
