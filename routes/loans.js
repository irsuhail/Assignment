const express = require("express");
const router = express.Router();
const loanController = require("../controllers/loanController");


router.post("/", loanController.createLoan);

module.exports = router;
