const express = require("express");
const { PORT, SERVER_TIMESTAMP } = require("./config/configs");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const healthRoute = require("./routes/healthRoutes");
const authRouter = require("./routes/authRoutes");
const { verifyPasswordHash } = require("./utils/passwordHasher");

// middlewares
app.use(cors({}));
app.use(bodyParser.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/health", healthRoute);
app.use("/api/v1/auth", authRouter);

// global catches
// Catch-all middleware for unmatched routes
app.use((req, res, next) => {
    res.status(404).json({
        status: "INVALID_ROUTE",
        message: null,
        error: `Endpoint not found: ${req.path}`,
        timestamp: SERVER_TIMESTAMP,
    });
});

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: "ERROR",
        message: null,
        error: err.message,
        timestamp: SERVER_TIMESTAMP
    })
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
});