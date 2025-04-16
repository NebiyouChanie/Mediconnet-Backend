const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [
        "Admin",
        "HospitalAdministrator",
        "Receptionist",
        "Doctor",
        "Triage",
        "LabTechnician",
        "Pharmacist",
      ],
      required: true,
    },
  },
  { discriminatorKey: "role" }
);
userSchema.index({ email: 1, role: 1 }, { unique: true });

// Check if the model has already been defined
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
