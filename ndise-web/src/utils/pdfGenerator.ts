import { jsPDF } from 'jspdf';

interface PersonDetails {
  id: string;
  name: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  passportNumber?: string;
  nationalID?: string;
  email?: string;
  phone?: string;
  address?: string;
  riskScore: number;
  riskLevel: string;
  status: string;
  travelHistory?: Array<{
    date: string;
    location: string;
    type: string;
    checkpoint: string;
  }>;
  alerts?: Array<{
    type: string;
    message: string;
    severity: string;
    date: string;
  }>;
  visaStatus?: {
    type: string;
    status: string;
    expiryDate?: string;
  };
  notes?: string;
}

/**
 * Generate a Border Control verification report PDF
 */
export function generateBorderControlReport(person: PersonDetails): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('BORDER CONTROL VERIFICATION REPORT', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('National Digital Identity System for Empowerment (NDISE)', pageWidth / 2, yPosition, { align: 'center' });

  // Report metadata
  yPosition += 15;
  doc.setTextColor(0);
  doc.setFontSize(9);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 20, yPosition);
  doc.text(`Report ID: RPT-${Date.now()}`, pageWidth - 20, yPosition, { align: 'right' });

  // Separator line
  yPosition += 5;
  doc.setDrawColor(200);
  doc.line(20, yPosition, pageWidth - 20, yPosition);

  // Personal Information Section
  yPosition += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175); // Blue
  doc.text('PERSONAL INFORMATION', 20, yPosition);

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);

  const leftCol = 20;
  const rightCol = pageWidth / 2 + 10;
  const lineHeight = 7;

  doc.setFont('helvetica', 'bold');
  doc.text('Full Name:', leftCol, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(person.name, leftCol + 30, yPosition);

  doc.setFont('helvetica', 'bold');
  doc.text('National ID:', rightCol, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(person.nationalID || 'N/A', rightCol + 30, yPosition);

  yPosition += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Birth:', leftCol, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(person.dateOfBirth, leftCol + 30, yPosition);

  doc.setFont('helvetica', 'bold');
  doc.text('Passport:', rightCol, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(person.passportNumber || 'N/A', rightCol + 30, yPosition);

  yPosition += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Nationality:', leftCol, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(person.nationality, leftCol + 30, yPosition);

  doc.setFont('helvetica', 'bold');
  doc.text('Gender:', rightCol, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(person.gender.toUpperCase(), rightCol + 30, yPosition);

  if (person.email || person.phone) {
    yPosition += lineHeight;
    if (person.email) {
      doc.setFont('helvetica', 'bold');
      doc.text('Email:', leftCol, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(person.email, leftCol + 30, yPosition);
    }
    if (person.phone) {
      doc.setFont('helvetica', 'bold');
      doc.text('Phone:', rightCol, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(person.phone, rightCol + 30, yPosition);
    }
  }

  // Risk Assessment Section
  yPosition += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('RISK ASSESSMENT', 20, yPosition);

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('Risk Level:', leftCol, yPosition);

  // Color code based on risk level
  switch (person.riskLevel) {
    case 'critical':
      doc.setTextColor(220, 38, 38); // Red
      break;
    case 'high':
      doc.setTextColor(249, 115, 22); // Orange
      break;
    case 'medium':
      doc.setTextColor(234, 179, 8); // Yellow
      break;
    case 'low':
      doc.setTextColor(34, 197, 94); // Green
      break;
  }
  doc.text(person.riskLevel.toUpperCase(), leftCol + 30, yPosition);

  doc.setTextColor(0);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Score:', rightCol, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(`${person.riskScore}/100`, rightCol + 30, yPosition);

  yPosition += lineHeight;
  doc.setFont('helvetica', 'bold');
  doc.text('Status:', leftCol, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(person.status.toUpperCase(), leftCol + 30, yPosition);

  // Visa Status Section (if applicable)
  if (person.visaStatus) {
    yPosition += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('VISA STATUS', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Visa Type:', leftCol, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(person.visaStatus.type, leftCol + 30, yPosition);

    doc.setFont('helvetica', 'bold');
    doc.text('Status:', rightCol, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(person.visaStatus.status, rightCol + 30, yPosition);

    if (person.visaStatus.expiryDate) {
      yPosition += lineHeight;
      doc.setFont('helvetica', 'bold');
      doc.text('Expiry Date:', leftCol, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(person.visaStatus.expiryDate, leftCol + 30, yPosition);
    }
  }

  // Security Alerts Section (if any)
  if (person.alerts && person.alerts.length > 0) {
    yPosition += 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38); // Red for alerts
    doc.text('SECURITY ALERTS', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(9);
    doc.setTextColor(0);

    person.alerts.slice(0, 3).forEach((alert, index) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. [${alert.severity.toUpperCase()}] ${alert.type}`, leftCol, yPosition);
      yPosition += 5;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(alert.message, pageWidth - 40);
      doc.text(lines, leftCol + 5, yPosition);
      yPosition += lines.length * 5 + 3;
    });
  }

  // Travel History Section
  if (person.travelHistory && person.travelHistory.length > 0) {
    yPosition += 10;

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('RECENT TRAVEL HISTORY', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(9);
    doc.setTextColor(0);

    person.travelHistory.slice(0, 5).forEach((travel) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${travel.date}`, leftCol, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(`${travel.type.toUpperCase()} - ${travel.location} (${travel.checkpoint})`, leftCol + 25, yPosition);
      yPosition += 6;
    });
  }

  // Notes Section (if any)
  if (person.notes) {
    yPosition += 10;

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(220, 38, 38);
    doc.text('⚠ OFFICER NOTES', 20, yPosition);

    yPosition += 8;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    const noteLines = doc.splitTextToSize(person.notes, pageWidth - 40);
    doc.text(noteLines, leftCol, yPosition);
    yPosition += noteLines.length * 6;
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(200);
  doc.line(20, footerY, pageWidth - 20, footerY);

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.setFont('helvetica', 'italic');
  doc.text('This report is confidential and for official use only.', pageWidth / 2, footerY + 5, { align: 'center' });
  doc.text('Generated by NDISE Border Control System', pageWidth / 2, footerY + 10, { align: 'center' });

  // Save the PDF
  const filename = `BorderReport_${person.nationalID || person.id}_${Date.now()}.pdf`;
  doc.save(filename);
}

/**
 * Generate a Police report PDF
 */
export function generatePoliceReport(person: any): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('POLICE INVESTIGATION REPORT', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('National Digital Identity System for Empowerment (NDISE)', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  doc.setTextColor(0);
  doc.setFontSize(9);
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 20, yPosition);
  doc.text(`Case ID: CASE-${Date.now()}`, pageWidth - 20, yPosition, { align: 'right' });

  // Rest of report similar structure
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Subject Information', 20, yPosition);

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${person.name || 'N/A'}`, 20, yPosition);
  yPosition += 7;
  doc.text(`National ID: ${person.nationalId || 'N/A'}`, 20, yPosition);
  yPosition += 7;
  doc.text(`Date of Birth: ${person.dateOfBirth || 'N/A'}`, 20, yPosition);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(200);
  doc.line(20, footerY, pageWidth - 20, footerY);

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text('Confidential - Police Use Only', pageWidth / 2, footerY + 5, { align: 'center' });

  const filename = `PoliceReport_${person.nationalId || Date.now()}.pdf`;
  doc.save(filename);
}
