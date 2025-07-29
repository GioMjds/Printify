import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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

    const userUploads = await prisma.upload.findMany({
      where: {
        customerId: session.userId,
      },
      select: {
        id: true,
      },
    });

    const uploadIds = userUploads.map((upload) => upload.id);

    const whereClause: Prisma.NotificationWhereInput = {
      uploadId: {
        in: uploadIds,
      },
    };

    if (unreadOnly) {
      whereClause.markAsRead = false;
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

    const transformedNotifications = notifications.map((notification) => ({
      id: notification.id,
      message: notification.message,
      read: !!notification.markAsRead,
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
    return NextResponse.json(
      {
        error: `Failed to fetch notifications: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { uploadId, message } = body;

    if (!uploadId || !message) {
      return NextResponse.json({
          error: "Missing required fields: uploadId and message",
      }, { status: 400 });
    }

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

    const notification = await prisma.notification.create({
      data: {
        uploadId: uploadId,
        message: message,
        sentAt: new Date(),
        markAsRead: false, // Ensure new notifications are unread
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

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, notificationIds, notificationId } = body;

    switch (action) {
      case "mark_read": {
        if (!notificationId) {
          return NextResponse.json(
            { error: "notificationId is required" },
            { status: 400 }
          );
        }

        // Verify the notification belongs to user's uploads
        const notification = await prisma.notification.findFirst({
          where: {
            id: notificationId,
            upload: {
              customerId: session.userId,
            },
          },
        });

        if (!notification) {
          return NextResponse.json(
            { error: "Notification not found or unauthorized" },
            { status: 404 }
          );
        }

        // Update the notification to mark it as read
        await prisma.notification.update({
          where: {
            id: notificationId,
          },
          data: {
            markAsRead: true,
          },
        });

        return NextResponse.json(
          {
            message: "Notification marked as read",
            notificationId,
          },
          { status: 200 }
        );
      }

      case "mark_all_read": {
        // Get all user's notifications through their uploads
        const userUploads = await prisma.upload.findMany({
          where: {
            customerId: session.userId,
          },
          select: {
            id: true,
          },
        });

        const uploadIds = userUploads.map((upload) => upload.id);

        // Mark all notifications as read for this user's uploads
        const updateResult = await prisma.notification.updateMany({
          where: {
            uploadId: {
              in: uploadIds,
            },
            markAsRead: false, // Only update unread notifications
          },
          data: {
            markAsRead: true,
          },
        });

        return NextResponse.json(
          {
            message: "All notifications marked as read",
            updatedCount: updateResult.count,
          },
          { status: 200 }
        );
      }

      case "mark_as_read": {
        // Legacy support for multiple notifications
        if (notificationId) {
          // Single notification
          const notification = await prisma.notification.findFirst({
            where: {
              id: notificationId,
              upload: {
                customerId: session.userId,
              },
            },
          });

          if (!notification) {
            return NextResponse.json(
              { error: "Notification not found or unauthorized" },
              { status: 404 }
            );
          }

          await prisma.notification.update({
            where: {
              id: notificationId,
            },
            data: {
              markAsRead: true,
            },
          });

          return NextResponse.json(
            {
              message: "Notification marked as read",
              notificationId,
            },
            { status: 200 }
          );
        }

        if (notificationIds && Array.isArray(notificationIds)) {
          // Multiple notifications
          const userUploads = await prisma.upload.findMany({
            where: {
              customerId: session.userId,
            },
            select: {
              id: true,
            },
          });

          const uploadIds = userUploads.map((upload) => upload.id);

          const updateResult = await prisma.notification.updateMany({
            where: {
              id: {
                in: notificationIds,
              },
              uploadId: {
                in: uploadIds,
              },
            },
            data: {
              markAsRead: true,
            },
          });

          return NextResponse.json(
            {
              message: "Notifications marked as read",
              count: updateResult.count,
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

      if (upload.customerId !== session.userId && session.role !== "admin") {
        return NextResponse.json({
            error: "Forbidden: You can only delete notifications for your own uploads",
        }, { status: 403 });
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
