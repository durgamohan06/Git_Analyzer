import { Router } from "express";
import { getGitHubUserController } from "../controllers/githubController.js";

export const githubRouter = Router();

githubRouter.get("/:username", getGitHubUserController);
