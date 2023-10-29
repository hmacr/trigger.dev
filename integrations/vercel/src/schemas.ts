import { z } from "zod";
import { WebhookEventTypeSchema } from "./types";

type WebhookEventPayload<TWebhookEvent extends { payload: any }> = TWebhookEvent["payload"];

// Base
const WebhookEventBaseSchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  region: z.string().optional(),
});

// Deployment
const DeploymentPayloadBaseSchema = z.object({
  name: z.string(),
  plan: z.string(),
  url: z.string(),
  type: z.string(),
  target: z.union([z.literal("production"), z.literal("staging"), z.null()]),
  regions: z.array(z.string()),
  user: z.object({
    id: z.string(),
  }),
  team: z
    .object({
      id: z.string().optional(),
    })
    .optional(),
  project: z.object({
    id: z.string(),
  }),
  deployment: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    inspectorUrl: z.string(),
    meta: z.record(z.any()),
  }),
  links: z.object({
    deployment: z.string(),
    project: z.string(),
  }),
});

const DeploymentCreatedEventSchema = WebhookEventBaseSchema.extend({
  type: z.literal(WebhookEventTypeSchema.enum["deployment.created"]),
  payload: DeploymentPayloadBaseSchema.extend({
    alias: z.array(z.string()),
  }),
});

const DeploymentSucceededEventSchema = WebhookEventBaseSchema.extend({
  type: z.literal(WebhookEventTypeSchema.enum["deployment.succeeded"]),
  payload: DeploymentPayloadBaseSchema,
});

const DeploymentReadyEventSchema = WebhookEventBaseSchema.extend({
  type: z.literal(WebhookEventTypeSchema.enum["deployment.ready"]),
  payload: DeploymentPayloadBaseSchema,
});

const DeploymentCanceledEventSchema = WebhookEventBaseSchema.extend({
  type: z.literal(WebhookEventTypeSchema.enum["deployment.canceled"]),
  payload: DeploymentPayloadBaseSchema,
});

const DeploymentErrorEventSchema = WebhookEventBaseSchema.extend({
  type: z.literal(WebhookEventTypeSchema.enum["deployment.error"]),
  payload: DeploymentPayloadBaseSchema,
});

const DeploymentEventSchema = z.discriminatedUnion("type", [
  DeploymentCreatedEventSchema,
  DeploymentSucceededEventSchema,
  DeploymentReadyEventSchema,
  DeploymentCanceledEventSchema,
  DeploymentErrorEventSchema,
]);

export type DeploymentCreatedEventPayload = WebhookEventPayload<
  z.infer<typeof DeploymentCreatedEventSchema>
>;

export type DeploymentSucceededEventPayload = WebhookEventPayload<
  z.infer<typeof DeploymentSucceededEventSchema>
>;

export type DeploymentReadyEventPayload = WebhookEventPayload<
  z.infer<typeof DeploymentReadyEventSchema>
>;

export type DeploymentCanceledEventPayload = WebhookEventPayload<
  z.infer<typeof DeploymentCanceledEventSchema>
>;

export type DeploymentErrorEventPayload = WebhookEventPayload<
  z.infer<typeof DeploymentErrorEventSchema>
>;

export type DeploymentEventPayload =
  | DeploymentCreatedEventPayload
  | DeploymentSucceededEventPayload
  | DeploymentReadyEventPayload
  | DeploymentCanceledEventPayload
  | DeploymentErrorEventPayload;

// Project
const ProjectPayloadBaseSchema = z.object({
  user: z.object({
    id: z.string(),
  }),
  team: z
    .object({
      id: z.string().optional(),
    })
    .optional(),
  project: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

const ProjectCreatedEventSchema = WebhookEventBaseSchema.extend({
  type: z.literal(WebhookEventTypeSchema.enum["project.created"]),
  payload: ProjectPayloadBaseSchema,
});

const ProjectRemovedEventSchema = WebhookEventBaseSchema.extend({
  type: z.literal(WebhookEventTypeSchema.enum["project.removed"]),
  payload: ProjectPayloadBaseSchema,
});

const ProjectEventSchema = z.discriminatedUnion("type", [
  ProjectCreatedEventSchema,
  ProjectRemovedEventSchema,
]);

export type ProjectCreatedEventPayload = WebhookEventPayload<
  z.infer<typeof ProjectCreatedEventSchema>
>;

export type ProjectRemovedEventPayload = WebhookEventPayload<
  z.infer<typeof ProjectRemovedEventSchema>
>;

export type ProjectEventPayload = ProjectCreatedEventPayload | ProjectRemovedEventPayload;

// Integration Configuration
const IntegrationConfigPayloadBaseSchema = z.object({
  user: z.object({
    id: z.string(),
  }),
  team: z
    .object({
      id: z.string().optional(),
    })
    .optional(),
});

const IntegrationConfigScopeChangeConfirmedEventSchema = WebhookEventBaseSchema.extend({
  type: z.literal(WebhookEventTypeSchema.enum["integration-configuration.scope-change-confirmed"]),
  payload: IntegrationConfigPayloadBaseSchema.extend({
    configuration: z.object({
      id: z.string(),
      scopes: z.array(z.string()),
    }),
  }),
});

const IntegrationConfigEventSchema = z.discriminatedUnion("type", [
  IntegrationConfigScopeChangeConfirmedEventSchema,
]);

export type IntegrationConfigScopeChangeConfirmedEventPayload = WebhookEventPayload<
  z.infer<typeof IntegrationConfigEventSchema>
>;

export type IntegrationConfigEventPayload = IntegrationConfigScopeChangeConfirmedEventPayload;

// Domain
const DomainCreatedEventSchema = WebhookEventBaseSchema.extend({
  type: z.literal(WebhookEventTypeSchema.enum["domain.created"]),
  payload: z.object({
    user: z.object({
      id: z.string(),
    }),
    team: z
      .object({
        id: z.string().optional(),
      })
      .optional(),
    domain: z.object({
      name: z.string(),
      delegated: z.boolean(),
    }),
  }),
});

export type DomainCreatedEventPayload = WebhookEventPayload<
  z.infer<typeof DomainCreatedEventSchema>
>;

// All Webhook Events
export const WebhookEventSchema = z.union([
  DeploymentEventSchema,
  ProjectEventSchema,
  IntegrationConfigEventSchema,
  DomainCreatedEventSchema,
]);

export type WebhookEvent = z.infer<typeof WebhookEventSchema>;
