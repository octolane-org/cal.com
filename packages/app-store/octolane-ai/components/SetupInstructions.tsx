import { ExternalLink } from "@calcom/octolane-ai/components/ExternalLink";
import { URLS } from "@calcom/octolane-ai/constants";

export function SetupInstructions() {
  return (
    <ol className="mb-10 ml-5 mt-5 list-decimal text-sm ltr:mr-5 rtl:ml-5">
      <li>Generate your API key using the button above. Make sure to copy and save it somewhere safe.</li>
      <li>
        Log into your Octolane AI <ExternalLink href={URLS.SIGN_IN}>dashboard</ExternalLink>
      </li>
      <li>
        Go to Integrations and select Cal.com, or{" "}
        <ExternalLink href={URLS.INTEGRATIONS}>click here to go directly</ExternalLink>
      </li>
      <li>Enter the API key you generated in step 1</li>
      <li>You&apos;re all set!</li>
    </ol>
  );
}
