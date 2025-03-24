const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const dotenv = require('dotenv');
const todoRoutes = require('./api/routes/todosRoutes');
const authRoutes = require("./api/routes/authRoutes");
const { swaggerUi, swaggerSpec } = require("./api/swaggerDoc");

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Hello World from Vercel!');
});

// Export for Vercel (no app.listen)
module.exports = app;
module.exports.handler = serverless(app);
