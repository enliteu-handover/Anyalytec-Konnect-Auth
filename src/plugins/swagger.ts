import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import swagger, { SwaggerOptions } from "@fastify/swagger";
import fastifySwaggerUi, { FastifySwaggerUiOptions } from "@fastify/swagger-ui";

const packageJson = require("../../package.json");

const swaggerPlugin: FastifyPluginAsync<SwaggerOptions> = async (
  fastify: any,
  _
) => {
  fastify.register(swagger, {
    swagger: {
      info: {
        title: "Authorization Framework",
        description:
          "API's for authorization framework. It's a simple way to authenticate users.",
        version: packageJson.version,
      },
      schemes: ["http", "https"],
      consumes: ["multipart/form-data", "application/json"],
      produces: ["application/json"],
      securityDefinitions: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
    },
    hideUntagged: true,
    exposeRoute: true,
  } as SwaggerOptions);
  fastify.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header,
    transformSpecification: (swaggerObject: any, request: any) => {
      swaggerObject.host = request.hostname;
      return swaggerObject;
    },
    transformSpecificationClone: true,
  } as FastifySwaggerUiOptions);
};

export default fp(swaggerPlugin);
