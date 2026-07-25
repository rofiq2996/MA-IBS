const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardOrtu.tsx', 'utf8');

const targetContentRegex = /\s*\{\/\* Daftar Anak Lintas Kelas \(X, XI, XII\) \*\/\}\s*<h2[\s\S]*?<\/div>\s*<\/div>\s*\);\s*\}/;

const replacementContent = `

      {/* Agenda & Pengingat Terdekat */}
      <h2 className="text-lg font-bold tracking-tight text-slate-800 mt-8 mb-4">Agenda & Pengingat Terdekat</h2>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {[
              { date: '15 Nov 2026', title: 'Pembagian Raport Tengah Semester', type: 'Akademik', color: 'text-blue-600', bg: 'bg-blue-100' },
              { date: '20 Nov 2026', title: 'Pertemuan Paguyuban Orang Tua (POTM)', type: 'Pertemuan', color: 'text-emerald-600', bg: 'bg-emerald-100' },
              { date: '25 Nov 2026', title: 'Batas Akhir Pengumpulan Tugas Karya Tulis', type: 'Tugas', color: 'text-amber-600', bg: 'bg-amber-100' },
            ].map((agenda, idx) => (
              <div key={idx} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-14 text-center shrink-0">
                  <span className="block text-xl font-black text-slate-800 leading-none">{agenda.date.split(' ')[0]}</span>
                  <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{agenda.date.split(' ')[1]}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{agenda.title}</h3>
                  <span className={\`inline-block mt-1 px-2 py-0.5 \${agenda.bg} \${agenda.color} text-[10px] font-bold uppercase rounded-md\`}>
                    {agenda.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;

code = code.replace(targetContentRegex, replacementContent);
fs.writeFileSync('src/pages/DashboardOrtu.tsx', code);
console.log("Patched DashboardOrtu.tsx");
