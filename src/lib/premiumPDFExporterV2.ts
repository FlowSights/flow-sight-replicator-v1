import jsPDF from 'jspdf';
import { html2canvas } from 'html2canvas';

export interface PremiumPDFData {
  businessName: string;
  websiteUrl: string;
  promote: string;
  location: string;
  idealCustomer: string;
  budget: number;
  platform: 'google' | 'meta' | 'tiktok' | 'linkedin';
  ads: Array<{
    type: 'Offer' | 'Emotional' | 'Urgency';
    headline: string;
    description: string;
    cta: string;
    reasoning?: string;
    score: number;
    imageUrl?: string;
  }>;
  userImage?: string;
}

const platformColors: Record<string, { primary: [number, number, number]; secondary: [number, number, number]; name: string }> = {
  google: { primary: [229, 57, 53], secondary: [251, 188, 4], name: 'Google Ads' },
  meta: { primary: [59, 89, 152], secondary: [0, 150, 136], name: 'Meta Ads' },
  tiktok: { primary: [0, 0, 0], secondary: [254, 44, 85], name: 'TikTok Ads' },
  linkedin: { primary: [0, 119, 181], secondary: [16, 185, 129], name: 'LinkedIn Ads' },
};

export const downloadPremiumPDFV2 = (data: PremiumPDFData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  const colors = platformColors[data.platform];
  const campaignId = Math.random().toString(36).substr(2, 9).toUpperCase();
  const dateStr = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  // Helper: Dibujar línea decorativa
  const drawAccentLine = (yPos: number, width: number = 40) => {
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setLineWidth(1);
    doc.line(margin, yPos, margin + width, yPos);
  };

  // Helper: Dibujar header de página
  const drawPageHeader = () => {
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text('FLOWSIGHT ADS  |  CAMPAIGN KIT PREMIUM', margin, 12);
    doc.text(data.businessName, pageWidth - margin - 50, 12);
  };

  // Helper: Dibujar footer de página
  const drawPageFooter = (pageNum: number) => {
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(`Página ${pageNum}`, margin, pageHeight - 10);
    doc.text('Documento confidencial y personalizado', pageWidth - margin - 60, pageHeight - 10);
  };

  // =============================================
  // PÁGINA 1: PORTADA PREMIUM
  // =============================================
  
  // Fondo negro
  doc.setFillColor(10, 10, 10);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Barra de color en la parte superior
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.rect(0, 0, pageWidth, 15, 'F');

  // Logo
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('FLOWSIGHT ADS', margin, 40);

  // Badge Premium
  doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.roundedRect(pageWidth - margin - 50, 30, 45, 12, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('PREMIUM KIT', pageWidth - margin - 45, 37);

  // Título principal
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(48);
  doc.setFont(undefined, 'bold');
  doc.text('Campaign', margin, 80);
  doc.text('Kit', margin, 110);

  // Plataforma destacada
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFontSize(40);
  doc.setFont(undefined, 'bold');
  doc.text(colors.name, margin, 145);

  // Línea separadora
  drawAccentLine(155, 60);

  // Información del negocio
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  let yPos = 170;
  doc.text(`Negocio: ${data.businessName}`, margin, yPos);
  yPos += 8;
  doc.text(`Producto: ${data.promote}`, margin, yPos);
  yPos += 8;
  doc.text(`Mercado: ${data.location}`, margin, yPos);
  yPos += 8;
  doc.text(`Audiencia: ${data.idealCustomer}`, margin, yPos);
  yPos += 8;
  doc.text(`Inversión: $${data.budget} USD / mes`, margin, yPos);

  // Footer
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(8);
  doc.text(`Generado el ${dateStr}`, margin, pageHeight - 20);
  doc.text(`ID: ${campaignId}`, margin, pageHeight - 15);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('Documento confidencial y personalizado', pageWidth - margin - 70, pageHeight - 15);

  // =============================================
  // PÁGINA 2: RESUMEN DE ESTRATEGIA
  // =============================================
  doc.addPage();
  drawPageHeader();
  yPos = 30;

  // Título
  drawAccentLine(yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('Resumen de tu Estrategia', margin + 50, yPos + 5);
  yPos += 20;

  // Descripción
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(80, 80, 80);
  const introText = doc.splitTextToSize(
    'Este documento contiene tu campaña publicitaria completa, lista para lanzar. Hemos diseñado cada elemento pensando en maximizar tus resultados con la menor complejidad posible. Solo necesitas seguir los pasos de esta guía para tener tu anuncio en vivo.',
    contentWidth
  );
  doc.text(introText, margin, yPos);
  yPos += introText.length * 6 + 15;

  // Cards de información
  const infoCards = [
    { label: 'EMPRESA', value: data.businessName, desc: 'Tu negocio' },
    { label: 'PRODUCTO', value: data.promote, desc: 'Qué vendes' },
    { label: 'MERCADO', value: data.location, desc: 'Dónde está tu cliente' },
    { label: 'AUDIENCIA', value: data.idealCustomer, desc: 'A quién le hablas' },
    { label: 'INVERSIÓN', value: `$${data.budget} USD/mes`, desc: 'Cuánto invertir' },
    { label: 'PLATAFORMA', value: colors.name, desc: 'Dónde publicar' },
  ];

  for (const card of infoCards) {
    // Fondo gris claro
    doc.setFillColor(245, 245, 245);
    doc.rect(margin, yPos, contentWidth, 18, 'F');

    // Etiqueta
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text(card.label, margin + 5, yPos + 5);

    // Valor
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(card.value, margin + 5, yPos + 12);

    // Descripción
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text(card.desc, contentWidth - 30, yPos + 12);

    yPos += 22;
  }

  drawPageFooter(2);

  // =============================================
  // PÁGINA 3: PROYECCIONES ESTIMADAS
  // =============================================
  doc.addPage();
  drawPageHeader();
  yPos = 30;

  // Título
  drawAccentLine(yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('Proyecciones Estimadas', margin + 50, yPos + 5);
  yPos += 25;

  // Calcular métricas
  const dailyBudget = data.budget / 30;
  const estimatedReach = Math.round(data.budget * 15);
  const estimatedClicks = Math.round(data.budget * 0.8);
  const cpcByPlatform: Record<string, number> = {
    google: 1.5,
    meta: 0.8,
    tiktok: 0.5,
    linkedin: 5.0,
  };
  const cpc = cpcByPlatform[data.platform] || 1.0;
  const roi = (estimatedClicks * 50) / data.budget; // Asumiendo $50 de valor por clic

  // Tarjetas de métricas
  const metrics = [
    { label: 'ALCANCE ESTIMADO', value: `${estimatedReach.toLocaleString()}`, unit: 'personas' },
    { label: 'CLICS ESTIMADOS', value: `${estimatedClicks.toLocaleString()}`, unit: 'clics' },
    { label: 'ROI PROYECTADO', value: `${roi.toFixed(1)}x`, unit: 'retorno' },
    { label: 'COSTO POR CLIC', value: `$${cpc.toFixed(2)}`, unit: 'USD' },
  ];

  const metricsPerRow = 2;
  const metricWidth = (contentWidth - 5) / metricsPerRow;

  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i];
    const col = i % metricsPerRow;
    const row = Math.floor(i / metricsPerRow);
    const xPos = margin + col * (metricWidth + 5);
    const yMetric = yPos + row * 50;

    // Fondo negro
    doc.setFillColor(10, 10, 10);
    doc.roundedRect(xPos, yMetric, metricWidth - 2, 45, 3, 3, 'F');

    // Etiqueta
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    doc.text(metric.label, xPos + 5, yMetric + 8);

    // Valor
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(metric.value, xPos + 5, yMetric + 25);

    // Unidad
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text(metric.unit, xPos + 5, yMetric + 35);
  }

  drawPageFooter(3);

  // =============================================
  // PÁGINA 4: TUS ANUNCIOS LISTOS PARA PUBLICAR
  // =============================================
  doc.addPage();
  drawPageHeader();
  yPos = 30;

  // Título
  drawAccentLine(yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('Tus Anuncios Listos para Publicar', margin + 50, yPos + 5);
  yPos += 20;

  // Descripción
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(80, 80, 80);
  const adIntroText = doc.splitTextToSize(
    'A continuación encontrarás los textos de tus anuncios optimizados por IA. Solo necesitas copiar y pegar cada elemento en la plataforma correspondiente.',
    contentWidth
  );
  doc.text(adIntroText, margin, yPos);
  yPos += adIntroText.length * 6 + 15;

  // Sección de imagen (si existe)
  if (data.userImage) {
    try {
      // Fondo oscuro
      doc.setFillColor(10, 10, 10);
      doc.roundedRect(margin, yPos, contentWidth, 80, 3, 3, 'F');

      // Etiqueta
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(7);
      doc.setFont(undefined, 'bold');
      doc.text('IMAGEN DEL ANUNCIO  ·  LISTA PARA USAR', margin + 5, yPos + 8);

      // Imagen
      const imgFormat = data.userImage.startsWith('data:image/png') ? 'PNG'
        : data.userImage.startsWith('data:image/webp') ? 'WEBP'
        : 'JPEG';
      doc.addImage(data.userImage, imgFormat, margin + 5, yPos + 12, contentWidth - 10, 50, undefined, 'FAST');

      // Dimensiones recomendadas
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(7);
      doc.text('Dimensiones recomendadas: 1200 x 628 px (Meta/Google) · 1080 x 1920 px (TikTok/Stories)', margin + 5, yPos + 68);

      yPos += 85;
    } catch (e) {
      // Si falla la imagen, continuar
    }
  }

  // Anuncios
  for (const ad of data.ads) {
    if (yPos > pageHeight - 100) {
      doc.addPage();
      drawPageHeader();
      yPos = 30;
    }

    // Card del anuncio
    doc.setFillColor(252, 252, 252);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(margin, yPos, contentWidth, 70, 3, 3, 'FD');

    // Badge de tipo
    const typeColors: Record<string, [number, number, number]> = {
      'Offer': [16, 185, 129],
      'Emotional': [139, 92, 246],
      'Urgency': [239, 68, 68],
    };
    const badgeColor = typeColors[ad.type] || [16, 185, 129];
    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    doc.roundedRect(margin + 5, yPos + 5, 30, 7, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont(undefined, 'bold');
    const typeLabels: Record<string, string> = { 'Offer': 'OFERTA', 'Emotional': 'EMOCIONAL', 'Urgency': 'URGENCIA' };
    doc.text(typeLabels[ad.type] || ad.type.toUpperCase(), margin + 8, yPos + 9.5);

    // Score
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(`${ad.score}`, margin + contentWidth - 25, yPos + 12);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(6);
    doc.text('/100', margin + contentWidth - 12, yPos + 12);

    // Headline
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    const headlineLines = doc.splitTextToSize(ad.headline, contentWidth - 20);
    doc.text(headlineLines, margin + 5, yPos + 22);

    // Description
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const descLines = doc.splitTextToSize(ad.description, contentWidth - 20);
    doc.text(descLines, margin + 5, yPos + 35);

    // CTA
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(margin + 5, yPos + 50, 35, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont(undefined, 'bold');
    doc.text(ad.cta, margin + 10, yPos + 55);

    yPos += 75;
  }

  drawPageFooter(4);

  // =============================================
  // PÁGINA 5+: GUÍA DE LANZAMIENTO
  // =============================================
  doc.addPage();
  drawPageHeader();
  yPos = 30;

  // Título
  drawAccentLine(yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('Guía de Lanzamiento Paso a Paso', margin + 50, yPos + 5);
  yPos += 25;

  // Pasos genéricos (simplificados)
  const steps = [
    {
      step: '01',
      title: 'Accede a la plataforma',
      desc: `Ve a ${colors.name} y abre tu cuenta publicitaria. Este es tu centro de control para todas tus campañas.`,
    },
    {
      step: '02',
      title: 'Crea una nueva campaña',
      desc: 'Busca el botón de crear campaña. Selecciona el objetivo que mejor se adapte a tu negocio (Tráfico, Ventas o Conversiones).',
    },
    {
      step: '03',
      title: 'Configura tu presupuesto',
      desc: `Ingresa tu presupuesto diario: $${(data.budget / 30).toFixed(2)} USD. Puedes cambiar esto en cualquier momento.`,
    },
    {
      step: '04',
      title: 'Define tu audiencia',
      desc: `Ubicación: ${data.location}. Audiencia: ${data.idealCustomer}. Deja que la plataforma optimice automáticamente.`,
    },
    {
      step: '05',
      title: 'Sube tus creativos',
      desc: 'Carga la imagen que preparaste y copia los textos (headline, descripción y CTA) del kit que descargaste.',
    },
    {
      step: '06',
      title: 'Revisa y publica',
      desc: 'Revisa la vista previa de tu anuncio. Si todo se ve bien, presiona el botón de publicar. ¡Felicidades!',
    },
  ];

  for (const step of steps) {
    if (yPos > pageHeight - 50) {
      doc.addPage();
      drawPageHeader();
      yPos = 30;
    }

    // Número de paso
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(margin, yPos, 15, 15, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(step.step, margin + 5, yPos + 10);

    // Título
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(step.title, margin + 20, yPos + 7);

    // Descripción
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const descStepLines = doc.splitTextToSize(step.desc, contentWidth - 20);
    doc.text(descStepLines, margin + 20, yPos + 14);

    yPos += 20 + descStepLines.length * 5;
  }

  drawPageFooter(doc.getNumberOfPages());

  // Descargar
  doc.save(`FlowSight-Premium-Kit-${data.platform}-${campaignId}.pdf`);
};
