import Link from "next/link";
import { Toaster } from "sonner";

import AppNotInstalledMessage from "@calcom/app-store/_components/AppNotInstalledMessage";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import { ApiKeyGenerator } from "@calcom/octolane-ai/components/ApiKeyGenerator";
import { SetupInstructions } from "@calcom/octolane-ai/components/SetupInstructions";
import { APP_NAME, APP_VARIANT } from "@calcom/octolane-ai/constants";
import { useApiKey } from "@calcom/octolane-ai/hooks/useApiKey";
import { useIntegration } from "@calcom/octolane-ai/hooks/useIntegration";
import { Button } from "@calcom/ui/components/button";

export default function OctolaneSetup() {
  const { t } = useLocale();
  const { createApiKey } = useApiKey();
  const { teams, showContent, isPending } = useIntegration();

  if (isPending) {
    return <div className="bg-emphasis absolute z-50 flex h-screen w-full items-center" />;
  }

  return (
    <div className="bg-emphasis flex h-screen">
      {showContent ? (
        <div className="bg-default m-auto max-w-[43em] overflow-auto rounded pb-10 md:p-10">
          <div className="md:flex md:flex-row">
            <div className="invisible md:visible">
              <img className="h-11" src="/api/app-store/octolane-ai/icon.svg" alt="Octolane AI Logo" />
            </div>
            <div className="ml-2 ltr:mr-2 rtl:ml-2 md:ml-5">
              <div className="text-default text-lg font-medium">Setting up your Octolane AI integration</div>

              <div className="mt-1 text-xl font-semibold">Generate API key:</div>
              <ApiKeyGenerator teams={teams} onCreateApiKey={createApiKey} />

              <SetupInstructions />

              <Link href={`/apps/installed/${APP_VARIANT}?hl=${APP_NAME}`}>
                <Button color="secondary">{t("done")}</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <AppNotInstalledMessage appName={APP_NAME} />
      )}
      <Toaster position="bottom-right" />
    </div>
  );
}
