import type { BookingStatus } from "@calcom/prisma/enums";
import type { WebhookTriggerEvents } from "@calcom/prisma/enums";

export type EventType = {
  id: number;
  title: string;
  description: string | null;
  length: number;
  slug: string;
  hidden: boolean;
  schedulingType: string | null;
  customInputs: Array<{
    id: number;
    label: string;
    placeholder: string;
    required: boolean;
    type: string;
  }>;
  team: {
    id: number;
    name: string;
  } | null;
  totalBookings: number;
};

export type Booking = {
  id: number;
  uid: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  eventType: {
    id: number;
    title: string;
    description: string | null;
  } | null;
  attendees: Array<{
    email: string;
    name: string | null;
  }>;
};

export type PaginationResponse = {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type EventTypesResponse = {
  eventTypes: EventType[];
  pagination: PaginationResponse;
};

export type BookingsResponse = {
  bookings: Booking[];
  pagination: PaginationResponse;
};

export type Subscription = {
  id: number;
  subscriberUrl: string;
  triggerEvent: WebhookTriggerEvents;
  createdAt: Date;
  updatedAt: Date;
};

export type SubscriptionResponse = {
  subscription: Subscription;
};

export type ApiResponse<T = Record<string, unknown>, M = Record<string, unknown>> = {
  status: "success" | "error";
  code: number;
  message?: string;
  data?: T;
  meta?: M;
};

export type EventTypesListResponse = ApiResponse<EventTypesResponse>;
export type BookingsListResponse = ApiResponse<BookingsResponse>;
export type SubscriptionAddResponse = ApiResponse<SubscriptionResponse>;
export type SubscriptionDeleteResponse = ApiResponse<{ success: boolean }>;

export type GetBookingsQuery = {
  apiKey: string;
  page?: string;
  limit?: string;
  event_type_id?: string;
};

export type GetEventTypesQuery = {
  apiKey: string;
  page?: string;
  limit?: string;
};

export type ServiceResponse<T> = {
  data: T;
  pagination: PaginationResponse;
};
