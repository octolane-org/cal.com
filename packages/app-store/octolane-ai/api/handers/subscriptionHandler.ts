import type { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

import findValidApiKey from "@calcom/features/ee/api-keys/lib/findValidApiKey";
import { deleteSubscription } from "@calcom/features/webhooks/lib/scheduleTrigger";
import logger from "@calcom/lib/logger";
import { defaultHandler } from "@calcom/lib/server/defaultHandler";
import { defaultResponder } from "@calcom/lib/server/defaultResponder";
import { APP_NAME, HTTP_METHOD } from "@calcom/octolane-ai/constants";
import { STATUS_CODES } from "@calcom/octolane-ai/constants/status-codes";
import { successResponse, errorResponse } from "@calcom/octolane-ai/utils/api-response";
import { addSubscriptionSchema, deleteSubscriptionSchema } from "@calcom/octolane-ai/validators";
import { prisma } from "@calcom/prisma";
import type { WebhookTriggerEvents } from "@calcom/prisma/enums";

async function addHandler(req: NextApiRequest, res: NextApiResponse) {
  const log = logger.getSubLogger({ prefix: ["API[POST /subscriptions]"] });

  try {
    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) {
      return errorResponse(res, "No API key provided", STATUS_CODES.UNAUTHORIZED);
    }

    const validKey = await findValidApiKey(apiKey, APP_NAME);
    if (!validKey) {
      return errorResponse(res, "API key not valid", STATUS_CODES.UNAUTHORIZED);
    }

    const { subscriber_url, trigger_event } = addSubscriptionSchema.parse(req.body);

    const triggerEvents: WebhookTriggerEvents[] = Array.isArray(trigger_event)
      ? trigger_event
      : [trigger_event];

    const createSubscription = await prisma.webhook.create({
      data: {
        id: v4(),
        userId: validKey.userId,
        teamId: validKey.teamId,
        eventTriggers: triggerEvents,
        subscriberUrl: subscriber_url,
        active: true,
        appId: APP_NAME,
      },
    });

    if (!createSubscription) {
      return errorResponse(res, "Could not create subscription", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    return successResponse(
      res,
      createSubscription,
      undefined,
      "Subscription created successfully",
      STATUS_CODES.CREATED
    );
  } catch (error) {
    log.error(error);
    return errorResponse(res, "Unable to create subscription", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

async function deleteHandler(req: NextApiRequest, res: NextApiResponse) {
  const log = logger.getSubLogger({ prefix: ["API[DELETE /subscriptions]"] });

  try {
    const apiKey = req.headers["x-api-key"] as string;
    if (!apiKey) {
      return errorResponse(res, "No API key provided", STATUS_CODES.UNAUTHORIZED);
    }

    const validKey = await findValidApiKey(apiKey, APP_NAME);
    if (!validKey) {
      return errorResponse(res, "API key not valid", STATUS_CODES.UNAUTHORIZED);
    }

    const { subscription_id } = deleteSubscriptionSchema.parse(req.body);

    const deleted = await deleteSubscription({
      appApiKey: validKey,
      webhookId: subscription_id,
      appId: APP_NAME,
    });

    if (!deleted) {
      return errorResponse(res, "Could not delete subscription", STATUS_CODES.INTERNAL_SERVER_ERROR);
    }

    return successResponse(res, null, undefined, "Subscription deleted successfully", STATUS_CODES.OK);
  } catch (error) {
    log.error(error);
    return errorResponse(res, "Unable to delete subscription", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
}

export default defaultHandler({
  [HTTP_METHOD.POST]: Promise.resolve({ default: defaultResponder(addHandler) }),
  [HTTP_METHOD.DELETE]: Promise.resolve({ default: defaultResponder(deleteHandler) }),
});
