import prisma from "@/lib/prisma";

export async function getDashboardData(month?: number, year?: number) {
  const currentDate = new Date();
  const selectedMonth = month ?? currentDate.getMonth() + 1;
  const selectedYear = year ?? currentDate.getFullYear();

  const startDate = new Date(selectedYear, selectedMonth - 1, 1);
  const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);

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
    month: selectedMonth,
    year: selectedYear,
  };
}
