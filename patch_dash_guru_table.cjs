const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardGuru.tsx', 'utf8');

const targetStr = `                <tbody className="text-sm">
                  {[
                    { time: '07:30 - 09:00', class: 'X-IPA 1', subject: 'Matematika Wajib', status: 'Selesai' },
                    { time: '09:15 - 10:45', class: 'XI-IPA 3', subject: 'Matematika Peminatan', status: 'Berlangsung' },
                    { time: '11:00 - 12:30', class: 'XII-IPS 2', subject: 'Matematika Dasar', status: 'Belum Mulai' },
                  ].map((schedule, i) => {`;

const replaceStr = `                <tbody className="text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">Memuat jadwal...</td>
                    </tr>
                  ) : schedules.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500">Tidak ada jadwal mengajar hari ini.</td>
                    </tr>
                  ) : schedules.map((schedule, i) => {`;

code = code.replace(targetStr, replaceStr);

fs.writeFileSync('src/pages/DashboardGuru.tsx', code);
