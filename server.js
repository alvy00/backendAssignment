const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todosRoutes');
const authRoutes = require("./routes/authRoutes");
const { swaggerUi, swaggerSpec } = require("./swaggerDoc");
const { serve } = require('swagger-ui-express');

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;