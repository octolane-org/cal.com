import { createDefaultInstallation } from "@calcom/app-store/_utils/installation";
import appConfig from "@calcom/octolane-ai/config.json";
import type { AppDeclarativeHandler } from "@calcom/types/AppHandler";

const handler: AppDeclarativeHandler = {
  appType: appConfig.type,
  variant: appConfig.variant,
  slug: appConfig.slug,
  supportsMultipleInstalls: false,
  handlerType: "add",
  redirect: {
    newTab: true,
    url: "/apps/octolane-ai/setup",
  },
  createCredential: ({ appType, user, slug, teamId }) =>
    createDefaultInstallation({ appType, user: user, slug, key: {}, teamId }),
};

export default handler;
