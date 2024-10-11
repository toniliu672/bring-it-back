/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/corsUtils.ts
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

export function isAllowedOrigin(origin: string | null): boolean {
  return origin
    ? allowedOrigins.some((allowed) => origin.startsWith(allowed))
    : false;
}

export function handleCORS(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");

  console.log("Received Origin:", origin || "No origin provided");
  console.log("Allowed Origins:", allowedOrigins);

  if (!origin) {
    console.log("No origin provided. Possibly same-origin request. Allowing.");
    return null;
  }

  if (!isAllowedOrigin(origin)) {
    console.log("Access denied due to CORS policy. Origin:", origin);
    return new NextResponse("CORS Policy: This origin is not allowed", {
      status: 403,
    });
  }

  console.log("Origin allowed. Setting CORS headers.");
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export function withCORS(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: any) => {
    if (req.method === "OPTIONS") {
      return handleCORS(req) || new NextResponse(null, { status: 204 });
    }

    const corsResponse = handleCORS(req);
    if (corsResponse && corsResponse.status === 403) {
      return corsResponse;
    }

    const response = await handler(req, context);

    const origin = req.headers.get("origin");
    if (origin && isAllowedOrigin(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    }

    return response;
  };
}

export function checkAccess(req: NextRequest): boolean {
  const referer = req.headers.get("Referer");
  const origin = req.headers.get("Origin");

  return isAllowedOrigin(referer) || isAllowedOrigin(origin);
}
