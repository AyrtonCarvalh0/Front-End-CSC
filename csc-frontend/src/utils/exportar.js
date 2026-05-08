import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export function exportarPDF({ titulo, colunas, dados, nomeArquivo }) {
  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.setTextColor(40, 40, 40)
  doc.text('CSC — Sistema Escolar', 14, 18)

  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(titulo, 14, 27)

  doc.setFontSize(9)
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
    14, 34
  )

  doc.setDrawColor(200, 200, 200)
  doc.line(14, 37, 196, 37)

  autoTable(doc, {
    startY: 42,
    head: [colunas.map(c => c.header)],
    body: dados.map(row => colunas.map(c => c.accessor(row))),
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [79, 124, 255],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 250],
    },
    margin: { left: 14, right: 14 },
  })

  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }

  doc.save(`${nomeArquivo}.pdf`)
}

export function exportarExcel({ titulo, colunas, dados, nomeArquivo }) {
  const cabecalho = colunas.map(c => c.header)
  const linhas = dados.map(row => colunas.map(c => c.accessor(row)))

  const ws = XLSX.utils.aoa_to_sheet([cabecalho, ...linhas])
  const wb = XLSX.utils.book_new()

  ws['!cols'] = colunas.map(() => ({ wch: 22 }))

  XLSX.utils.book_append_sheet(wb, ws, titulo.substring(0, 31))

  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  saveAs(
    new Blob([buf], { type: 'application/octet-stream' }),
    `${nomeArquivo}.xlsx`
  )
}
