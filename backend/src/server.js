const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("./config");
const authRoutes = require("./routes/authRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const agentRoutes = require("./routes/agentRoutes");
const userRoutes = require("./routes/userRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const { createRateLimiter } = require("./middleware/rateLimit");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
const allowedOrigins = new Set([
  config.frontendUrl,
  ...config.frontendUrls,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://10.10.0.138:5173",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const authRateLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 30 });
app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/agent-requests", createRateLimiter({ windowMs: 10 * 60 * 1000, max: 60 }), agentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/feedback", createRateLimiter({ windowMs: 10 * 60 * 1000, max: 40 }), feedbackRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
