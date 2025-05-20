import Link from "next/link";

import { Button } from "@calcom/ui/components/button";

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children }: ExternalLinkProps) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Button color="minimal" className="p-0 text-sm font-medium underline">
        {children}
      </Button>
    </Link>
  );
}
