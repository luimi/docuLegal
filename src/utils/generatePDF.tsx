import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (contentRef: any, name: string) => {
    const input = contentRef.current;
    if (!input) return; // Asegúrate de que el elemento exista

    // Opciones para html2canvas:
    // scale: Aumenta la resolución de la captura para mejor calidad en el PDF.
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png'); // Obtén la imagen como base64

    // Configuración de jsPDF:
    // 'p': portrait, 'mm': unidades en milímetros, 'a4': tamaño de página A4
    // Para tamaño carta, necesitas especificar las dimensiones en milímetros o pulgadas.
    // Tamaño Carta: 215.9 mm x 279.4 mm (o 8.5 in x 11 in)
    const pdf = new jsPDF('p', 'mm', [215.9, 279.4]); // 'p' de portrait, 'mm' de milímetros

    const imgWidth = 210; // Ancho de la imagen en el PDF (casi el ancho de la página Carta)
    const pageHeight = 279.4; // Altura de la página Carta
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calcula la altura de la imagen proporcionalmente
    let heightLeft = imgHeight;

    let position = 0; // Posición inicial en Y

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${name}.pdf`); // Nombre del archivo PDF
}