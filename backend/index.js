const express = require("express");
const cors = require("cors");

const { listModels } = require("./src/listModels");
const authRoutes = require("./src/auth/routes");
const mapRoutes = require("./src/map/routes");
const predictionRoutes = require("./src/prediction/routes");
const userRoutes = require("./src/users/routes");
const dependentRoutes = require("./src/dependents/routes");
const reportRoutes = require("./src/reports/routes");
const sosRoutes = require("./src/sos/routes");
const jpsRoutes = require("./src/gov/jps/routes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/", (_, res) => res.json({ ok: true, service: "BanjirSense Backend" }));

app.use("/auth", authRoutes);

// feature routes
app.use(predictionRoutes);
app.use(userRoutes);
app.use(dependentRoutes);
app.use(mapRoutes);
app.use(reportRoutes);
app.use(sosRoutes);
app.use(jpsRoutes);

// Gemini models (debug)
app.get("/gemini-models", async (req, res) => {
  try {
    const data = await listModels();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = app;
exports.banjirsenseApi = app;