import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { mockUsers, mockStudents, mockClasses , mockSubjects } from '../data/mock';
import { Edit2, Trash2, Plus, Search, X, Users, Check, AlertCircle, Download, Upload } from 'lucide-react';
import { User, Role } from '../types';
import { CustomSelect } from '../components/ui/CustomSelect';
import { UserAvatar } from '../components/ui/UserAvatar';
import bcrypt from 'bcryptjs';
import * as XLSX from 'xlsx';

export function AdminUsers() {
  const [activeTab, setActiveTab] = useState<'guru_tendik' | 'ortu' | 'siswa'>('guru_tendik');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loaded & persisted lists
  const [users, setUsers] = useState<User[]>(mockUsers);

  const [students] = useState(mockStudents);

  const [classes] = useState(mockClasses);

  // Modal / Form Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [userName, setUserName] = useState('');
  const [userUsername, setUserUsername] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRoles, setUserRoles] = useState<Role[]>(['guru']);
  const [userGender, setUserGender] = useState<'L' | 'P' | ''>('');
  const [userClassName, setUserClassName] = useState('');
  const [userChildId, setUserChildId] = useState('');
  const [userSubjects, setUserSubjects] = useState<{ id: string; subjectName: string; className: string }[]>([]);
  const [tempSubjectName, setTempSubjectName] = useState('');
  const [tempClassName, setTempClassName] = useState('');

  
  const [subjectOptions, setSubjectOptions] = useState<{value: string, label: string}[]>([]);
  const [classOptions, setClassOptions] = useState<{value: string, label: string}[]>([]);
  
  useEffect(() => {
    let sOpts = [
      { value: 'Matematika Peminatan', label: 'Matematika Peminatan' },
      { value: 'Matematika Wajib', label: 'Matematika Wajib' },
      { value: 'Tahfidz Al-Quran', label: 'Tahfidz Al-Quran' }
    ];
    
    setSubjectOptions(sOpts);
    
    let cOpts = [
      { value: 'X-IPA 1', label: 'X-IPA 1' },
      { value: 'X-IPA 2', label: 'X-IPA 2' }
    ];
    
    setClassOptions(cOpts);
  }, []);
  

  const handleAddTempSubject = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!tempSubjectName || !tempClassName) return;
    setUserSubjects([
      ...userSubjects,
      { id: Date.now().toString(), subjectName: tempSubjectName, className: tempClassName }
    ]);
    setTempSubjectName('');
    setTempClassName('');
  };

  const handleRemoveTempSubject = (id: string) => {
    setUserSubjects(userSubjects.filter(s => s.id !== id));
  };

  // Validation / Feedback messages
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Synchronize state changes to localStorage
  useEffect(() => {
    
  }, [users]);

  // Clear feedback automatically
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Download Excel Template for Guru & Tendik
  const downloadTemplate = () => {
    const templateData = [
      {
        "Nama Lengkap": "Ahmad Fauzi, S.Pd",
        "Username": "ahmadfauzi",
        "Password": "12345",
        "Peran Utama": "guru",
        "Jenis Kelamin (L/P)": "L",
        "Wali Kelas": "",
        "Mata Pelajaran": "Matematika Wajib",
      },
      {
        "Nama Lengkap": "Siti Nurhaliza, M.Pd",
        "Username": "sitinurhaliza",
        "Password": "12345",
        "Peran Utama": "walas",
        "Jenis Kelamin (L/P)": "P",
        "Wali Kelas": "X-IPA 1",
        "Mata Pelajaran": "Bahasa Indonesia",
      },
      {
        "Nama Lengkap": "Drs. Ahmad Dahlan",
        "Username": "ahmaddahlan",
        "Password": "12345",
        "Peran Utama": "kamad",
        "Jenis Kelamin (L/P)": "L",
        "Wali Kelas": "",
        "Mata Pelajaran": "",
      },
      {
        "Nama Lengkap": "Dina, S.Psi",
        "Username": "dina",
        "Password": "12345",
        "Peran Utama": "bk",
        "Jenis Kelamin (L/P)": "P",
        "Wali Kelas": "",
        "Mata Pelajaran": "Bimbingan Konseling",
      },
      {
        "Nama Lengkap": "Ust. Umar, S.Pd.I",
        "Username": "ustumar",
        "Password": "12345",
        "Peran Utama": "guru_quran",
        "Jenis Kelamin (L/P)": "L",
        "Wali Kelas": "",
        "Mata Pelajaran": "Tahfidz Al-Quran",
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    worksheet['!cols'] = [
      { wch: 25 }, // Nama Lengkap
      { wch: 18 }, // Username
      { wch: 15 }, // Password
      { wch: 20 }, // Peran Utama
      { wch: 18 }, // Jenis Kelamin
      { wch: 18 }, // Wali Kelas
      { wch: 25 }, // Mata Pelajaran
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Guru & Tendik");
    XLSX.writeFile(workbook, "Template_Import_Guru_Tendik.xlsx");
  };

  // Upload Excel Data for Guru & Tendik
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        if (!data || data.length === 0) {
          setFeedback({ type: 'error', message: 'File Excel kosong atau format tidak sesuai.' });
          return;
        }

        const newUsers: User[] = [];
        let successCount = 0;

        data.forEach((row, index) => {
          const rawName = String(row['Nama Lengkap'] || row['Nama'] || row['nama'] || '').trim();
          if (!rawName) return;

          let rawUsername = String(row['Username'] || row['username'] || '').trim();
          if (!rawUsername) {
            let currentUsername = rawName.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
            let finalUsername = currentUsername;
            let counter = 1;
            while (users.some(u => u.username === finalUsername) || newUsers.some(u => u.username === finalUsername)) {
              finalUsername = `${currentUsername}${counter}`;
              counter++;
            }
            rawUsername = finalUsername;
          }

          const rawPassword = String(row['Password'] || row['password'] || '12345').trim();
          const hashedPassword = bcrypt.hashSync(rawPassword, 10);

          let rawRole = String(row['Peran Utama'] || row['Peran'] || row['Role'] || row['role'] || 'guru').trim().toLowerCase();

          const validRoles: Role[] = ['guru', 'walas', 'kamad', 'admin', 'wakakurikulum', 'wakakesiswaan', 'bk', 'pustaka', 'guru_quran', 'ortu', 'siswa'];
          const parsedRoles: Role[] = [];

          if (rawRole.includes('walas') || rawRole.includes('wali')) {
            parsedRoles.push('walas');
            parsedRoles.push('guru');
          }
          if (rawRole.includes('kurikulum')) {
            parsedRoles.push('wakakurikulum');
            parsedRoles.push('guru');
          }
          if (rawRole.includes('kesiswaan')) {
            parsedRoles.push('wakakesiswaan');
            parsedRoles.push('guru');
          }
          if (rawRole.includes('kamad') || rawRole.includes('kepala')) {
            parsedRoles.push('kamad');
          }
          if (rawRole.includes('bk') || rawRole.includes('konseling')) {
            parsedRoles.push('bk');
          }
          if (rawRole.includes('pustaka') || rawRole.includes('perpustakaan')) {
            parsedRoles.push('pustaka');
          }
          if (rawRole.includes('quran') || rawRole.includes('tahfidz')) {
            parsedRoles.push('guru_quran');
          }
          if (rawRole.includes('admin')) {
            parsedRoles.push('admin');
          }
          if (rawRole.includes('guru') && !parsedRoles.includes('guru')) {
            parsedRoles.push('guru');
          }

          if (parsedRoles.length === 0) {
            const parts = rawRole.split(/[,;]/).map(p => p.trim());
            parts.forEach(p => {
              if (validRoles.includes(p as Role)) {
                parsedRoles.push(p as Role);
              }
            });
          }

          if (parsedRoles.length === 0) {
            parsedRoles.push('guru');
          }

          const uniqueRoles = Array.from(new Set(parsedRoles));
          let matchedRole: Role = uniqueRoles[0];
          if (uniqueRoles.includes('walas')) matchedRole = 'walas';
          else if (uniqueRoles.includes('wakakurikulum')) matchedRole = 'wakakurikulum';
          else if (uniqueRoles.includes('wakakesiswaan')) matchedRole = 'wakakesiswaan';

          const rawGender = String(row['Jenis Kelamin (L/P)'] || row['Jenis Kelamin'] || row['JK'] || row['gender'] || 'L').trim().toUpperCase();
          const gender: 'L' | 'P' = rawGender.startsWith('P') ? 'P' : 'L';

          const className = String(row['Wali Kelas'] || row['Kelas'] || row['kelas'] || '').trim();
          const rawSubject = String(row['Mata Pelajaran'] || row['Mapel'] || row['mapel'] || '').trim();

          let subjectsList: { id: string; subjectName: string; className: string }[] | undefined = undefined;
          if (rawSubject) {
            subjectsList = rawSubject.split(';').map((sName, sIdx) => ({
              id: String(Date.now() + index * 10 + sIdx),
              subjectName: sName.trim(),
              className: className || 'Semua Kelas',
            }));
          }

          const newUser: User = {
            id: String(Date.now() + index * 10 + Math.floor(Math.random() * 1000)),
            name: rawName,
            username: rawUsername,
            password: hashedPassword,
            role: matchedRole,
            roles: uniqueRoles,
            gender,
            className: matchedRole === 'walas' ? className : undefined,
            subjects: subjectsList,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(rawName)}`,
          };

          newUsers.push(newUser);
          successCount++;
        });

        if (successCount > 0) {
          const updatedList = [...users, ...newUsers];
          setUsers(updatedList);
          mockUsers.splice(0, mockUsers.length, ...updatedList);
          
          setFeedback({ type: 'success', message: `Berhasil mengimpor ${successCount} akun Guru & Tendik dari file Excel.` });
        } else {
          setFeedback({ type: 'error', message: 'Tidak ada data valid yang dapat diimpor dari file Excel.' });
        }
      } catch (err) {
        console.error("Upload Excel Error:", err);
        setFeedback({ type: 'error', message: 'Gagal memproses file Excel. Pastikan format file sesuai.' });
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const openAddModal = () => {
    setEditingId(null);
    setUserName('');
    setUserUsername('');
    setUserPassword('');
    setUserRoles(['guru']);
    setUserGender('');
    setUserClassName('');
    setUserChildId('');
    setUserSubjects([]);
    setTempSubjectName('');
    setTempClassName('');
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingId(u.id);
    setUserName(u.name);
    setUserUsername(u.username || '');
    setUserPassword('');
    setUserRoles(u.roles && u.roles.length > 0 ? u.roles : [u.role]);
    setUserGender(u.gender || '');
    setUserClassName(u.className || '');
    setUserChildId(u.childId || '');
    setUserSubjects(u.subjects || []);
    setTempSubjectName('');
    setTempClassName('');
    setIsModalOpen(true);
  };

  const confirmDeleteUser = () => {
    if (deleteConfirmId) {
      const updated = users.filter(u => u.id !== deleteConfirmId);
      setUsers(updated);
      mockUsers.splice(0, mockUsers.length, ...updated);
      setDeleteConfirmId(null);
      setFeedback({ type: 'success', message: 'Data pengguna berhasil dihapus.' });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) {
      setFeedback({ type: 'error', message: 'Nama lengkap wajib diisi.' });
      return;
    }

    let childName = undefined;
    if (userRoles.includes('ortu') && userChildId) {
      const child = students.find((s: any) => s.id === userChildId);
      if (child) childName = child.name;
    }

    if (userRoles.length === 0) {
      setFeedback({ type: 'error', message: 'Minimal pilih satu peran pengguna.' });
      return;
    }

    
    let generatedUsername = userUsername.trim();
    if (!editingId) {
      const nameParts = userName.trim().split(' ').filter(Boolean);
      generatedUsername = nameParts[0].toLowerCase();

      // Check if user is staff (guru/pendidik)
      const isStaff = userRoles.some(r => r !== 'ortu' && r !== 'siswa');

      if (isStaff) {
        let currentUsername = generatedUsername;
        let counter = 1;
        let finalUsername = currentUsername;
        while (users.some(u => u.username === finalUsername)) {
          finalUsername = `${currentUsername}${counter}`;
          counter++;
        }
        generatedUsername = finalUsername;
      }
    }
    
    // As requested: password default 12345
    const hashedPassword = bcrypt.hashSync(userPassword.trim() || '12345', 10);
  

    let updatedList: User[] = [];
    if (editingId) {
      // Edit Mode
      updatedList = users.map(u => {
        if (u.id === editingId) {
          return {
            ...u,
            name: userName.trim(),
            username: generatedUsername,
            password: userPassword.trim() ? hashedPassword : u.password,
            role: userRoles[0],
            roles: userRoles,
            gender: userGender || undefined,
            className: userRoles.includes('walas') ? userClassName : undefined,
            childId: userRoles.includes('ortu') ? userChildId : undefined,
            childName: userRoles.includes('ortu') ? childName : undefined,
            subjects: userRoles.some(r => ['guru', 'walas', 'guru_quran'].includes(r)) ? userSubjects : undefined,
          };
        }
        return u;
      });
    } else {
      // Add Mode
      const newUser: User = {
        id: String(Date.now()),
        name: userName.trim(),
        username: generatedUsername,
        password: hashedPassword,
        role: userRoles[0],
        roles: userRoles,
        gender: userGender || undefined,
        className: userRoles.includes('walas') ? userClassName : undefined,
        childId: userRoles.includes('ortu') ? userChildId : undefined,
        childName: userRoles.includes('ortu') ? childName : undefined,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
      };
      updatedList = [...users, newUser];
    }
    
    setUsers(updatedList);
    mockUsers.splice(0, mockUsers.length, ...updatedList);
    setIsModalOpen(false);
    setFeedback({ type: 'success', message: `Data pengguna berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}.` });
  };

  const filteredUsers = users.filter(u => {
    let matchTab = false;
    const userRolesList = u.roles && u.roles.length > 0 ? u.roles : [u.role];
    if (activeTab === 'guru_tendik') {
      matchTab = userRolesList.some(r => ['guru', 'walas', 'kamad', 'admin', 'wakakurikulum', 'wakakesiswaan', 'bk', 'pustaka', 'guru_quran'].includes(r));
    } else if (activeTab === 'ortu') {
      matchTab = userRolesList.includes('ortu');
    } else if (activeTab === 'siswa') {
      matchTab = userRolesList.includes('siswa');
    }

    const matchSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      userRolesList.some(r => r.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Manajemen Pengguna</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            title="Download Template Excel Guru & Tendik"
          >
            <Download className="w-4 h-4" /> Unduh Template
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
            title="Upload Data Excel Guru & Tendik"
          >
            <Upload className="w-4 h-4" /> Import Excel
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Pengguna
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-4 rounded-lg flex items-start gap-3 border ${feedback.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {feedback.type === 'success' ? <Check className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Akun Pengguna</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari Nama / Peran..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
            <div className="flex border-b border-slate-200 overflow-x-auto hide-scrollbar">
              <button 
                onClick={() => setActiveTab('guru_tendik')}
                className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'guru_tendik' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Guru & Tendik
              </button>
              <button 
                onClick={() => setActiveTab('ortu')}
                className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'ortu' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Orang Tua
              </button>
              <button 
                onClick={() => setActiveTab('siswa')}
                className={`px-4 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'siswa' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Siswa Kelas XII
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                  <th className="pb-3 px-4 font-bold">Profil</th>
                  <th className="pb-3 px-4 font-bold">Akun Login</th>
                  <th className="pb-3 px-4 font-bold">Peran & Keterangan</th>
                  <th className="pb-3 px-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(u => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 overflow-hidden shrink-0">
                             <UserAvatar src={u.avatar} name={u.name} className="w-full h-full" />
                          </div>
                          <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800 text-sm">{u.username}</p>
                        <p className="text-[10px] text-slate-500 font-mono">****</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-start gap-1">
                          <div className="flex flex-wrap gap-1">
                            {(u.roles && u.roles.length > 0 ? u.roles : [u.role]).map((r) => (
                              <span key={r} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider">
                                {r.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                          {(u.roles || [u.role]).includes('walas') && u.className && (
                            <span className="text-[10px] text-slate-500">Kelas: {u.className}</span>
                          )}
                          {(u.roles || [u.role]).includes('ortu') && u.childName && (
                            <span className="text-[10px] text-slate-500">Anak: {u.childName}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(u)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(u.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Hapus">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                      Tidak ada pengguna yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-visible">
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Konfirmasi Hapus</h3>
              <p className="text-sm text-slate-600 mb-6">Apakah Anda yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-visible my-8">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-slate-100">
              <h2 className="font-bold text-lg text-slate-800">
                {editingId ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 md:p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap..."
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-emerald-500 outline-none"
                  />
                </div>

                {!editingId ? (
                  <div className="col-span-2 text-xs text-slate-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="font-bold text-blue-700">Info:</span> Username dan Password akan dibuat secara otomatis (Username = Nama Depan, Password = 12345).
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider">Reset Password (Opsional)</label>
                    <input
                      type="text"
                      placeholder="Masukkan password baru (kosongkan jika tidak diubah)"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-emerald-200 rounded-lg text-sm focus:border-emerald-500 outline-none bg-emerald-50"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Peran (Role)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {[
                      { value: 'guru', label: 'Guru' },
                      { value: 'walas', label: 'Wali Kelas' },
                      { value: 'guru_quran', label: 'Guru Qur\'an' },
                      { value: 'bk', label: 'Guru BK' },
                      { value: 'pustaka', label: 'Pustakawan' },
                      { value: 'kamad', label: 'Kepala Madrasah' },
                      { value: 'wakakurikulum', label: 'Waka Kurikulum' },
                      { value: 'wakakesiswaan', label: 'Waka Kesiswaan' },
                      { value: 'ortu', label: 'Orang Tua' },
                      { value: 'siswa', label: 'Siswa' },
                      { value: 'admin', label: 'Admin' },
                    ].map((roleOpt) => (
                      <label key={roleOpt.value} className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          checked={userRoles.includes(roleOpt.value as Role)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setUserRoles([...userRoles, roleOpt.value as Role]);
                            } else {
                              setUserRoles(userRoles.filter(r => r !== roleOpt.value));
                              if (!userRoles.some(r => ['guru', 'walas', 'guru_quran', 'bk', 'pustaka', 'kamad', 'wakakurikulum', 'wakakesiswaan'].includes(r)) && roleOpt.value !== 'siswa' && roleOpt.value !== 'ortu' && roleOpt.value !== 'admin') {
                                setUserGender('');
                              }
                            }
                          }}
                        />
                        <span className="text-slate-700 font-medium">{roleOpt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {userRoles.some(r => ['guru', 'walas', 'guru_quran', 'bk', 'pustaka', 'kamad', 'wakakurikulum', 'wakakesiswaan'].includes(r)) && (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Panggilan (Gender)</label>
                    <CustomSelect
                      value={userGender}
                      onChange={(val) => setUserGender(val as 'L' | 'P')}
                      options={[
                        { value: 'L', label: 'Ustadz (Laki-laki)' },
                        { value: 'P', label: 'Ustadzah (Perempuan)' },
                      ]}
                      placeholder="Pilih Panggilan..."
                    />
                  </div>
                )}


                
                {userRoles.includes('ortu') && (
                  <div className="space-y-1.5 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Nama Anak (Data Siswa)</label>
                    <CustomSelect
                      value={userChildId}
                      onChange={(val) => setUserChildId(val)}
                      options={students.map((s: any) => ({ value: s.id, label: `${s.name} - ${s.className}` }))}
                      placeholder="-- Pilih Anak --"
                      required
                      searchable={true}
                    />
                  </div>
                )}

                {userRoles.includes('walas') && (
                  <div className="space-y-1.5 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Kelas (Wali Kelas)</label>
                    <CustomSelect
                      value={userClassName}
                      onChange={(val) => setUserClassName(val)}
                      options={classOptions}
                      placeholder="Pilih Kelas..."
                    />
                  </div>
                )}
  
              </div>

              <div className="flex gap-3 pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" /> {editingId ? 'Simpan Perubahan' : 'Tambahkan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
