import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = async (req: Request) => {
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
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.upload.create({
        data: {
          filename: file.name,
          fileData: file.ufsUrl,
          status: "pending",
          customerId: metadata.userId,
          format: file.name.split(".").pop() || "",
        },
      });
      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileType: file.type,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
