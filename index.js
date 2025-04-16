const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const hospitalAdminRoutes = require("./routes/hospitalAdminRoutes");
const triageRoutes = require("./routes/triageRoutes");
const labRoutes = require("./routes/labReqeustRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const systemAdminRoutes = require("./routes/systemAdminRoutes");
const receptionistRoutes = require("./routes/receptionistRoute");

const authRoute = require("./routes/authRoute");

const connectDB = require("./lib/db");

dotenv.config();
const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use("/api/hospital-admin", hospitalAdminRoutes);
app.use("/api/systemAdmin", systemAdminRoutes);
app.use("/api/reception", receptionistRoutes);
app.use("/api/triage", triageRoutes);
app.use("/api/lab", labRoutes);
app.use("/api/prescription", prescriptionRoutes);
app.use("/api/auth", authRoute);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  connectDB();
});

