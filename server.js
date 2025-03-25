const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require("cors");
const todoRoutes = require('./api/routes/todosRoutes');
const authRoutes = require("./api/routes/authRoutes");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.3.0/swagger-ui.min.css";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ACS Backend API Assignment",
      version: "1.0.0",
      description: "With user authentication",
    },
    servers: [
      {
        url: "https://backendassignment-beta.vercel.app/",
        description: "My API Documentation",
      },
    ],
  },
  apis: ["./api/routes/authRoutes.js","./api/routes/todosRoutes.js"],
};

const specs = swaggerJsDoc(options);

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use(
  "/api",
  swaggerUI.serve,
  swaggerUI.setup(specs, { customCssUrl: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }', CSS_URL })
);


app.get('/', (req, res) => {
  res.send('Hello World from Vercel!');
});

app.listen(port, (req, res) => {
  console.log("Listening");
})


module.exports = app;
module.exports.handler = serverless(app);
