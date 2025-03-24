const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todosRoutes');
const authRoutes = require("./routes/authRoutes");
const { swaggerUi, swaggerSpec } = require("./swaggerDoc");

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
