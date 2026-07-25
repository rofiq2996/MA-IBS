const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const oldCode = `  const downloadKinerjaPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(\`Laporan Kinerja Staf - \${reportPeriod}\`, 14, 20);
    doc.setFontSize(10);
    doc.text(\`Dicetak pada: \${new Date().toLocaleDateString('id-ID')}\`, 14, 28);
    
    const tableData = stafList.map(staf => {
      const selesai = staf.tasks.filter(t => t.status === 'selesai').length;
      const total = staf.tasks.length;
      const pelanggaran = staf.tasks.filter(t => t.status === 'terlewat').length;
      return [
        staf.name,
        staf.role,
        staf.kelas || '-',
        \`\${selesai}/\${total} Selesai\`,
        pelanggaran > 0 ? 'Ada Pelanggaran' : 'Baik'
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [['Nama Staf', 'Role', 'Kelas', 'Penyelesaian', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });

    doc.save(\`Laporan_Kinerja_Staf_\${reportPeriod.replace(/ /g, '_')}.pdf\`);
  };

  const downloadKinerjaExcel = () => {
    const data = stafList.map(staf => {
      const selesai = staf.tasks.filter(t => t.status === 'selesai').length;
      const total = staf.tasks.length;
      const pelanggaran = staf.tasks.filter(t => t.status === 'terlewat').length;
      return {
        'Nama Staf': staf.name,
        'Role': staf.role,
        'Kelas': staf.kelas || '-',
        'Penyelesaian': \`\${selesai} dari \${total}\`,
        'Status': pelanggaran > 0 ? 'Ada Pelanggaran' : 'Baik'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kinerja Staf");
    XLSX.writeFile(workbook, \`Laporan_Kinerja_Staf_\${reportPeriod.replace(/ /g, '_')}.xlsx\`);
  };`;

const newCode = `  const downloadKinerjaPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(\`Laporan Kinerja Staf - \${reportPeriod}\`, 14, 20);
    doc.setFontSize(10);
    doc.text(\`Dicetak pada: \${new Date().toLocaleDateString('id-ID')}\`, 14, 28);
    
    const tableData = stafList.map(staf => {
      const selesai = staf.tasks.filter(t => t.status === 'selesai').length;
      const total = staf.tasks.length;
      const persentase = total > 0 ? Math.round((selesai / total) * 100) : 0;
      const pelanggaranTasks = staf.tasks.filter(t => t.status === 'terlewat').map(t => t.name);
      const statusText = pelanggaranTasks.length > 0 ? \`Pelanggaran: \${pelanggaranTasks.join(', ')}\` : 'Baik';

      return [
        staf.name,
        staf.role,
        staf.kelas || '-',
        \`\${persentase}% (\${selesai}/\${total})\`,
        statusText
      ];
    });

    autoTable(doc, {
      startY: 35,
      head: [['Nama Staf', 'Role', 'Kelas', 'Persentase', 'Status / Pelanggaran']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      columnStyles: {
        4: { cellWidth: 50 }
      }
    });

    doc.save(\`Laporan_Kinerja_Staf_\${reportPeriod.replace(/ /g, '_')}.pdf\`);
  };

  const downloadKinerjaExcel = () => {
    const data = stafList.map(staf => {
      const selesai = staf.tasks.filter(t => t.status === 'selesai').length;
      const total = staf.tasks.length;
      const persentase = total > 0 ? Math.round((selesai / total) * 100) : 0;
      const pelanggaranTasks = staf.tasks.filter(t => t.status === 'terlewat').map(t => t.name);
      
      return {
        'Nama Staf': staf.name,
        'Role': staf.role,
        'Kelas': staf.kelas || '-',
        'Persentase': \`\${persentase}% (\${selesai} dari \${total})\`,
        'Status / Pelanggaran': pelanggaranTasks.length > 0 ? \`Pelanggaran: \${pelanggaranTasks.join(', ')}\` : 'Baik'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Kinerja Staf");
    XLSX.writeFile(workbook, \`Laporan_Kinerja_Staf_\${reportPeriod.replace(/ /g, '_')}.xlsx\`);
  };`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/pages/KamadPages.tsx', code);
