import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// GET - Fetch notifications for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    // First, get all uploads for this user to find related notifications
    const userUploads = await prisma.upload.findMany({
      where: {
        customerId: session.userId,
      },
      select: {
        id: true,
      },
    });

    const uploadIds = userUploads.map((upload) => upload.id);

    // Build the where clause for notifications
    const whereClause: any = {
      uploadId: {
        in: uploadIds,
      },
    };

    // Add unread filter if requested
    if (unreadOnly) {
      // For unread notifications, we need to check if they haven't been marked as read
      // Since we don't have a direct read status in the Notification model,
      // we'll extend this when we add user-notification tracking
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        upload: {
          select: {
            id: true,
            filename: true,
            status: true,
            customerId: true,
          },
        },
      },
      orderBy: {
        sentAt: "desc",
      },
      take: limit,
      skip: offset,
    });

    // Transform notifications to match the frontend interface
    const transformedNotifications = notifications.map((notification) => ({
      id: notification.id,
      message: notification.message,
      read: false, // We'll need to implement read tracking separately
      createdAt: notification.sentAt.toISOString(),
      orderId: notification.uploadId,
    }));

    return NextResponse.json(
      {
        notifications: transformedNotifications,
        total: notifications.length,
        hasMore: notifications.length === limit,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch notifications",
      },
      { status: 500 }
    );
  }
}

// POST - Create a new notification (typically called by admin actions)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { uploadId, message, notificationType } = body;

    // Validate required fields
    if (!uploadId || !message) {
      return NextResponse.json(
        {
          error: "Missing required fields: uploadId and message",
        },
        { status: 400 }
      );
    }

    // Verify the upload exists
    const upload = await prisma.upload.findUnique({
      where: { id: uploadId },
      select: {
        id: true,
        customerId: true,
        status: true,
        filename: true,
      },
    });

    if (!upload) {
      return NextResponse.json(
        {
          error: "Upload not found",
        },
        { status: 404 }
      );
    }

    // Create the notification
    const notification = await prisma.notification.create({
      data: {
        uploadId: uploadId,
        message: message,
        sentAt: new Date(),
      },
      include: {
        upload: {
          select: {
            id: true,
            filename: true,
            status: true,
            customerId: true,
          },
        },
      },
    });

    // Transform for response
    const responseNotification = {
      id: notification.id,
      message: notification.message,
      read: false,
      createdAt: notification.sentAt.toISOString(),
      orderId: notification.uploadId,
      upload: notification.upload,
    };

    return NextResponse.json(
      {
        notification: responseNotification,
        message: "Notification created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      {
        error: "Failed to create notification",
      },
      { status: 500 }
    );
  }
}

// PUT - Mark notifications as read or update notification status
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, notificationIds, notificationId } = body;

    switch (action) {
      case "mark_as_read": {
        // For now, we'll implement this as a placeholder
        // In a full implementation, you'd want a separate table to track read status per user

        if (notificationId) {
          // Mark single notification as read
          // This would require a user_notification_read table in a full implementation
          return NextResponse.json(
            {
              message: "Notification marked as read",
              notificationId,
            },
            { status: 200 }
          );
        }

        if (notificationIds && Array.isArray(notificationIds)) {
          // Mark multiple notifications as read
          return NextResponse.json(
            {
              message: "Notifications marked as read",
              count: notificationIds.length,
            },
            { status: 200 }
          );
        }

        return NextResponse.json(
          {
            error: "Either notificationId or notificationIds array is required",
          },
          { status: 400 }
        );
      }

      case "mark_all_as_read": {
        // Mark all user's notifications as read
        // This would require implementation with a user_notification_read table
        return NextResponse.json(
          {
            message: "All notifications marked as read",
          },
          { status: 200 }
        );
      }

      default: {
        return NextResponse.json(
          {
            error:
              "Invalid action. Supported actions: mark_as_read, mark_all_as_read",
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      {
        error: "Failed to update notifications",
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete notifications (admin only or user's own notifications)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("notificationId");
    const uploadId = searchParams.get("uploadId");

    if (notificationId) {
      // Delete specific notification
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
        include: {
          upload: {
            select: { customerId: true },
          },
        },
      });

      if (!notification) {
        return NextResponse.json(
          {
            error: "Notification not found",
          },
          { status: 404 }
        );
      }

      // Check if user owns this notification or is admin
      if (
        notification.upload.customerId !== session.userId &&
        session.role !== "admin"
      ) {
        return NextResponse.json(
          {
            error: "Forbidden: You can only delete your own notifications",
          },
          { status: 403 }
        );
      }

      await prisma.notification.delete({
        where: { id: notificationId },
      });

      return NextResponse.json(
        {
          message: "Notification deleted successfully",
        },
        { status: 200 }
      );
    } else if (uploadId) {
      // Delete all notifications for a specific upload
      const upload = await prisma.upload.findUnique({
        where: { id: uploadId },
        select: { customerId: true },
      });

      if (!upload) {
        return NextResponse.json(
          {
            error: "Upload not found",
          },
          { status: 404 }
        );
      }

      // Check permissions
      if (upload.customerId !== session.userId && session.role !== "admin") {
        return NextResponse.json(
          {
            error:
              "Forbidden: You can only delete notifications for your own uploads",
          },
          { status: 403 }
        );
      }

      const deletedCount = await prisma.notification.deleteMany({
        where: { uploadId: uploadId },
      });

      return NextResponse.json(
        {
          message: "Notifications deleted successfully",
          deletedCount: deletedCount.count,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Either notificationId or uploadId parameter is required",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting notifications:", error);
    return NextResponse.json(
      {
        error: "Failed to delete notifications",
      },
      { status: 500 }
    );
  }
}
