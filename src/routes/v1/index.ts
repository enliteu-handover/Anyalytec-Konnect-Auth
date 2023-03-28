import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";
import { PRIVATE_FOLDER, PUBLIC_FOLDER } from "../../constants";

const routesLoader = (fastify: FastifyInstance, sourceDir: string) => {
  fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter((dirent: any) => dirent.isDirectory())
    .map((item: any) => item.name)
    .forEach(async (item: string) => {
      let route: any = await import(`${sourceDir}/${item}`);
      fastify.register(route.default, { prefix: `/api/v1/${item}` });
    });
};

const routes = (fastify: FastifyInstance, _: any, done: any) => {
  //Routes of Public API
  routesLoader(fastify, path.join(__dirname, PUBLIC_FOLDER));
  //Routes of Private API
  routesLoader(fastify, path.join(__dirname, PRIVATE_FOLDER));

  done();
};

export default routes;
