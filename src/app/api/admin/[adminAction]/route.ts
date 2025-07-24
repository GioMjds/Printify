import prisma from "@/lib/prisma";
import { generateNotificationMessage } from "@/utils/notifications";
import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import path from "path";
import { hash } from "bcrypt";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminAction = searchParams.get("action");
    const uploadId = searchParams.get("uploadId");

    switch (adminAction) {
      case "fetch_print_orders": {
        const statusFilter = searchParams.get("status");
        const searchQuery = searchParams.get("search");

        const whereClause: Record<string, unknown> = {
          status: {
            notIn: ["rejected", "cancelled", "completed"],
          },
        };

        if (statusFilter && statusFilter !== "all") {
          whereClause.status = statusFilter;
        } else {
          whereClause.status = {
            notIn: ["rejected", "cancelled", "completed"],
          };
        }

        if (searchQuery && searchQuery.trim() !== "") {
          const searchConditions: object[] = [
            {
              filename: {
                contains: searchQuery.trim(),
                mode: "insensitive" as const,
              },
            },
            {
              customer: {
                name: {
                  contains: searchQuery.trim(),
                  mode: "insensitive" as const,
                },
              },
            },
            {
              customer: {
                email: {
                  contains: searchQuery.trim(),
                  mode: "insensitive" as const,
                },
              },
            },
          ];
          whereClause.OR = searchConditions;
        }

        const printOrders = await prisma.upload.findMany({
          where: whereClause,
          orderBy: { createdAt: "desc" },
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

        const availableStatuses = await prisma.upload.findMany({
          select: {
            status: true,
          },
          distinct: ["status"],
          orderBy: { status: "asc" },
        });

        const statusOptions = availableStatuses.map((item) => item.status);

        return NextResponse.json(
          {
            printOrders: printOrders,
            statusOptions: statusOptions,
            totalCount: printOrders.length,
            appliedFilters: {
              status: statusFilter || "all",
              search: searchQuery || "",
            },
          },
          { status: 200 }
        );
      }
      case "download_file": {
        if (!uploadId) {
          return NextResponse.json(
            {
              error: "Missing uploadId",
            },
            { status: 400 }
          );
        }

        const upload = await prisma.upload.findUnique({
          where: { id: uploadId },
        });

        if (!upload) {
          return NextResponse.json(
            {
              error: "File not found",
            },
            { status: 404 }
          );
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
          where: { role: "customer" },
          orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(
          {
            users: users,
          },
          { status: 200 }
        );
      }
      case "fetch_staff": {
        const staffs = await prisma.user.findMany({
          where: { role: "staff" },
          orderBy: { createdAt: "asc" },
        });

        return NextResponse.json(
          {
            staff: staffs,
          },
          { status: 200 }
        );
      }
      default: {
        return NextResponse.json(
          {
            error: "Invalid admin action",
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: `/api/admin/[adminAction] GET error: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminAction } = body;

    switch (adminAction) {
      case "update_upload_status": {
        const { uploadId, newStatus, rejectionReason, amount } = body;

        if (!uploadId || !newStatus) {
          return NextResponse.json({
              error: "Missing required fields: uploadId and newStatus",
          }, { status: 400 });
        }

        const validStatuses = [
          "pending",
          "cancelled",
          "rejected",
          "ready_to_pickup",
          "completed",
        ];

        if (!validStatuses.includes(newStatus)) {
          return NextResponse.json(
            {
              error: `Invalid status. Must be one of: ${validStatuses.join(
                ", "
              )}`,
            },
            { status: 400 }
          );
        }

        if (newStatus === "rejected" && !rejectionReason) {
          return NextResponse.json(
            {
              error: "Rejection reason is required when status is 'rejected'",
            },
            { status: 400 }
          );
        }

        if (newStatus === "ready_to_pickup" && (!amount || amount <= 0)) {
          return NextResponse.json(
            {
              error:
                "Amount is required and must be greater than 0 when status is 'ready_to_pickup'",
            },
            { status: 400 }
          );
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
          return NextResponse.json(
            {
              error: "Upload not found",
            },
            { status: 404 }
          );
        }

        const updateData: any = {
          status: newStatus,
          updatedAt: new Date(),
        };

        if (newStatus === "rejected") {
          updateData.rejection_reason = rejectionReason || "No reason provided";
        } else {
          updateData.rejection_reason = null;
        }

        if (newStatus === "ready_to_pickup" && amount) {
          updateData.needed_amount = amount;
        }

        const updatedUpload = await prisma.upload.update({
          where: { id: uploadId },
          data: updateData,
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
            markAsRead: false,
          },
        });

        try {
          const notificationData = {
            id: notification.id,
            message: notificationMessage,
            orderId: uploadId,
            orderFilename: existingUpload.filename,
            status: newStatus,
            ...(newStatus === "rejected" && {
              rejectionReason: rejectionReason,
            }),
            ...(newStatus === "ready_to_pickup" &&
              amount && {
                amount: amount,
              }),
            createdAt: notification.sentAt.toISOString(),
            read: false,
          };

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/send`,
            {
              userId: existingUpload.customerId,
              notification: notificationData,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } catch (wsError) {
          console.warn(`⚠️ Failed to send real-time notification: ${wsError}`);
        }

        return NextResponse.json(
          {
            message: `Print upload status updated to ${newStatus} successfully`,
            upload: {
              id: updatedUpload.id,
              status: updatedUpload.status,
              needed_amount: updatedUpload.needed_amount,
              rejection_reason: updatedUpload.rejection_reason,
            },
            notification: {
              id: notification.id,
              message: notificationMessage,
              sentAt: notification.sentAt,
            },
          },
          { status: 200 }
        );
      }
      default: {
        return NextResponse.json(
          {
            error: "Invalid admin action",
          },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: `/api/admin/[adminAction] PUT error: ${error}`,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { adminAction } = body;
    switch (adminAction) {
      case "add_staff": {
        const { firstName, middleName, lastName, email, password, confirmPassword, role } = body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !role) {
          return NextResponse.json({
          error: "Missing required fields.",
          }, { status: 400 });
        }

        if (role !== "staff") {
          return NextResponse.json({
          error: "Role must be 'staff'",
          }, { status: 400 });
        }

        const name = middleName
          ? `${firstName} ${middleName} ${lastName}`
          : `${firstName} ${lastName}`;

        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return NextResponse.json({
            error: "User with this email already exists.",
          }, { status: 409 });
        }

        const hashedPassword = await hash(password, 12);

        if (password !== confirmPassword) {
          return NextResponse.json({
            error: "Passwords do not match.",
          }, { status: 400 });
        }

        const newStaff = await prisma.user.create({
          data: {
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            role: "staff",
            isVerified: true,
          },
        });

        return NextResponse.json({
          staff: {
            id: newStaff.id,
            name: newStaff.name,
            email: newStaff.email,
            role: newStaff.role,
            isVerified: newStaff.isVerified,
          },
        }, { status: 201 });
      }
      default: {
        return NextResponse.json({
            error: "Invalid admin action",
        }, { status: 400 });
      }
    }
  } catch (error) {
    return NextResponse.json({
        error: `/api/admin/[adminAction] POST error: ${error}`,
    }, { status: 500 });
  }
}
