import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";
import { showToast } from "@calcom/ui/components/toast";
import { Tooltip } from "@calcom/ui/components/tooltip";

import type { CopyApiKeyProps } from "../types";

export function CopyApiKey({ apiKey }: CopyApiKeyProps) {
  const { t } = useLocale();
  return (
    <div>
      <div className="my-2 mt-3 flex-wrap sm:flex sm:flex-nowrap">
        <code className="bg-subtle h-10 w-full whitespace-pre-wrap rounded-md py-2 pl-2 pr-2 sm:rounded-r-none sm:pr-5">
          {apiKey}
        </code>
        <div>
          <Tooltip side="top" content={t("copy_to_clipboard")}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(apiKey);
                showToast(t("api_key_copied"), "success");
              }}
              type="button"
              className="mt-4 h-10 text-base sm:mt-0 sm:rounded-l-none">
              <Icon name="clipboard" className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t("copy")}
            </Button>
          </Tooltip>
        </div>
      </div>
      <div className="text-subtle mb-5 mt-2 text-sm">{t("copy_somewhere_safe")}</div>
    </div>
  );
}
