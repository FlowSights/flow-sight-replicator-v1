import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GeneratedAd as Ad } from '@/types/ads';

interface CampaignKitData {
  businessName: string;
  businessDescription: string;
  targetAudience: string;
  websiteUrl: string;
  ads: Ad[];
  platform?: string;
}

const PLATFORM_COLORS: Record<string, { primary: [number, number, number], secondary: [number, number, number], light: [number, number, number], accent?: [number, number, number][] }> = {
  meta: { primary: [0, 102, 255], secondary: [6, 104, 225], light: [240, 247, 255] },
  google: { 
    primary: [66, 133, 244], // Google Blue
    secondary: [15, 157, 88], // Google Green
    light: [248, 249, 250],
    accent: [[66, 133, 244], [219, 68, 55], [244, 180, 0], [15, 157, 88]] // Blue, Red, Yellow, Green
  },
  tiktok: { primary: [254, 44, 85], secondary: [37, 244, 238], light: [255, 240, 243] },
  linkedin: { primary: [0, 119, 181], secondary: [0, 65, 106], light: [232, 240, 247] },
  generic: { primary: [16, 185, 129], secondary: [20, 184, 166], light: [236, 253, 245] }
};

export const downloadPremiumCampaignKit = (data: CampaignKitData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const platform = (data.platform || 'generic').toLowerCase();
  const colors = PLATFORM_COLORS[platform] || PLATFORM_COLORS.generic;
  const platformName = data.platform ? data.platform.charAt(0).toUpperCase() + data.platform.slice(1) : 'Multi-Platform';

  // HELPER: Draw Header
  const drawHeader = (title: string, subTitle: string) => {
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Multi-color accent line if Google
    if (colors.accent) {
      const segmentWidth = pageWidth / colors.accent.length;
      colors.accent.forEach((color, i) => {
        doc.setFillColor(...color);
        doc.rect(i * segmentWidth, 38, segmentWidth, 2, 'F');
      });
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(subTitle, 20, 30);
    
    // Logo / Brand on right
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('FLOWSIGHT ADS', pageWidth - 60, 25);
  };

  // --- Page 1: COVER ---
  // Background Gradient Simulation
  doc.setFillColor(...colors.light);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Design Element (Side bar)
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, 15, pageHeight, 'F');

  // Multi-color side bar if Google
  if (colors.accent) {
    const segmentHeight = pageHeight / colors.accent.length;
    colors.accent.forEach((color, i) => {
      doc.setFillColor(...color);
      doc.rect(13, i * segmentHeight, 2, segmentHeight, 'F');
    });
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DOSSIER ESTRATÉGICO DE PUBLICIDAD', 30, 60);
  
  // Decorative line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(30, 65, 120, 65);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(48);
  doc.setFont('helvetica', 'bold');
  doc.text('Campaign Kit', 30, 95);
  
  doc.setTextColor(...colors.primary);
  doc.setFontSize(32);
  doc.text(platformName, 30, 115);

  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(1.5);
  doc.line(30, 130, 80, 130);

  // Business Info Card
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(30, 160, 140, 60, 5, 5, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.roundedRect(30, 160, 140, 60, 5, 5, 'D');

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text('PREPARADO PARA:', 40, 175);
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(16);
  doc.text(data.businessName.toUpperCase(), 40, 185);

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.text('FECHA DE ENTREGA:', 40, 205);
  doc.setTextColor(30, 30, 30);
  doc.text(new Date().toLocaleDateString(), 40, 215);

  // Footer cover
  doc.setTextColor(150, 150, 150);
  doc.setFontSize(9);
  doc.text('Propiedad intelectual de FlowSight. Documento confidencial para uso estratégico.', pageWidth / 2, 280, { align: 'center' });

  // --- Page 2: STRATEGY OVERVIEW ---
  doc.addPage();
  drawHeader('1. ANÁLISIS ESTRATÉGICO', `Definición de mercado para ${data.businessName}`);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Contexto del Negocio', 20, 65);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(data.businessDescription, pageWidth - 40), 20, 75);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Audiencia Objetivo (Buyer Persona)', 20, 120);
  
  doc.setFillColor(...colors.light);
  doc.roundedRect(20, 130, pageWidth - 40, 30, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(doc.splitTextToSize(data.targetAudience, pageWidth - 60), 30, 145);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Estrategia de Comunicación', 20, 185);
  const commStr = `Nuestra IA ha seleccionado un tono de comunicación optimizado para ${platformName}, enfocado en romper el scroll mediante el uso de ganchos emocionales y beneficios claros. La estructura de los anuncios sigue el framework AIDA (Atención, Interés, Deseo, Acción).`;
  doc.text(doc.splitTextToSize(commStr, pageWidth - 40), 20, 195);

  // --- Page 3: CREATIVE ASSETS ---
  doc.addPage();
  drawHeader('2. PIEZAS CREATIVAS (COPYWRITING)', `Activos listos para publicar en ${platformName}`);

  data.ads.forEach((ad, index) => {
    const yStart = 60 + (index * 80);
    if (yStart > 240) doc.addPage();

    // Ad Card
    doc.setFillColor(252, 252, 252);
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, yStart - 10, pageWidth - 30, 70, 4, 4, 'FD');

    // Accent bar
    doc.setFillColor(...colors.primary);
    doc.rect(15, yStart - 10, 5, 70, 'F');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text(`VARIANTE ${index + 1}: ${ad.type.toUpperCase()}`, 25, yStart);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.text('TÍTULO / GANCHO:', 25, yStart + 10);
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(doc.splitTextToSize(ad.headline, pageWidth - 70), 55, yStart + 10);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('CUERPO DEL ANUNCIO:', 25, yStart + 25);
    doc.setTextColor(40, 40, 40);
    doc.text(doc.splitTextToSize(ad.description, pageWidth - 70), 55, yStart + 25);

    doc.setTextColor(60, 60, 60);
    doc.text('LLAMADO A LA ACCIÓN (CTA):', 25, yStart + 55);
    doc.setTextColor(...colors.secondary);
    doc.setFont('helvetica', 'bold');
    doc.text(ad.cta.toUpperCase(), 80, yStart + 55);
  });

  // --- Page 4: IMPLEMENTATION GUIDE ---
  doc.addPage();
  drawHeader('3. GUÍA DE IMPLEMENTACIÓN', 'Pasos críticos para el éxito de la campaña');

  const roadmap = [
    ['ETAPA', 'ACCIÓN RECOMENDADA', 'IMPACTO'],
    ['Píxel & Tracking', 'Instalar el píxel de seguimiento para medir conversiones reales.', 'Crítico'],
    ['Pruebas A/B', 'Lanzar al menos 2 variantes de copy durante 7 días.', 'Alto'],
    ['Optimización', 'Escalar el presupuesto en el anuncio con menor costo por click (CPC).', 'Alto'],
    ['Retargeting', 'Crear una audiencia personalizada de quienes interactuaron pero no compraron.', 'Medio']
  ];

  autoTable(doc, {
    startY: 55,
    head: [roadmap[0]],
    body: roadmap.slice(1),
    theme: 'grid',
    headStyles: { fillColor: colors.primary, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: colors.light },
    styles: { fontSize: 10, cellPadding: 5 }
  });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text('Análisis de Psicología del Consumidor', 20, (doc as any).lastAutoTable.finalY + 20);
  
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const psyNote = "Las piezas creativas de este kit han sido diseñadas bajo el marco de 'Conversión sin Fricción'. Nos enfocamos en reducir la carga cognitiva del usuario, presentando el beneficio principal en los primeros 3 segundos (hook) y guiando la mirada directamente hacia la oferta irresistible.";
  doc.text(doc.splitTextToSize(psyNote, pageWidth - 40), 20, (doc as any).lastAutoTable.finalY + 30);

  // Save
  doc.save(`FlowSight_Kit_${data.businessName.replace(/\s+/g, '_')}_${platformName}.pdf`);
};
