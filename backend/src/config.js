require("dotenv").config();

const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "change-me-in-env",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  frontendUrls: (process.env.FRONTEND_URLS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
  businessStartHour: Number(process.env.BUSINESS_START_HOUR || 8),
  businessEndHour: Number(process.env.BUSINESS_END_HOUR || 18),
  slotStepMinutes: Number(process.env.SLOT_STEP_MINUTES || 30),
};

module.exports = config;
