import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Book, Plus, Search, Check, FileCheck } from 'lucide-react';

export function GuruQuranHafalan() {
  const [search, setSearch] = useState('');
  
  const studentList = [
    { id: 1, name: 'Ahmad Fauzi', nis: '10112233', class: 'XII-IPA 1', target: '3 Juz', achieved: '2 Juz' },
    { id: 2, name: 'Siti Nurhaliza', nis: '10112244', class: 'X-1', target: '1 Juz', achieved: 'Surah Al-Mulk' },
    { id: 3, name: 'Rizky Ramadhan', nis: '10112277', class: 'XI-IPS 2', target: '2 Juz', achieved: '1.5 Juz' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Input Setoran Hafalan & Tahfiz</h1>
          <p className="text-sm text-slate-500">Catat capaian tahfiz siswa secara berkala</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Siswa Dibimbing', value: '45', bg: 'bg-blue-50', text: 'text-blue-600', icon: Book },
          { label: 'Setoran Hari Ini', value: '12', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: Check },
          { label: 'Rata-rata Hafalan', value: '1.2 Juz', bg: 'bg-amber-50', text: 'text-amber-600', icon: FileCheck },
          { label: 'Pencapaian Target', value: '68%', bg: 'bg-purple-50', text: 'text-purple-600', icon: Plus },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.text} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Daftar Siswa Bimbingan Tahfiz</CardTitle>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari siswa atau NIS..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none w-full md:w-64"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Siswa / NIS</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Target Tahunan</th>
                  <th className="px-4 py-3">Capaian Saat Ini</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.nis}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{item.class}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{item.target}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">{item.achieved}</td>
                    <td className="px-4 py-3 text-right">
                      <button className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors">
                        Input Setoran
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
