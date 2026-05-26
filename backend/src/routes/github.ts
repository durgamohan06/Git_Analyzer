import { Router } from "express";
import { getGitHubUserController } from "../controllers/githubController.js";
import { compareGitHubUsersController } from "../controllers/githubCompareController.js";

export const githubRouter = Router();

githubRouter.get("/:username", getGitHubUserController);
githubRouter.get(
  "/compare/:username1/:username2",
  compareGitHubUsersController,
);
