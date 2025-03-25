const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const dotenv = require('dotenv');
const todoRoutes = require('./api/routes/todosRoutes');
const authRoutes = require("./api/routes/authRoutes");
const { swaggerUi, swaggerSpec } = require("./swaggerDoc");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
const specs = swaggerJsDoc(options);

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use("/api", swaggerUi.serve, swaggerUi.setup(specs, { customCssUrl: CSS_URL }));


app.get('/', (req, res) => {
  res.send('Hello World from Vercel!');
});

// app.listen(port, (req, res) => {
//   console.log("Listening");
// })


module.exports = app;
module.exports.handler = serverless(app);
