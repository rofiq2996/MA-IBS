const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const oldTabs = `              ) : (
                <div className={\`grid \${isWalas ? 'grid-cols-2' : 'grid-cols-4'} gap-1 p-1 bg-slate-100 rounded-lg\`}>
                  <button
                    type="button"
                    onClick={() => setReportType('presensi')}
                    className={\`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors \${reportType === 'presensi' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}\`}
                  >
                    Presensi
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportType('nilai')}
                    className={\`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors \${reportType === 'nilai' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}\`}
                  >
                    {isWalas ? 'Sholat Zuhur' : 'Nilai'}
                  </button>
                  {!isWalas && (
                    <>
                      <button
                        type="button"
                        onClick={() => setReportType('jurnal')}
                        className={\`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors \${reportType === 'jurnal' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}\`}
                      >
                        Jurnal
                      </button>
                      <button
                        type="button"
                        onClick={() => setReportType('analisis')}
                        className={\`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors \${reportType === 'analisis' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}\`}
                      >
                        Analisis
                      </button>
                    </>
                  )}
                </div>
              )}`;

const newTabs = `              ) : (
                <div className="flex flex-col gap-1 p-1 bg-slate-100 rounded-lg">
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      type="button"
                      onClick={() => setReportType('presensi')}
                      className={\`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors \${reportType === 'presensi' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}\`}
                    >
                      Presensi
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportType('nilai')}
                      className={\`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors \${reportType === 'nilai' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}\`}
                    >
                      Nilai
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportType('jurnal')}
                      className={\`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors \${reportType === 'jurnal' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}\`}
                    >
                      Jurnal
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportType('analisis')}
                      className={\`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors \${reportType === 'analisis' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}\`}
                    >
                      Analisis
                    </button>
                  </div>
                  {isWalas && (
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        type="button"
                        onClick={() => setReportType('sholat_zuhur')}
                        className={\`py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-tight transition-colors \${reportType === 'sholat_zuhur' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}\`}
                      >
                        Laporan Sholat Zuhur
                      </button>
                    </div>
                  )}
                </div>
              )}`;

file = file.replace(oldTabs, newTabs);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
