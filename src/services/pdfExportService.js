/**
 * Export the resume preview element as a formatted PDF file
 * @param {HTMLElement|string} elementOrId 
 * @param {string} candidateName 
 * @returns {Promise<void>}
 */
export async function exportResumeToPDF(elementOrId, candidateName = 'Resume') {
  const targetElement = typeof elementOrId === 'string'
    ? document.getElementById(elementOrId)
    : elementOrId

  if (!targetElement) {
    throw new Error('Resume preview element not found for PDF generation.')
  }

  // Dynamically load html2pdf.js on demand
  const html2pdfModule = await import('html2pdf.js')
  const html2pdf = html2pdfModule.default || html2pdfModule

  // Format safe filename
  const cleanName = candidateName
    ? candidateName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_')
    : 'my'
  const filename = `${cleanName}_resume.pdf`

  const opt = {
    margin: [8, 8, 8, 8], // mm
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['css', 'legacy']
    }
  }

  return html2pdf().set(opt).from(targetElement).save()
}
