import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get("month") || "0");
    const year = parseInt(searchParams.get("year") || "0");

    if (!month || !year) {
      return NextResponse.json(
        { error: "Month and year are required" },
        { status: 400 }
      );
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const data = await getDashboardData(month, year);

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Draw title
    page.drawText("Admin Dashboard Report", {
      x: 50,
      y: height - 50,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    // Draw date
    page.drawText(
      `Period: ${new Date(year, month - 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
      })}`,
      {
        x: 50,
        y: height - 80,
        size: 14,
        font,
        color: rgb(0, 0, 0),
      }
    );

    // Draw stats
    let yPosition = height - 120;
    page.drawText("Statistics:", {
      x: 50,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 30;
    page.drawText(`Total Orders: ${data.totalOrders}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;
    page.drawText(`Total Revenue: $${data.totalRevenue}`, {
      x: 50,
      y: yPosition,
      size: 14,
      font,
      color: rgb(0, 0, 0),
    });

    yPosition -= 40;
    page.drawText("Order Status Breakdown:", {
      x: 50,
      y: yPosition,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;
    data.uploadsByStatus.forEach((status) => {
      page.drawText(
        `${status.status.replace(/_/g, " ")}: ${status._count.status}`,
        {
          x: 50,
          y: yPosition,
          size: 14,
          font,
          color: rgb(0, 0, 0),
        }
      );
      yPosition -= 20;
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=report-${month}-${year}.pdf`,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

async function getDashboardData(month: number, year: number) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const [totalOrders, totalRevenue, uploadsByStatus] = await Promise.all([
    prisma.upload.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
    prisma.upload.aggregate({
      _sum: {
        needed_amount: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: "completed",
      },
    }),
    prisma.upload.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    }),
  ]);

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.needed_amount || 0,
    uploadsByStatus,
    month,
    year,
  };
}
