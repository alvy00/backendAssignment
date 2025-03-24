const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "ACS Backend API Assignment",
        version: "1.0.0",
        description: "With auth",
      },
      servers: [
        {
          url: "https://backendassignment-beta.vercel.app",
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
    apis: ["./api/routes/authRoutes.js","./api/routes/todosRoutes.js"],
  };
  

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
