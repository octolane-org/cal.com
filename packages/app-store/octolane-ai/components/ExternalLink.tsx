import Link from "next/link";

import type { ExternalLinkProps } from "@calcom/octolane-ai/types";
import { Button } from "@calcom/ui/components/button";

export function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Button color="minimal" className="p-0 text-sm font-medium underline">
        {children}
      </Button>
    </Link>
  );
}
