const express = require("express");
const router = express.Router();
const authMiddleware = require('../authMiddleware');
router.get("/token",authMiddleware, (req, res) => {
    
    return res.status(200).json({
        msg: "modifier avec succes!",
      });
});

module.exports = router;
