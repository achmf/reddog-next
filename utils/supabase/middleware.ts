import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Authentication middleware has been removed
  // App is now public - no authentication required
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
};
