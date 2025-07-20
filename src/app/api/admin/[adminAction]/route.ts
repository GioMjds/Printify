import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminAction = searchParams.get("action");
    const uploadId = searchParams.get("uploadId");

    switch (adminAction) {
      case "fetch_print_orders": {
        const printOrders = await prisma.upload.findMany({
          orderBy: {
            createdAt: "asc",
          },
          include: {
            customer: true,
          },
        });

        return NextResponse.json({ printOrders }, { status: 200 });
      }
      case "download_file": {
        if (!uploadId) {
          return NextResponse.json(
            { error: "Missing uploadId" },
            { status: 400 }
          );
        }
        const upload = await prisma.upload.findUnique({
          where: { id: uploadId },
        });
        if (!upload) {
          return NextResponse.json(
            { error: "File not found" },
            { status: 404 }
          );
        }
        const fileUrl = upload.fileData;
        let filename = upload.filename;
        const format = upload.format;
        // Ensure filename ends with the correct extension
        if (!filename.toLowerCase().endsWith(`.${format}`)) {
          filename = filename.replace(/\.[^/.]+$/, "") + `.${format}`;
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

        return NextResponse.json({ users }, { status: 200 });
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
        error: `An error occurred: ${error}`,
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
        const { uploadId, newStatus, rejectionReason } = body;

        if (!uploadId || !newStatus) {
          return NextResponse.json(
            {
              error: "Missing required fields: uploadId and newStatus",
            },
            { status: 400 }
          );
        }

        // Validate status
        const validStatuses = [
          "pending",
          "printing",
          "ready_to_pickup",
          "completed",
          "cancelled",
          "rejected",
        ];
        if (!validStatuses.includes(newStatus)) {
          return NextResponse.json(
            {
              error: "Invalid status",
            },
            { status: 400 }
          );
        }

        // Update the upload
        const updateData: any = {
          status: newStatus,
          updatedAt: new Date(),
        };

        if (newStatus === "rejected" && rejectionReason) {
          updateData.rejection_reason = rejectionReason;
        }

        const updatedUpload = await prisma.upload.update({
          where: { id: uploadId },
          data: updateData,
          include: {
            customer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });

        // Create notification message based on status
        let notificationMessage = "";
        switch (newStatus) {
          case "printing":
            notificationMessage = `Your print order for "${updatedUpload.filename}" is now being printed.`;
            break;
          case "ready_to_pickup":
            notificationMessage = `Your print order for "${updatedUpload.filename}" is ready for pickup!`;
            break;
          case "completed":
            notificationMessage = `Your print order for "${updatedUpload.filename}" has been completed.`;
            break;
          case "rejected":
            notificationMessage = `Your print order for "${
              updatedUpload.filename
            }" has been rejected. ${
              rejectionReason ? `Reason: ${rejectionReason}` : ""
            }`;
            break;
          case "cancelled":
            notificationMessage = `Your print order for "${updatedUpload.filename}" has been cancelled.`;
            break;
          default:
            notificationMessage = `Your print order for "${updatedUpload.filename}" status has been updated to ${newStatus}.`;
        }

        // Create notification
        await prisma.notification.create({
          data: {
            uploadId: uploadId,
            message: notificationMessage,
            sentAt: new Date(),
          },
        });

        return NextResponse.json(
          {
            message: "Upload status updated successfully",
            upload: updatedUpload,
          },
          { status: 200 }
        );
      }

      case "reject_print_order": {
        const { uploadId, rejectionReason } = body;

        if (!uploadId) {
          return NextResponse.json(
            {
              error: "Missing required field: uploadId",
            },
            { status: 400 }
          );
        }

        const updatedUpload = await prisma.upload.update({
          where: { id: uploadId },
          data: {
            status: "rejected",
            rejection_reason: rejectionReason || "No reason provided",
            updatedAt: new Date(),
          },
        });

        // Create rejection notification
        const notificationMessage = `Your print order for "${
          updatedUpload.filename
        }" has been rejected. ${
          rejectionReason ? `Reason: ${rejectionReason}` : ""
        }`;

        await prisma.notification.create({
          data: {
            uploadId: uploadId,
            message: notificationMessage,
            sentAt: new Date(),
          },
        });

        return NextResponse.json(
          {
            message: "Print order rejected successfully",
            upload: updatedUpload,
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
        error: `An error occurred: ${error}`,
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
        error: `An error occurred: ${error}`,
      },
      { status: 500 }
    );
  }
}
