import { z } from "zod";

import { WebhookTriggerEvents } from "@calcom/prisma/enums";

export const apiKeySchema = z.object({
  apiKey: z.string(),
});

export const paginationSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const eventTypeIdSchema = z.object({
  eventTypeId: z.string().optional(),
});

export const subscriptionAddSchema = z.object({
  subscriberUrl: z.string().url(),
  triggerEvent: z.nativeEnum(WebhookTriggerEvents),
});

export const subscriptionDeleteSchema = z.object({
  id: z.string(),
});

export const addSubscriptionSchema = z.object({
  subscriber_url: z.string().url(),
  trigger_event: z.nativeEnum(WebhookTriggerEvents),
});

export const deleteSubscriptionSchema = z.object({
  subscription_id: z.string(),
});
