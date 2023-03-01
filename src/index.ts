import cluster from "cluster";
import { fastify, FastifyReply } from "fastify";
import { cpus } from "os";
import fastifyAutoload from "@fastify/autoload";
import path from "path";
import { pinoLogger } from "./utils/logger";
import routesV1 from "./routes/v1";

let PORT: number = Number(process.env.PORT) || 8080;

const server: any = fastify({
  logger: pinoLogger,
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

const numCPUs: number = cpus().length;

const appStart = async () => {
  try {
    await server.listen({ port: PORT });
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

if (cluster.isPrimary) {
  pinoLogger.info(`Primary process running on ID : ${process.pid}`);
  for (let index = 0; index < numCPUs; index++) {
    cluster.fork();
  }
  cluster.on("exit", (worker: any, code: number, signal: string) => {
    pinoLogger.error(
      `Worker process ${worker.process.pid} exited with ${code} : ${signal}`
    );
    cluster.fork();
  });
} else {
  appStart();
}
