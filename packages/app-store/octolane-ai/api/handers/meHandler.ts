import type { NextApiRequest, NextApiResponse } from "next";

import findValidApiKey from "@calcom/features/ee/api-keys/lib/findValidApiKey";
import logger from "@calcom/lib/logger";
import { defaultHandler } from "@calcom/lib/server/defaultHandler";
import { defaultResponder } from "@calcom/lib/server/defaultResponder";
import { APP_NAME, HTTP_METHOD } from "@calcom/octolane-ai/constants";
import { STATUS_CODES } from "@calcom/octolane-ai/constants/status-codes";
import { successResponse, errorResponse } from "@calcom/octolane-ai/utils/api-response";
import prisma from "@calcom/prisma";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const log = logger.getSubLogger({ prefix: ["API[/me]"] });

  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) {
    return errorResponse(res, "No API key provided", STATUS_CODES.UNAUTHORIZED);
  }

  const validKey = await findValidApiKey(apiKey, APP_NAME);
  if (!validKey) {
    return errorResponse(res, "API key not valid", STATUS_CODES.UNAUTHORIZED);
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: validKey.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return errorResponse(res, "User not found", STATUS_CODES.NOT_FOUND);
    }

    return successResponse(res, user, undefined, "User retrieved successfully");
  } catch (error) {
    log.error(error);
    return errorResponse(res, "Unable to get user", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

export default defaultHandler({
  [HTTP_METHOD.GET]: Promise.resolve({ default: defaultResponder(handler) }),
});
