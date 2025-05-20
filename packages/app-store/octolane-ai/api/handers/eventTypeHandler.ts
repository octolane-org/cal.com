import type { NextApiRequest, NextApiResponse } from "next";

import findValidApiKey from "@calcom/features/ee/api-keys/lib/findValidApiKey";
import { defaultHandler } from "@calcom/lib/server/defaultHandler";
import { defaultResponder } from "@calcom/lib/server/defaultResponder";
import { APP_NAME, HTTP_METHOD } from "@calcom/octolane-ai/constants";
import { STATUS_CODES } from "@calcom/octolane-ai/constants/status-codes";
import { getEventTypes } from "@calcom/octolane-ai/services/eventTypeService";
import { successResponse, errorResponse } from "@calcom/octolane-ai/utils/api-response";
import { paginationSchema } from "@calcom/octolane-ai/validators";

const querySchema = paginationSchema;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) {
      return errorResponse(res, "No API key provided", STATUS_CODES.UNAUTHORIZED);
    }

    const validKey = await findValidApiKey(apiKey, APP_NAME);
    if (!validKey) {
      return errorResponse(res, "API key not valid", STATUS_CODES.UNAUTHORIZED);
    }

    const query = querySchema.parse(req.query);
    const result = await getEventTypes(validKey.userId.toString(), { ...query, apiKey });

    return successResponse(
      res,
      result.data as unknown as Record<string, unknown>,
      result.pagination,
      "Event types retrieved successfully"
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Unable to fetch event types", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

export default defaultHandler({
  [HTTP_METHOD.GET]: Promise.resolve({ default: defaultResponder(handler) }),
});
