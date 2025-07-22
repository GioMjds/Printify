import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userUploads = await prisma.upload.findMany({
      where: {
        customerId: session.userId,
      },
      select: {
        id: true,
      },
    });

    const uploadIds = userUploads.map((upload) => upload.id);

    const unreadCount = await prisma.notification.count({
      where: {
        uploadId: {
          in: uploadIds,
        },
        markAsRead: false,
      },
    });

    return NextResponse.json({
        unreadCount,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
        error: `Failed to fetch notification count: ${error}`,
    }, { status: 500 });
  }
}
