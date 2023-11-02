const express = require("express");
const { getUssd, postUssd } = require("../Controllers/ussdController");
const router = express.Router();

router.get("/ussd", getUssd);
router.post("/ussd", postUssd);
module.exports = router;
