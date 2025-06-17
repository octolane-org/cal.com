import { OCTOLANE_BASE_URI } from "@calcom/lib/constants";

export const APP_NAME = "octolane";
export const APP_TYPE = "octolane_crm";
export const APP_VARIANT = "crm";
export const APP_DISPLAY_NAME = "Octolane AI";

export const URLS = {
  SIGN_IN: `${OCTOLANE_BASE_URI}/auth/sign-in`,
  INTEGRATIONS: `${OCTOLANE_BASE_URI}/redirect?to=/settings/integrations/calcom`,
} as const;

export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: "1",
  DEFAULT_LIMIT: "10",
} as const;
