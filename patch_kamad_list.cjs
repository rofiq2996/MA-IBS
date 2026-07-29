const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const oldList = `                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {staf.tasks.map((task: any, idx: number) => {
                      let statusStyle = "";
                      let TaskIcon = CheckCircle2;
                      if (task.status === 'selesai') {
                        statusStyle = "bg-emerald-50 border-emerald-100 text-emerald-700";
                        TaskIcon = CheckCircle2;
                      } else if (task.status === 'terlewat') {
                        statusStyle = "bg-rose-50 border-rose-100 text-rose-700";
                        TaskIcon = XCircle;
                      } else {
                        statusStyle = "bg-amber-50 border-amber-100 text-amber-700";
                        TaskIcon = Clock;
                      }
                      return (
                        <div key={idx} className={\`p-3 rounded-xl border flex items-center gap-3 \${statusStyle}\`}>
                          <TaskIcon className="w-4 h-4 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{task.name}</p>
                            <p className="text-[10px] mt-0.5">{task.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>`;

const newList = `                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs font-bold gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50 w-full sm:w-auto"
                      onClick={() => setSelectedStaf(staf)}
                    >
                      <Eye className="w-4 h-4" />
                      View Jobdesk
                    </Button>
                  </div>`;

code = code.replace(oldList, newList);
fs.writeFileSync('src/pages/KamadPages.tsx', code);
