import { NextResponse } from "next/server";
import { appVersion } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "unstoppable-action-lab",
    version: appVersion,
    timestamp: new Date().toISOString(),
  });
}
