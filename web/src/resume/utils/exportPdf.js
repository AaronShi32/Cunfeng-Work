import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * 将 DOM 元素导出为 A4 尺寸 PDF
 * @param {HTMLElement} element - 要导出的 DOM 元素
 * @param {string} filename - 文件名
 */
export async function exportToPdf(element, filename = '简历.pdf') {
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');

  const pdfWidth = 210;
  const pdfHeight = 297;
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // 计算缩放比例，适应 A4 宽度
  const ratio = pdfWidth / imgWidth;
  const scaledHeight = imgHeight * ratio;

  // 如果内容超过一页，分页处理
  if (scaledHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, scaledHeight);
  } else {
    let remainingHeight = imgHeight;
    let position = 0;
    const pageCanvasHeight = pdfHeight / ratio;

    while (remainingHeight > 0) {
      // 裁剪当前页的内容
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = imgWidth;
      pageCanvas.height = Math.min(pageCanvasHeight, remainingHeight);

      const ctx = pageCanvas.getContext('2d');
      ctx.drawImage(
        canvas,
        0, position,
        imgWidth, pageCanvas.height,
        0, 0,
        imgWidth, pageCanvas.height
      );

      const pageImgData = pageCanvas.toDataURL('image/png');
      const pageScaledHeight = pageCanvas.height * ratio;

      if (position > 0) {
        pdf.addPage();
      }
      pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pageScaledHeight);

      remainingHeight -= pageCanvasHeight;
      position += pageCanvasHeight;
    }
  }

  pdf.save(filename);
}
