"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
}

export function NavLinks({ items, className, linkClassName }: { items: NavItem[]; className?: string; linkClassName?: string }) {
  const pathname = usePathname();
  return (
    <nav className={className} aria-label="Primary">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-sm font-medium text-slate transition-colors hover:text-foreground",
              active && "text-foreground",
              linkClassName,
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
