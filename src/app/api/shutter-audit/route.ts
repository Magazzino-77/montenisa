import { NextResponse } from "next/server";
import {
  fallbackLandingContent,
  getLandingPageContent,
  landingContentAudit,
} from "@/lib/shutter";

export async function GET() {
  const content = await getLandingPageContent();

  return NextResponse.json({
    endpointConfigured: Boolean(
      process.env.SHUTTER_CONTENT_ENDPOINT ?? process.env.SHUTTER_LANDING_ENDPOINT,
    ),
    fields: landingContentAudit,
    fallback: fallbackLandingContent,
    content,
  });
}
