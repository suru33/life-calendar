import express from "express";
import { createServer as createViteServer } from "vite";

const main = async () => {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: "ssr" }
  });
  app.use(vite.middlewares);
  app.use("*", async (req: Request, res: Response) => {
    console.log(req);
    console.log(res);
  });

  app.listen(9000);
};

main();
