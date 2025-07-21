import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { generateNotificationMessage } from "@/utils/notifications";
import prisma from "@/lib/prisma";
import axios from "axios";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminAction = searchParams.get("action");
    const uploadId = searchParams.get("uploadId");

    switch (adminAction) {
      case "fetch_print_orders": {
        const printOrders = await prisma.upload.findMany({
          where: {
            status: {
              notIn: ["cancelled", "rejected", "completed"],
            },
          },
          orderBy: {
            createdAt: "asc",
          },
          include: {
            customer: true,
          },
        });

        return NextResponse.json({ 
          "printOrders": printOrders
        }, { status: 200 });
      }
      case "download_file": {
        if (!uploadId) {
          return NextResponse.json({ 
            error: "Missing uploadId" 
          }, { status: 400 });
        }

        const upload = await prisma.upload.findUnique({
          where: { id: uploadId },
        });

        if (!upload) {
          return NextResponse.json({ 
            error: "File not found" 
          }, { status: 404 });
        }

        const fileUrl = upload.fileData;
        let filename = upload.filename;
        const format = upload.format;

        const ext = `.${format}`;
        if (path.extname(filename).toLowerCase() !== ext.toLowerCase()) {
          filename = path.basename(filename, path.extname(filename)) + ext;
        }

        return new NextResponse(null, {
          status: 302,
          headers: {
            Location:
              fileUrl +
              `?response-content-disposition=attachment;filename=\"${encodeURIComponent(
                filename
              )}\"`,
          },
        });
      }
      case "fetch_users": {
        const users = await prisma.user.findMany({
          where: {
            role: {
              not: "admin",
            },
          },
          orderBy: {
            createdAt: "asc",
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isVerified: true,
          },
        });

        return NextResponse.json({ 
          "users": users 
        }, { status: 200 });
      }
      default: {
        return NextResponse.json({
          error: "Invalid admin action",
        }, { status: 400 });
      }
    }
  } catch (error) {
    return NextResponse.json({
        error: `/api/admin/[adminAction] GET error: ${error}`,
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminAction } = body;

    switch (adminAction) {
      case "update_upload_status": {
        const { uploadId, newStatus, rejectionReason } = body;

        if (!uploadId || !newStatus) {
          return NextResponse.json({
            error: "Missing required fields: uploadId and newStatus",
          }, { status: 400 });
        }

        const validStatuses = [
          "pending",
          "printing",
          "ready_to_pickup",
          "completed",
          "cancelled",
          "rejected",
        ];

        if (!validStatuses.includes(newStatus)) {
          return NextResponse.json({
            error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          }, { status: 400 });
        }

        if (newStatus === "rejected" && !rejectionReason) {
          return NextResponse.json({
            error: "Rejection reason is required when status is 'rejected'",
          }, { status: 400 });
        }

        const existingUpload = await prisma.upload.findUnique({
          where: { id: uploadId },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        if (!existingUpload) {
          return NextResponse.json({ 
            error: "Upload not found" 
          }, { status: 404 });
        }

        const updatedUpload = await prisma.upload.update({
          where: { id: uploadId },
          data: {
            status: newStatus,
            rejection_reason: newStatus === "rejected" 
              ? (rejectionReason || "No reason provided")
              : null,
            updatedAt: new Date(),
          },
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        const notificationMessage = generateNotificationMessage(
          existingUpload.filename,
          newStatus,
          rejectionReason
        );

        const notification = await prisma.notification.create({
          data: {
            uploadId: uploadId,
            message: notificationMessage,
            sentAt: new Date(),
          },
        });

        try {
          const notificationData = {
            id: notification.id,
            message: notificationMessage,
            orderId: uploadId,
            orderFilename: existingUpload.filename,
            status: newStatus,
            ...(newStatus === "rejected" && { rejectionReason: rejectionReason }),
            createdAt: notification.sentAt.toISOString(),
            read: false,
          };

          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/send`, {
            userId: existingUpload.customerId,
            notification: notificationData,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        } catch (wsError) {
          console.warn(`⚠️ Failed to send real-time notification: ${wsError}`);
        }

        return NextResponse.json({
            message: `Print upload status updated to ${newStatus} successfully`,
            upload: updatedUpload,
            notification: {
              id: notification.id,
              message: notificationMessage,
              sentAt: notification.sentAt,
            },
        }, { status: 200 });
      }
      default: {
        return NextResponse.json({
            error: "Invalid admin action",
        }, { status: 400 });
      }
    }
  } catch (error) {
    return NextResponse.json({
        error: `/api/admin/[adminAction] PUT error: ${error}`,
    }, { status: 500 });
  }
}