import { NextResponse } from "next/server";
import { getAvailableTypes } from "@/lib/skill-registry";
import { getSupportedTypes } from "@/lib/validator";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "GenLearn PoC API",
    version: "1.0.0",
    capabilities: {
      contentTypes: getAvailableTypes(),
      validators: getSupportedTypes(),
    },
  });
}
