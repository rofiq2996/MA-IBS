import { apiClient } from '../../lib/apiClient';
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './Card';
import { Megaphone, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Announcement {
  id: string;
  title: string;
  content: string;
  target: 'Semua' | 'Guru' | 'Wali Murid';
  category: 'Penting' | 'Akademik' | 'Kegiatan';
  date: string;
  isPublished: boolean;
}

export function UserAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const data = await apiClient('/announcements.php');
        if (Array.isArray(data)) {
          let active = data.filter(a => a.isPublished !== false && a.status !== 'Draft');
          
          if (user?.role === 'siswa') {
            active = active.filter(a => a.target === 'Semua');
          } else if (user?.role === 'guru' || user?.role === 'walas' || user?.role === 'bk' || user?.role === 'pustaka' || user?.role === 'wakatu' || user?.role === 'kamad') {
            active = active.filter(a => a.target === 'Semua' || a.target === 'Guru');
          } else if (user?.role === 'ortu') {
            active = active.filter(a => a.target === 'Semua' || a.target === 'Wali Murid');
          }
          
          active.sort((a, b) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime());
          setAnnouncements(active);
        }
      } catch (e) {
        console.error('Failed to fetch announcements:', e);
      }
    };
    
    fetchAnnouncements();
  }, [user]);

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-6">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-emerald-600" /> Pengumuman Terbaru
      </h2>
      {/* Container wrapper for horizontal scrolling on mobile, grid on md+ */}
      <div className="flex overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {announcements.map((ann) => (
          <Card key={ann.id} className="snap-center shrink-0 w-[85vw] md:w-auto border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30 shadow-sm relative overflow-hidden">
            {ann.category === 'Penting' && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full pointer-events-none" />
            )}
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  {ann.category === 'Penting' ? (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" /> Penting
                    </span>
                  ) : (
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      ann.category === 'Akademik' ? 'text-blue-600 bg-blue-100' : 'text-purple-600 bg-purple-100'
                    }`}>
                      {ann.category}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {new Date(ann.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 leading-snug mb-1">{ann.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{ann.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
