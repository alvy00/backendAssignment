const express = require('express');
const serverless = require('serverless-http');
const morgan = require('morgan');
const dotenv = require('dotenv');
const todoRoutes = require('./api/routes/todosRoutes');
const authRoutes = require("./api/routes/authRoutes");
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
    servers: [
      {
        url: "https://backendassignment-beta.vercel.app/",
        description: "My API Documentation",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  // This is to call all the file
  apis: ["./api/routes/authRoutes.js","./api/routes/todosRoutes.js"],
}};


// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);
app.use(
  "/api",
  swaggerUI.serve,
  swaggerUI.setup(specs, { customCssUrl: CSS_URL })
);


app.get('/', (req, res) => {
  res.send('Hello World from Vercel!');
});

// app.listen(port, (req, res) => {
//   console.log("Listening");
// })


module.exports = app;
module.exports.handler = serverless(app);
