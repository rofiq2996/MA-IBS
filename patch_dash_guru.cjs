const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardGuru.tsx', 'utf8');

if (!code.includes("import { apiClient }")) {
  code = code.replace("import { useAuth } from '../context/AuthContext';", "import { useAuth } from '../context/AuthContext';\nimport { apiClient } from '../lib/apiClient';\nimport { useState, useEffect } from 'react';");
}

const targetStr = `export function DashboardGuru() {
  const { user } = useAuth();
  const navigate = useNavigate();`;

const replaceStr = `export function DashboardGuru() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await apiClient('/crud.php?table=schedules');
        if (Array.isArray(data)) {
          // Filter by teacher_id and today's day
          const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          const today = days[new Date().getDay()];
          const mySchedules = data.filter((d: any) => String(d.teacher_id) === String(user?.id) && d.day === today);
          
          const mapped = mySchedules.map((d: any) => ({
            time: (d.start_time?.substring(0,5) || '') + ' - ' + (d.end_time?.substring(0,5) || ''),
            class: d.class_name,
            subject: d.subject_name
          }));
          
          // Sort by start time
          mapped.sort((a, b) => a.time.localeCompare(b.time));
          setSchedules(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch schedules', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchSchedules();
  }, [user]);`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/DashboardGuru.tsx', code);
