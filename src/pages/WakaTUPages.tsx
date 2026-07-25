import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { CalendarDays, BookOpen, FileText, Users, Target, Activity, CreditCard, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardWakaKurikulum() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard Waka Kurikulum</h1>
        <p className="text-slate-500 mt-1 text-sm">Selamat datang, {user?.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-800">Jam Mengajar Aktif</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">128 Jam</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-800">Rata-rata Nilai Sekolah</p>
                <p className="text-2xl font-black text-blue-900 mt-1">82.5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-800">Ujian Berlangsung</p>
                <p className="text-2xl font-black text-amber-900 mt-1">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Kurikulum Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">
            <p className="text-slate-500 font-medium text-sm">Tidak ada aktivitas terbaru.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function DashboardWakaKesiswaan() {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Dashboard Waka Kesiswaan</h1>
        <p className="text-slate-500 mt-1 text-sm">Selamat datang, {user?.name}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/kesiswaan/data" className="block">
        <Card className="bg-indigo-50 border-indigo-100 hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-800">Total Siswa Aktif</p>
                <p className="text-2xl font-black text-indigo-900 mt-1">452</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </Link>

        <Card className="bg-rose-50 border-rose-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-rose-800">Pelanggaran Bulan Ini</p>
                <p className="text-2xl font-black text-rose-900 mt-1">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Link to="/kesiswaan/ekskul" className="block">
        <Card className="bg-emerald-50 border-emerald-100 hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-800">Ekskul Aktif</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Kegiatan Kesiswaan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl">
            <p className="text-slate-500 font-medium text-sm">Tidak ada kegiatan kesiswaan terbaru.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

