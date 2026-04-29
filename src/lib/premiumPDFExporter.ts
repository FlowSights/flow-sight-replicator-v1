import jsPDF from 'jspdf';

interface PremiumPDFData {
  businessName: string;
  websiteUrl: string;
  promote: string;
  location: string;
  idealCustomer: string;
  budget: number;
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
  ads: Array<{
    type: string;
    headline: string;
    description: string;
    cta: string;
    reasoning: string;
    score: number;
  }>;
}

export const generatePremiumPDF = (data: PremiumPDFData): jsPDF => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Colores por plataforma
  const platformColors: Record<string, [number, number, number]> = {
    google: [234, 67, 53],
    meta: [24, 119, 242],
    tiktok: [0, 0, 0],
    linkedin: [0, 119, 181],
  };

  const platformNames: Record<string, string> = {
    google: 'Google Ads',
    meta: 'Meta Ads (Facebook & Instagram)',
    tiktok: 'TikTok Ads',
    linkedin: 'LinkedIn Ads',
  };

  const color = platformColors[data.platform];
  let yPos = margin;

  // Función auxiliar: Salto de página
  const checkPageBreak = (spaceNeeded: number) => {
    if (yPos + spaceNeeded > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
    }
  };

  // Función auxiliar: Título de sección
  const addSectionTitle = (title: string) => {
    checkPageBreak(15);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(title, margin, yPos);
    yPos += 10;
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, margin + 40, yPos);
    yPos += 8;
    doc.setTextColor(0, 0, 0);
  };

  // Función auxiliar: Párrafo
  const addParagraph = (text: string, fontSize = 11) => {
    checkPageBreak(15);
    doc.setFontSize(fontSize);
    doc.setFont(undefined, 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += lines.length * 5 + 3;
  };

  // ===== PÁGINA 1: PORTADA =====
  doc.setFillColor(color[0], color[1], color[2]);
  doc.rect(0, 0, pageWidth, 100, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont(undefined, 'bold');
  doc.text('CAMPAIGN KIT PREMIUM', margin, 30);

  doc.setFontSize(18);
  doc.setFont(undefined, 'normal');
  doc.text(platformNames[data.platform], margin, 50);

  doc.setFontSize(12);
  doc.text(`Para: ${data.businessName}`, margin, 65);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, margin, 75);

  yPos = 110;

  // Información del negocio
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Tu Estrategia', margin, yPos);
  yPos += 12;

  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  const infoText = `
Negocio: ${data.businessName}
Sitio Web: ${data.websiteUrl}
Qué Promocionas: ${data.promote}
Ubicación: ${data.location}
Cliente Ideal: ${data.idealCustomer}
Presupuesto Diario: $${data.budget}
  `.trim();

  const infoLines = infoText.split('\n');
  infoLines.forEach((line) => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  // ===== PÁGINA 2: RESUMEN EJECUTIVO =====
  doc.addPage();
  yPos = margin;

  addSectionTitle('📊 RESUMEN EJECUTIVO');

  addParagraph(
    `Este kit contiene una estrategia completa de marketing digital para ${data.businessName} en ${platformNames[data.platform]}. Hemos generado ${data.ads.length} variantes de anuncios optimizadas para máxima conversión.`
  );

  addParagraph(
    `Cada anuncio ha sido diseñado específicamente para tu cliente ideal (${data.idealCustomer}) en ${data.location}, enfocándose en ${data.promote}.`
  );

  addParagraph(
    `Con un presupuesto diario de $${data.budget}, puedes esperar resultados significativos en las primeras 2-3 semanas de campaña.`
  );

  // ===== PÁGINA 3+: ANUNCIOS GENERADOS =====
  data.ads.forEach((ad, idx) => {
    if (idx % 2 === 0) {
      doc.addPage();
      yPos = margin;
    }

    addSectionTitle(`${ad.type.toUpperCase()} - Variante ${idx + 1}`);

    // Score
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(margin, yPos, 20, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text(`Score: ${ad.score}%`, margin + 2, yPos + 5);
    yPos += 12;

    // Headline
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Titular:', margin, yPos);
    yPos += 6;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const headlineLines = doc.splitTextToSize(`"${ad.headline}"`, contentWidth);
    doc.text(headlineLines, margin, yPos);
    yPos += headlineLines.length * 5 + 3;

    // Description
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Descripción:', margin, yPos);
    yPos += 6;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    const descLines = doc.splitTextToSize(`"${ad.description}"`, contentWidth);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 5 + 3;

    // CTA
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Botón de Acción:', margin, yPos);
    yPos += 6;
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(`"${ad.cta}"`, margin, yPos);
    yPos += 8;

    // Reasoning
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, contentWidth, 30, 'F');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    const reasoningLines = doc.splitTextToSize(`💡 ${ad.reasoning}`, contentWidth - 4);
    doc.text(reasoningLines, margin + 2, yPos + 3);
    yPos += 35;
  });

  // ===== PÁGINA FINAL: GUÍA DE LANZAMIENTO =====
  doc.addPage();
  yPos = margin;

  addSectionTitle('🚀 GUÍA DE LANZAMIENTO');

  const steps = [
    {
      title: '1. Accede a tu Administrador de Anuncios',
      description: `Ve a ${platformNames[data.platform]} y accede a tu cuenta.`,
    },
    {
      title: '2. Crea una Nueva Campaña',
      description: 'Selecciona el objetivo de conversión o tráfico según tu meta.',
    },
    {
      title: '3. Configura tu Audiencia',
      description: `Define la ubicación (${data.location}) y el rango de edad de tu cliente ideal.`,
    },
    {
      title: '4. Sube tus Anuncios',
      description: 'Copia y pega los headlines, descripciones y CTAs de este documento.',
    },
    {
      title: '5. Establece tu Presupuesto',
      description: `Ingresa $${data.budget} como presupuesto diario.`,
    },
    {
      title: '6. Revisa y Publica',
      description: 'Verifica que todo se vea correcto y publica tu campaña.',
    },
  ];

  steps.forEach((step) => {
    checkPageBreak(15);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(step.title, margin, yPos);
    yPos += 6;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    const descLines = doc.splitTextToSize(step.description, contentWidth);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 5 + 5;
  });

  // Footer
  yPos = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `FlowSights Ads - Campaign Kit Premium | ${new Date().getFullYear()}`,
    pageWidth / 2,
    yPos,
    { align: 'center' }
  );

  return doc;
};

export const downloadPremiumPDF = (data: PremiumPDFData) => {
  const doc = generatePremiumPDF(data);
  const fileName = `FlowSights-${data.businessName}-${data.platform}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
