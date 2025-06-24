import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import html2pdf from 'html2pdf.js';

declare module 'html2pdf.js' {
  const html2pdf: any;
  export default html2pdf;
}

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
    const margins = 25.4;
    const pageWidth = 215.9; // Ancho de la página Carta en mm
    const pageHeight = 279.4; // Altura de la página Carta en mm
    const pdf = new jsPDF('p', 'mm', [pageWidth, pageHeight]); // 'p' de portrait, 'mm' de milímetros
    
    const imgWidth = pageWidth - (margins * 2); // Ancho de la imagen en el PDF (casi el ancho de la página Carta)
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calcula la altura de la imagen proporcionalmente
    let heightLeft = imgHeight;

    let position = 0; // Posición inicial en Y

    pdf.addImage(imgData, 'PNG', margins, margins, imgWidth, imgHeight - margins);
    heightLeft -= pageHeight;
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      console.log("position", position);
      pdf.addImage(imgData, 'PNG', margins, position, imgWidth, imgHeight - margins);
      heightLeft -= pageHeight;
    }

    pdf.save(`${name}.pdf`); // Nombre del archivo PDF
}

export const generatePDF2 = async (contentRef: any, name: string) => {
  const options = {
        margin: [25.4, 25.4, 25.4, 25.4], // Márgenes: [arriba, izquierda, abajo, derecha] en mm
        filename: `${name}.pdf`, 
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'avoid-all', 'legacy'] }, // Opciones de salto de página
      };

      html2pdf().set(options).from(contentRef.current).save();
}