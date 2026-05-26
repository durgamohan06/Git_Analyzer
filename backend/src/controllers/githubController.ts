import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { getGitHubUserDashboard } from "../services/githubService.js";

const paramsSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(39, "Username is too long")
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d]))*$/i, "Invalid GitHub username"),
});

export const getGitHubUserController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { username } = paramsSchema.parse(request.params);
    const data = await getGitHubUserDashboard(username);

    response.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(
          400,
          "Invalid GitHub username",
          "INVALID_USERNAME",
          error.issues,
        ),
      );
      return;
    }

    next(error);
  }
};
