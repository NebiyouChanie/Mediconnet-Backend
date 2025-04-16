const User = require("../models/User");
const Doctor = require("../models/Doctor");
const LabTechnician = require("../models/LabTechnician");
const Pharmacist = require("../models/Pharmacist");
const Receptionist = require("../models/Receptionist");
const Triage = require("../models/Triage");
const Patient = require("../models/Patient");

const bcrypt = require("bcrypt");

const addStaffAccount = async (req, res) => {
  try {
    const {
      role,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      password,
      email,
      contactNumber,
      address,
      hospitalID,
    } = req.body;

    const { role: staffRole } = req.user;

    if (!staffRole || staffRole !== "HospitalAdministrator") {
      return res
        .status(400)
        .json({ message: "Only hospital admins can add staff member" });
    }

    if (!role) {
      return res.status(400).json({ message: "Role is required." });
    }

    const lowerCaseRole = role.toLowerCase();

    const RoleModels = {
      doctor: Doctor,
      labtechnician: LabTechnician,
      pharmacist: Pharmacist,
      receptionist: Receptionist,
      triage: Triage,
    };

    if (!RoleModels[lowerCaseRole]) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    const existingStaff = await User.findOne({email:email})
    if (existingStaff) {
      return res.status(400).json({ message: "Staff Already Exist." });
    }
    // 🔐 Hash the password using bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const StaffModel = RoleModels[lowerCaseRole];
    const staff = new StaffModel({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      password: hashedPassword, 
      contactNumber,
      address,
      hospitalID,
      role,
      email,
    });

    await staff.save();

    res
      .status(201)
      .json({ message: "Staff account created successfully", staff });
  } catch (error) {
    console.error("Error in addStaffAccount:", error);
    res
      .status(500)
      .json({ message: "Error creating staff account", error: error.message });
  }
};



const getStaffAccounts = async (req, res) => {
  try {
    const staffs = await User.find();

    res.status(200).json(  staffs );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something Went Wrong"});
  }
};


const deleteStaffAccount = async (req, res) => {
  try {
    const { role: staffRole } = req.user;

    if (!staffRole || staffRole != "HospitalAdministrator") {
      return res
        .status(400)
        .json({ message: "Only hospital admins can add staff member" });
    }

    const { staffId } = req.params;
    const deletedUser = await User.findByIdAndDelete(staffId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting staff", error: error.message });
  }
};

const viewPatientsByHospital = async (req, res) => {
  try {
    const { role: staffRole } = req.user;

    if (!staffRole || staffRole != "HospitalAdministrator") {
      return res
        .status(400)
        .json({ message: "Only hospital admins can add staff member" });
    }

    const { hospitalID } = req.params;
    const patients = await Patient.find({ hospitalID });

    if (!patients.length) {
      return res
        .status(404)
        .json({ message: "No patients found for this hospital" });
    }

    res.status(200).json({ patients });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching patients", error: error.message });
  }
};

module.exports = {
  addStaffAccount,
  getStaffAccounts,
  deleteStaffAccount,
  viewPatientsByHospital,
};
