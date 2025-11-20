// Export utilities for data tables

/**
 * Export data to CSV format
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; header: string }[]
) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Determine columns
  const cols = columns || Object.keys(data[0]).map(key => ({ key, header: key }));

  // Create CSV header
  const headers = cols.map(col => col.header).join(',');

  // Create CSV rows
  const rows = data.map(row =>
    cols
      .map(col => {
        const value = row[col.key];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      })
      .join(',')
  );

  // Combine header and rows
  const csv = [headers, ...rows].join('\n');

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export data to Excel format (using CSV as fallback)
 * In production, use a library like xlsx for true Excel format
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; header: string }[]
) {
  // For now, export as CSV with .xlsx extension
  // In production, use xlsx library for proper Excel format
  exportToCSV(data, filename, columns);
}

/**
 * Export data to PDF format
 * This is a placeholder - in production, use jsPDF or similar
 */
export function exportToPDF<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; header: string }[],
  title?: string
) {
  console.log('PDF export not yet implemented');
  console.log('Data:', data);
  console.log('Filename:', filename);
  console.log('Columns:', columns);
  console.log('Title:', title);

  // TODO: Implement PDF export using jsPDF
  // For now, fallback to CSV
  alert('PDF export coming soon! Downloading as CSV instead.');
  exportToCSV(data, filename, columns);
}

/**
 * Format data for export (remove internal fields, format dates, etc.)
 */
export function prepareDataForExport<T extends Record<string, any>>(
  data: T[],
  excludeFields: string[] = []
): T[] {
  return data.map(row => {
    const cleaned: any = {};
    Object.keys(row).forEach(key => {
      if (!excludeFields.includes(key)) {
        const value = row[key];
        // Format dates
        if (value instanceof Date) {
          cleaned[key] = value.toISOString().split('T')[0];
        }
        // Format objects
        else if (typeof value === 'object' && value !== null) {
          cleaned[key] = JSON.stringify(value);
        }
        // Keep primitives
        else {
          cleaned[key] = value;
        }
      }
    });
    return cleaned as T;
  });
}
