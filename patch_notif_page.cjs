const fs = require('fs');
let code = fs.readFileSync('src/pages/Notifications.tsx', 'utf8');

const newCode = `import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/apiClient';

export function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      apiClient(\`/notifications/\${user.id}\`)
        .then(data => {
          if (Array.isArray(data)) {
            setNotifications(data);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user?.id]);

  const markAsRead = async (id: number) => {
    try {
      await apiClient(\`/notifications/\${id}/read\`, { method: 'POST' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (e) {}
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBg = (type: string) => {
    switch(type) {
      case 'warning': return 'bg-amber-50';
      case 'success': return 'bg-emerald-50';
      default: return 'bg-blue-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 sm:pb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Notifikasi</h1>
        <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{unreadCount} Baru</span>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Memuat notifikasi...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Tidak ada notifikasi</div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                onClick={() => !notif.is_read && markAsRead(notif.id)}
                className={\`p-4 sm:p-5 flex gap-4 transition-colors hover:bg-slate-50 cursor-pointer \${!notif.is_read ? 'bg-emerald-50/30' : ''}\`}
              >
                <div className={\`w-8 h-8 rounded-full flex items-center justify-center shrink-0 \${getBg(notif.type)}\`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={\`font-bold text-sm text-slate-800 truncate \${!notif.is_read ? 'text-emerald-800' : ''}\`}>{notif.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap shrink-0 uppercase tracking-wider">
                      {format(new Date(notif.created_at || new Date()), 'dd MMM, HH:mm', { locale: id })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Notifications.tsx', newCode);
console.log("Patched Notifications.tsx");
