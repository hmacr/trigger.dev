import { z } from "zod";

export const WebhookEventTypeSchema = z.enum([
  "deployment.created",
  "deployment.succeeded",
  "deployment.ready",
  "deployment.canceled",
  "deployment.error",
  "project.created",
  "project.removed",
  "integration-configuration.scope-change-confirmed",
  "integration-configuration.removed",
  "integration-configuration.permission-upgraded",
  "domain.created",
]);

export type WebhookEventType = z.infer<typeof WebhookEventTypeSchema>;
