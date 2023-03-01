import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

const packageJson = require("../../package.json");

export default fp(async (fastify: FastifyInstance, _) => {
  fastify.register(require("@fastify/swagger"), {
    swagger: {
      info: {
        title: "Authorization Framework",
        description:
          "API's for authorization framework. It's a simple way to authenticate users.",
        version: packageJson.version,
      },
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    exposeRoute: true,
  });
  fastify.register(require("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header,
    transformSpecification: (swaggerObject: any, request: any, _: any) => {
      swaggerObject.host = request.hostname;
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
});
