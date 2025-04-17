const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.get("/borrowed-books", analyticsController.getBorrowedBooksByBorrower);
router.get("/top-borrowed-books", analyticsController.getTopBorrowedBooks);
router.get("/borrower-history/:id", analyticsController.getBorrowerHistory);
router.get("/frequent-borrowers", analyticsController.getFrequentBorrowers);
router.get("/loan-reports", analyticsController.getLoanReports);

module.exports = router;
