import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "✅ vr-gameroom Liveness OK!",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
}
