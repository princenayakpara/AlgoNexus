const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const uploadRoutes = require("./routes/uploadRoutes");
const backtestRoutes = require("./routes/backtestRoutes");
const strategyRoutes = require("./routes/strategyRoutes");
const healthRoutes = require("./routes/healthRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://algo-nexus-omega.vercel.app",
  process.env.FRONTEND_URL, // Allow custom frontend URL via env var
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan("combined"));

const authRoutes = require("./routes/authRoutes");
const { protect } = require("./middleware/authMiddleware");

// Core API routes
app.use("/api/auth", authRoutes);
app.use("/upload", protect, uploadRoutes);
app.use("/", backtestRoutes); // Backtest routes will handle their own protection
app.use("/", protect, strategyRoutes);
app.use("/", healthRoutes);

// Frontend is hosted separately on Vercel, so we don't serve static files here.
// Error handler (always active)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`AlgoNexus API listening on port ${PORT}`);
});

