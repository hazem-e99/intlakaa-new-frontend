import { Request } from "@/services/requestsService";

/**
 * Export requests data to Excel file
 * @param data - Array of request objects to export
 * @param filename - Name of the Excel file (default: requests_export.xlsx)
 */
export const exportToExcel = async (
  data: Request[],
  filename: string = "requests_export.xlsx",
) => {
  try {
    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("الطلبات", {
      views: [{ rightToLeft: true }],
    });

    worksheet.columns = [
      { header: "الاسم", key: "name", width: 25 },
      { header: "رقم الهاتف", key: "phone", width: 20 },
      { header: "رابط المتجر", key: "storeUrl", width: 35 },
      { header: "المبيعات الشهرية", key: "monthlySales", width: 20 },
      { header: "المجال", key: "field", width: 25 },
      { header: "الدافع", key: "motivation", width: 35 },
      { header: "عنوان الجهاز", key: "ipAddress", width: 18 },
      { header: "الدولة", key: "country", width: 20 },
      { header: "مفتاح الدولة", key: "phoneCountry", width: 20 },
      { header: "تاريخ الإنشاء", key: "createdAt", width: 30 },
    ];

    data.forEach((request) => {
      worksheet.addRow({
        name: request.name,
        phone: request.phone,
        storeUrl: request.storeUrl,
        monthlySales: request.monthlySales,
        field: request.field || "-",
        motivation: request.motivation || "-",
        ipAddress: request.ipAddress || "-",
        country: request.country || "-",
        phoneCountry: request.phoneCountry || "-",
        createdAt: new Date(request.createdAt).toLocaleString("ar-SA", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };

    worksheet.eachRow((row) => {
      row.alignment = {
        vertical: "middle",
        horizontal: "right",
        wrapText: true,
      };
    });

    const fileBuffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([fileBuffer as BlobPart], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    throw new Error("فشل تصدير البيانات إلى Excel");
  }
};
