const express = require("express");
const router = express.Router();
const {
  addStaffAccount,
  getStaffAccounts,
  deleteStaffAccount,
  viewPatientsByHospital,
} = require("../controllers/hospitalAdminController");
const authMiddleware = require("../middleware/authmiddleware");

router.get("/staff", authMiddleware, getStaffAccounts);
router.post("/add-staff", authMiddleware, addStaffAccount);
router.delete("/staff/:staffId", authMiddleware, deleteStaffAccount);

router.get("/patients/:hospitalID", authMiddleware, viewPatientsByHospital);

module.exports = router;
