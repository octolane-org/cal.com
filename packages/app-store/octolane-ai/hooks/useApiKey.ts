import { trpc } from "@calcom/trpc/react";

import { APP_DISPLAY_NAME, APP_NAME } from "../constants";

export function useApiKey() {
  const utils = trpc.useUtils();
  const oldApiKey = trpc.viewer.apiKeys.findKeyOfType.useQuery({ appId: APP_NAME });
  const deleteApiKey = trpc.viewer.apiKeys.delete.useMutation({
    onSuccess: () => {
      utils.viewer.apiKeys.findKeyOfType.invalidate();
    },
  });

  const createApiKey = async (teamId?: number) => {
    const event = { note: APP_DISPLAY_NAME, expiresAt: null, appId: APP_NAME, teamId };
    const apiKey = await utils.client.viewer.apiKeys.create.mutate(event);

    if (oldApiKey.data) {
      const oldKey = teamId
        ? oldApiKey.data.find((key) => key.teamId === teamId)
        : oldApiKey.data.find((key) => !key.teamId);

      if (oldKey) {
        deleteApiKey.mutate({ id: oldKey.id });
      }
    }

    return apiKey;
  };

  return {
    createApiKey,
    oldApiKey: oldApiKey.data,
  };
}
