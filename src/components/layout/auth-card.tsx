import Link from "next/link";
import { Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="container-page flex min-h-[calc(100dvh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <Link href="/" className="flex items-center justify-center gap-2 font-serif text-lg font-semibold">
          <Target className="h-5 w-5 text-accent" aria-hidden="true" />
          Unstoppable Action Lab
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
        {footer}
      </div>
    </div>
  );
}
