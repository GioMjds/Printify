import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, notification } = body;

    if (!userId || !notification) {
      return NextResponse.json({
        error: "Missing required fields: userId and notification"
      }, { status: 400 });
    }

    const wsServerUrl = process.env.NEXT_PUBLIC_WS_URL;
    if (wsServerUrl) {
      try {
        const response = await fetch(
          `${wsServerUrl
            .replace("ws:", "http:")
            .replace("wss:", "https:")}/notify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              notification,
            }),
          }
        );

        if (response.ok) {
          console.log("✅ Notification sent to WebSocket server");
        } else {
          console.warn(
            "⚠️ Failed to send notification to WebSocket server:",
            response.status
          );
        }
      } catch (error) {
        console.warn("⚠️ Could not reach WebSocket server:", error);
      }
    }

    return NextResponse.json({
      message: "Notification queued for delivery"
    }, { status: 200 });
  } catch (error) {
    console.error(`Failed to send notification: ${error}`);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
