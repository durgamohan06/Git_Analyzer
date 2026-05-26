import type { RequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../errors/AppError.js";
import { getGitHubUserDashboard } from "../services/githubService.js";

const paramsSchema = z.object({
  username1: z
    .string()
    .trim()
    .min(1)
    .max(39)
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d]))*$/i),
  username2: z
    .string()
    .trim()
    .min(1)
    .max(39)
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d]))*$/i),
});

export const compareGitHubUsersController: RequestHandler = async (
  request,
  response,
  next,
) => {
  try {
    const { username1, username2 } = paramsSchema.parse(request.params);

    const [leftResult, rightResult] = await Promise.allSettled([
      getGitHubUserDashboard(username1),
      getGitHubUserDashboard(username2),
    ]);

    const left =
      leftResult.status === "fulfilled"
        ? { success: true, data: leftResult.value }
        : {
            success: false,
            error: (leftResult as PromiseRejectedResult).reason,
          };

    const right =
      rightResult.status === "fulfilled"
        ? { success: true, data: rightResult.value }
        : {
            success: false,
            error: (rightResult as PromiseRejectedResult).reason,
          };

    // Build simple comparison summary when both sides present
    const comparison = {
      bothAvailable: left.success && right.success,
    };

    response.status(200).json({ success: true, left, right, comparison });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(
        new AppError(
          400,
          "Invalid usernames",
          "INVALID_USERNAMES",
          error.issues,
        ),
      );
      return;
    }

    next(error);
  }
};
