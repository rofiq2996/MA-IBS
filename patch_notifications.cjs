const fs = require('fs');
let content = fs.readFileSync('src/pages/Notifications.tsx', 'utf8');

// Add useNavigate to imports
if (!content.includes("import { useNavigate }")) {
  content = content.replace("import React, { useEffect, useState } from 'react';", "import React, { useEffect, useState } from 'react';\nimport { useNavigate } from 'react-router-dom';");
}

// Add navigate hook and click handler
const handlerCode = `
  const navigate = useNavigate();

  const handleNotificationClick = async (notif: any) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }
    
    const lowerTitle = (notif.title || '').toLowerCase();
    const lowerMsg = (notif.message || '').toLowerCase();
    const role = user?.roles?.[0] || user?.role || '';
    
    if (notif.link) {
      navigate(notif.link);
      return;
    }

    if (lowerTitle.includes('reset password') || lowerMsg.includes('reset password')) {
      navigate('/users');
    } else if (lowerTitle.includes('izin') || lowerTitle.includes('perizinan')) {
      if (['admin', 'kamad', 'wakatu'].includes(role)) {
        navigate('/kamad/perizinan');
      } else {
        navigate('/leave');
      }
    } else if (lowerTitle.includes('pengumuman')) {
      if (role === 'admin') navigate('/admin/announcements');
      else navigate('/');
    } else if (lowerTitle.includes('jadwal')) {
      if (['admin', 'wakakur'].includes(role)) navigate('/admin/jadwal');
      else navigate('/jadwal-mengajar');
    } else if (lowerTitle.includes('tugas') || lowerTitle.includes('materi')) {
      navigate('/lms-tugas');
    } else if (lowerTitle.includes('absen') || lowerTitle.includes('hadir')) {
      navigate('/absensi');
    } else if (lowerTitle.includes('nilai')) {
      navigate('/input-nilai');
    } else if (lowerTitle.includes('pelanggaran') || lowerTitle.includes('kasus')) {
      if (role === 'admin' || role === 'kesiswaan') navigate('/kesiswaan/prestasi');
      else navigate('/kuratif');
    } else {
      // Default action: just stay on notifications
    }
  };
`;

if (!content.includes('const navigate = useNavigate();')) {
  content = content.replace('  const { user } = useAuth();', '  const { user } = useAuth();' + handlerCode);
}

content = content.replace(/onClick=\{[^}]*\}/, 'onClick={() => handleNotificationClick(notif)}');

fs.writeFileSync('src/pages/Notifications.tsx', content);
