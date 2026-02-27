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
const { jkmRoutes } = require("./src/gov/jkm/routes");

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://192.168.0.151:5173",
    ],
    credentials: true,
  })
);
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
app.use(jkmRoutes);


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