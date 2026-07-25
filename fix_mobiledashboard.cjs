const fs = require('fs');
let content = fs.readFileSync('src/pages/MobileDashboard.tsx', 'utf8');

const oldCode = `        const res = await apiClient('/announcements.php', { headers: { 'Accept': 'application/json' } });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          setAnnouncements(data);
        } else {
          console.log('API returned non-JSON or failed, showing no announcements.');
          setAnnouncements([]);
        }`;
const newCode = `        const data = await apiClient('/announcements.php');
        setAnnouncements(data);`;

content = content.replace(oldCode, newCode);

fs.writeFileSync('src/pages/MobileDashboard.tsx', content);
