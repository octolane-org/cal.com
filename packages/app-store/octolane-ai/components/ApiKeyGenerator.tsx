import { useState } from "react";

import { CopyApiKey } from "@calcom/octolane-ai/components/CopyApiKey";
import type { ApiKeyGeneratorProps, Team } from "@calcom/octolane-ai/types";
import { Button } from "@calcom/ui/components/button";

export function ApiKeyGenerator({ teams, onCreateApiKey }: ApiKeyGeneratorProps) {
  const [newApiKeys, setNewApiKeys] = useState<Record<string, string>>({});

  async function generateApiKey(teamId?: number) {
    const apiKey = await onCreateApiKey(teamId);
    setNewApiKeys({ ...newApiKeys, [teamId || ""]: apiKey });
  }

  if (!teams) {
    return (
      <Button color="secondary" onClick={() => generateApiKey()} className="mb-4 mt-2">
        Generate API key
      </Button>
    );
  }

  return (
    <>
      <div className="mt-8 text-sm font-semibold">Your event types:</div>
      {!newApiKeys[""] ? (
        <Button color="secondary" onClick={() => generateApiKey()} className="mb-4 mt-2">
          Generate API key
        </Button>
      ) : (
        <CopyApiKey apiKey={newApiKeys[""]} />
      )}
      {teams.map((team: Team) => {
        return (
          <div key={team.name}>
            <div className="mt-2 text-sm font-semibold">{team.name}:</div>
            {!newApiKeys[team.id] ? (
              <Button color="secondary" onClick={() => generateApiKey(team.id)} className="mb-4 mt-2">
                Generate API key
              </Button>
            ) : (
              <CopyApiKey apiKey={newApiKeys[team.id]} />
            )}
          </div>
        );
      })}
    </>
  );
}
