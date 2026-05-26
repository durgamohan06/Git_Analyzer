import { Router } from "express";
import { githubRouter } from "./github.js";
import { healthRouter } from "./health.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/github", githubRouter);
