import { trpc } from "@calcom/trpc/react";

import { APP_TYPE, APP_VARIANT } from "../constants";

export function useIntegration() {
  const integrations = trpc.viewer.apps.integrations.useQuery({ variant: APP_VARIANT });
  const teamsList = trpc.viewer.teams.listOwnedTeams.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const teams = teamsList.data?.map((team) => ({ id: team.id, name: team.name }));
  const octolaneCredentials: { userCredentialIds: number[] } | undefined = integrations.data?.items.find(
    (item: { type: string }) => item.type === APP_TYPE
  );
  const [credentialId] = octolaneCredentials?.userCredentialIds || [false];
  const showContent = integrations.data && integrations.isSuccess && credentialId;

  return {
    teams,
    showContent,
    isPending: integrations.isPending,
  };
}
