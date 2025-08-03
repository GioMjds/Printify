import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = async () => {
  const session = await getSession();
  if (!session) return null;
  return { id: session.userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  documentUploader: f({
    "application/pdf": {
      maxFileSize: "64MB",
      maxFileCount: 1,
    }, // .pdf
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "64MB",
      maxFileCount: 1,
    }, // .docx
    "application/msword": {
      maxFileSize: "64MB",
      maxFileCount: 1,
    }, // .doc
  })
    .middleware(async () => {
      const user = await auth();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const newUpload = await prisma.upload.create({
        data: {
          filename: file.name,
          fileData: file.ufsUrl,
          status: "pending",
          customerId: metadata.userId,
          format: file.name.split(".").pop() || "",
        },
      });

      if (typeof window === 'undefined') {
        try {
          const { broadcastToAll } = await import('@/../websocket-server');
          
          const notificationData = broadcastToAll({
            type: 'new_order',
            data: {
              orderId: newUpload.id,
              filename: newUpload.filename,
              status: newUpload.status,
              customerId: newUpload.customerId,
              timestamp: new Date().toISOString()
            }
          });

          const sentCount = broadcastToAll(notificationData)
          console.log(`📊 New order WebSocket notification sent to ${sentCount} clients`);
        } catch (wsError) {
          console.error('❌ Failed to send WebSocket notification:', wsError);
        }
      }

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileType: file.type,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;