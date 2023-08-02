import cluster from "cluster";
import { fastify, FastifyInstance, FastifyReply } from "fastify";
import { cpus } from "os";
import fastifyAutoload from "@fastify/autoload";
import path from "path";
import routesV1 from "./routes/v1";
import { ajvFilePlugin } from "@fastify/multipart";

let PORT: number = Number(process.env.PORT) || 8080;

const server: FastifyInstance = fastify({
  logger: true,
  ajv: {
    // Adds the file plugin to help @fastify/swagger schema generation
    plugins: [ajvFilePlugin],
  },
});

//Auto Loading Plugins in Fastify
server.register(fastifyAutoload, {
  dir: path.join(__dirname, "plugins"),
});

server.get("/", async (_: any, reply: FastifyReply) => {
  reply.code(200).send({
    message: "Server is Up and Working!",
  });
});

//Configuring Routes
server.register(routesV1);

export { server };

const numCPUs: number = cpus().length;

const appStart = async () => {
  try {
    await server.listen({ port: PORT, host: "0.0.0.0" });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

if (cluster.isPrimary) {
  server.log.info(`Primary process running on ID : ${process.pid}`);
  for (let index = 0; index < numCPUs; index++) {
    cluster.fork();
  }
  cluster.on("exit", (worker: any, code: number, signal: string) => {
    server.log.error(
      `Worker process ${worker.process.pid} exited with ${code} : ${signal}`
    );
    cluster.fork();
  });
} else {
  appStart();
}
