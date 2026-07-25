-- ========================================================
-- DATABASE SCHEMA & INITIAL SEED DATA FOR MADRASAH APPLICATION
-- Compatible with Hostinger (MySQL / MariaDB)
-- ========================================================

-- Disable foreign key checks temporarily to drop tables in any order
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `agenda`;
DROP TABLE IF EXISTS `materi_objectives`;
DROP TABLE IF EXISTS `materi_ajar`;
DROP TABLE IF EXISTS `kinerja_staf`;
DROP TABLE IF EXISTS `academic_terms`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `sarpras`;
DROP TABLE IF EXISTS `cbt_submissions`;
DROP TABLE IF EXISTS `cbt_questions`;
DROP TABLE IF EXISTS `cbt_exams`;
DROP TABLE IF EXISTS `bk_cases`;
DROP TABLE IF EXISTS `academic_history`;
DROP TABLE IF EXISTS `grades`;
DROP TABLE IF EXISTS `leave_requests`;
DROP TABLE IF EXISTS `teacher_attendance`;
DROP TABLE IF EXISTS `student_attendance`;
DROP TABLE IF EXISTS `schedules`;
DROP TABLE IF EXISTS `teaching_assignments`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `classes`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. TABEL USERS (PENGGUNA / STAF / WALI MURID)
-- ==========================================
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL, -- Di produksi, gunakan hash (bcrypt atau plain-text disesuaikan)
  `name` varchar(100) NOT NULL,
  `role` enum('admin', 'kamad', 'guru', 'walas', 'guru_quran', 'ortu', 'bk', 'pustaka', 'wakakurikulum', 'wakakesiswaan', 'siswa') NOT NULL,
  `gender` enum('L', 'P') DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `class_name` varchar(50) DEFAULT NULL, -- Kelas binaan (untuk Wali Kelas)
  `child_id` int(11) DEFAULT NULL, -- Menghubungkan orang tua ke siswa
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 2. TABEL KELAS (CLASSES)
-- ==========================================
CREATE TABLE `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `wali_kelas_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  FOREIGN KEY (`wali_kelas_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 3. TABEL SISWA (STUDENTS)
-- ==========================================
CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL, -- Menghubungkan siswa ke akun login jika ada
  `name` varchar(100) NOT NULL,
  `nis` varchar(20) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `gender` enum('L', 'P') NOT NULL,
  `parent_id` int(11) DEFAULT NULL, -- Menghubungkan siswa ke akun Orang Tua
  `behavior_score` int(11) DEFAULT 100, -- Nilai Sikap / Karakter
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nis` (`nis`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 4. TABEL MATA PELAJARAN (SUBJECTS)
-- ==========================================
CREATE TABLE `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` enum('Wajib', 'Muatan Lokal', 'Pilihan') DEFAULT 'Wajib',
  `weekly_hours` int(11) DEFAULT 2,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 5. TABEL DISTRIBUSI MENGAJAR (TEACHING ASSIGNMENTS)
-- ==========================================
CREATE TABLE `teaching_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_id` int(11) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 6. TABEL JADWAL PELAJARAN (SCHEDULES)
-- ==========================================
CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(50) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `day` varchar(20) NOT NULL, -- 'Senin', 'Selasa', 'Rabu', etc.
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 7. TABEL ABSENSI SISWA (STUDENT ATTENDANCE)
-- ==========================================
CREATE TABLE `student_attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `status` enum('Hadir', 'Sakit', 'Izin', 'Alpa') NOT NULL,
  `notes` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 8. TABEL ABSENSI GURU / STAF (TEACHER ATTENDANCE)
-- ==========================================
CREATE TABLE `teacher_attendance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time_in` time DEFAULT NULL,
  `time_out` time DEFAULT NULL,
  `status` enum('Hadir', 'Sakit', 'Izin', 'Alpa') NOT NULL DEFAULT 'Hadir',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 9. TABEL PERIZINAN GURU / STAF (LEAVE REQUESTS)
-- ==========================================
CREATE TABLE `leave_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` enum('sakit', 'izin_pribadi', 'dinas_luar') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending', 'approved', 'rejected') DEFAULT 'pending',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 10. TABEL NILAI SISWA (GRADES)
-- ==========================================
CREATE TABLE `grades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `academic_year` varchar(20) NOT NULL, -- Contoh: '2025/2026'
  `semester` enum('Ganjil', 'Genap') NOT NULL,
  `type` enum('Tugas', 'UH', 'UTS', 'UAS') NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `notes` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 11. TABEL RIWAYAT AKADEMIK SISWA (ACADEMIC HISTORY / RAPOR)
-- ==========================================
CREATE TABLE `academic_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `semester` enum('Ganjil', 'Genap') NOT NULL,
  `behavior_score` int(11) DEFAULT 100,
  `present` int(11) DEFAULT 0,
  `absent` int(11) DEFAULT 0,
  `sick` int(11) DEFAULT 0,
  `permission` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 12. TABEL BIMBINGAN KONSELING (COUNSELING CASES / BK)
-- ==========================================
CREATE TABLE `bk_cases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `case_description` text NOT NULL,
  `severity` enum('Ringan', 'Sedang', 'Berat') NOT NULL DEFAULT 'Ringan',
  `follow_up` text,
  `status` enum('Selesai', 'Proses', 'Pemantauan') NOT NULL DEFAULT 'Proses',
  `logged_by` int(11) NOT NULL, -- ID Staff/Guru BK yang mencatat
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`logged_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 13. TABEL UJIAN CBT (CBT EXAMS)
-- ==========================================
CREATE TABLE `cbt_exams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `duration_minutes` int(11) NOT NULL DEFAULT 60,
  `status` enum('Draft', 'Aktif', 'Selesai') DEFAULT 'Draft',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 14. TABEL PERTANYAAN UJIAN CBT (CBT QUESTIONS)
-- ==========================================
CREATE TABLE `cbt_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `option_a` text NOT NULL,
  `option_b` text NOT NULL,
  `option_c` text NOT NULL,
  `option_d` text NOT NULL,
  `correct_option` enum('A', 'B', 'C', 'D') NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`exam_id`) REFERENCES `cbt_exams`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 15. TABEL JAWABAN SISWA CBT (CBT SUBMISSIONS)
-- ==========================================
CREATE TABLE `cbt_submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `score` decimal(5,2) NOT NULL,
  `submitted_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`exam_id`) REFERENCES `cbt_exams`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 16. TABEL SARANA PRASARANA (SARPRAS / INVENTARIS)
-- ==========================================
CREATE TABLE `sarpras` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(150) NOT NULL,
  `code` varchar(50) NOT NULL,
  `category` varchar(100) NOT NULL,
  `qty_baik` int(11) NOT NULL DEFAULT 0,
  `qty_rusak_ringan` int(11) NOT NULL DEFAULT 0,
  `qty_rusak_berat` int(11) NOT NULL DEFAULT 0,
  `room` varchar(100) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 17. TABEL PENGUMUMAN (ANNOUNCEMENTS)
-- ==========================================
CREATE TABLE `announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `target_audience` varchar(50) NOT NULL DEFAULT 'semua', -- 'semua', 'guru', 'ortu', etc.
  `created_by` int(11) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 18. TABEL NOTIFIKASI (NOTIFICATIONS)
-- ==========================================
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info', 'warning', 'success') DEFAULT 'info',
  `is_read` boolean DEFAULT FALSE,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 19. TABEL TAHUN AJARAN & SEMESTER (ACADEMIC TERMS)
-- ==========================================
CREATE TABLE `academic_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` varchar(20) NOT NULL, -- Contoh: '2025/2026'
  `semester` enum('Ganjil', 'Genap') NOT NULL,
  `is_active` boolean DEFAULT FALSE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 20. TABEL KINERJA STAF (STAFF TASKS)
-- ==========================================
CREATE TABLE `kinerja_staf` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `task` text NOT NULL,
  `status` enum('Proses', 'Selesai') DEFAULT 'Proses',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 21. TABEL MATERI AJAR (CURRICULUM MATERIALS)
-- ==========================================
CREATE TABLE `materi_ajar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `class_name` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text,
  `file_name` varchar(255),
  `status` enum('Review', 'Terbit') DEFAULT 'Review',
  `date` date NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 22. TABEL OBJECTIVES MATERI (LEARNING TARGETS)
-- ==========================================
CREATE TABLE `materi_objectives` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `materi_id` int(11) NOT NULL,
  `objective` text NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`materi_id`) REFERENCES `materi_ajar`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ==========================================
-- 23. TABEL KALENDER AKADEMIK / AGENDA (ACADEMIC CALENDAR)
-- ==========================================
CREATE TABLE `agenda` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `event` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `color` varchar(100) DEFAULT 'bg-emerald-100 text-emerald-800',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ========================================================
-- SEED DATA (DATA AWAL & CONTOH UNTUK SISTEM)
-- ========================================================

-- Seed Users dengan Password Default Berbagai Role
-- Catatan: Password disamakan dengan username masing-masing demi kemudahan login
INSERT INTO `users` (`id`, `username`, `password`, `name`, `role`, `gender`, `class_name`) VALUES
(1, 'admin', 'admin', 'Administrator MA IBS', 'admin', 'L', NULL),
(2, 'kamad', 'kamad', 'Dr. H. Ahmad Syarif, M.A.', 'kamad', 'L', NULL),
(3, 'guru', 'guru', 'Ust. Ahmad Dahlan, S.Pd.', 'guru', 'L', NULL),
(4, 'walas', 'walas', 'Ustd. Siti Aminah, S.Ag.', 'walas', 'P', 'X MIPA 1'),
(5, 'guru_quran', 'guru_quran', 'Ust. Umar Al-Hafizh, S.Pd.I', 'guru_quran', 'L', NULL),
(6, 'bk', 'bk', 'Rahman Hakim, S.Psi.', 'bk', 'L', NULL),
(7, 'pustaka', 'pustaka', 'Khairunnisa, S.I.P.', 'pustaka', 'P', NULL),
(8, 'wakakurikulum', 'wakakurikulum', 'Dr. Syamsudin, M.Pd.', 'wakakurikulum', 'L', NULL),
(9, 'wakakesiswaan', 'wakakesiswaan', 'Faisal Tanjung, M.Si.', 'wakakesiswaan', 'L', NULL),
(10, 'ortu', 'ortu', 'Wali Murid Farhan', 'ortu', 'L', NULL),
(11, 'siswa', 'siswa', 'Farhan Al-Fatih', 'siswa', 'L', 'X MIPA 1');

-- Seed Classes (Daftar Kelas Madrasah)
INSERT INTO `classes` (`id`, `name`, `wali_kelas_id`) VALUES
(1, 'X MIPA 1', 4),
(2, 'X MIPA 2', NULL),
(3, 'XI IPS 1', NULL),
(4, 'XII IPS 2', NULL),
(5, 'Halaqah Al-Mulk', 5);

-- Seed Students (Daftar Siswa Madrasah)
-- Farhan Al-Fatih berelasi dengan user Ortu (ID: 10) dan Siswa (ID: 11)
INSERT INTO `students` (`id`, `user_id`, `name`, `nis`, `class_name`, `gender`, `parent_id`, `behavior_score`) VALUES
(1, 11, 'Farhan Al-Fatih', '120201001', 'X MIPA 1', 'L', 10, 95),
(2, NULL, 'Aisyah Humaira', '120201002', 'X MIPA 1', 'P', NULL, 100),
(3, NULL, 'Muhammad Rizky', '120201003', 'XII IPS 2', 'L', NULL, 88);

-- Seed Subjects (Mata Pelajaran)
INSERT INTO `subjects` (`id`, `code`, `name`, `category`, `weekly_hours`) VALUES
(1, 'MTK-01', 'Matematika', 'Wajib', 4),
(2, 'FIS-01', 'Fisika', 'Pilihan', 3),
(3, 'KIM-01', 'Kimia', 'Pilihan', 3),
(4, 'ARB-01', 'Bahasa Arab', 'Muatan Lokal', 2),
(5, 'TFZ-01', 'Tahfizh Al-Quran', 'Muatan Lokal', 4),
(6, 'FIQ-01', 'Fiqih', 'Wajib', 2),
(7, 'AKD-01', 'Akidah Akhlak', 'Wajib', 2),
(8, 'IND-01', 'Bahasa Indonesia', 'Wajib', 4),
(9, 'ENG-01', 'Bahasa Inggris', 'Wajib', 4),
(10, 'SJR-01', 'Sejarah', 'Wajib', 2),
(11, 'PJK-01', 'Pendidikan Jasmani', 'Wajib', 2),
(12, 'SNI-01', 'Seni Budaya', 'Muatan Lokal', 2),
(13, 'PKN-01', 'Pendidikan Kewarganegaraan', 'Wajib', 2),
(14, 'BIO-01', 'Biologi', 'Pilihan', 3),
(15, 'EKO-01', 'Ekonomi', 'Pilihan', 3),
(16, 'GEO-01', 'Geografi', 'Pilihan', 3),
(17, 'SOS-01', 'Sosiologi', 'Pilihan', 3),
(18, 'IKU-01', 'Ilmu Tafsir', 'Muatan Lokal', 2),
(19, 'HAD-01', 'Ilmu Hadits', 'Muatan Lokal', 2),
(20, 'SKD-01', 'Sejarah Kebudayaan Islam', 'Wajib', 2);

-- Seed Teaching Assignments (Distribusi Mengajar)
INSERT INTO `teaching_assignments` (`teacher_id`, `subject_name`, `class_name`) VALUES
(3, 'Matematika', 'X MIPA 1'),
(3, 'Matematika', 'X MIPA 2'),
(4, 'Bahasa Arab', 'X MIPA 1'),
(5, 'Tahfizh Al-Quran', 'Halaqah Al-Mulk');

-- Seed Schedules (Jadwal Pelajaran)
INSERT INTO `schedules` (`class_name`, `subject_name`, `teacher_id`, `day`, `start_time`, `end_time`) VALUES
('X MIPA 1', 'Matematika', 3, 'Senin', '07:30:00', '09:00:00'),
('X MIPA 1', 'Bahasa Arab', 4, 'Senin', '09:15:00', '10:45:00'),
('X MIPA 1', 'Tahfizh Al-Quran', 5, 'Selasa', '07:30:00', '09:00:00');

-- Seed Student Attendance (Contoh Absensi Siswa)
INSERT INTO `student_attendance` (`student_id`, `class_name`, `date`, `status`, `notes`) VALUES
(1, 'X MIPA 1', '2026-07-20', 'Hadir', 'Tepat waktu'),
(2, 'X MIPA 1', '2026-07-20', 'Izin', 'Acara keluarga'),
(3, 'XII IPS 2', '2026-07-20', 'Sakit', 'Demam');

-- Seed Teacher Attendance (Contoh Absensi Guru/Staf)
INSERT INTO `teacher_attendance` (`user_id`, `date`, `time_in`, `time_out`, `status`, `latitude`, `longitude`, `notes`) VALUES
(3, '2026-07-20', '07:15:22', '16:05:10', 'Hadir', -0.50201200, 101.44732000, 'Absen di lingkungan sekolah'),
(4, '2026-07-20', '07:22:10', '16:01:00', 'Hadir', -0.50204300, 101.44735000, 'Absen menggunakan HP'),
(5, '2026-07-20', '07:10:00', NULL, 'Hadir', -0.50200000, 101.44700000, 'Hadir tepat waktu');

-- Seed Leave Requests (Perizinan Guru)
INSERT INTO `leave_requests` (`user_id`, `type`, `start_date`, `end_date`, `reason`, `status`) VALUES
(3, 'sakit', '2026-07-15', '2026-07-16', 'Izin berobat ke puskesmas karena flu berat', 'approved'),
(4, 'dinas_luar', '2026-07-22', '2026-07-23', 'Pelatihan Penilaian K-Merdeka di Kemenag', 'pending');

-- Seed Grades (Contoh Nilai Siswa)
INSERT INTO `grades` (`student_id`, `subject_name`, `class_name`, `academic_year`, `semester`, `type`, `score`, `notes`) VALUES
(1, 'Matematika', 'X MIPA 1', '2025/2026', 'Ganjil', 'Tugas', 85.00, 'Latihan Bab 1'),
(1, 'Matematika', 'X MIPA 1', '2025/2026', 'Ganjil', 'UH', 90.00, 'Ulangan Harian 1'),
(2, 'Matematika', 'X MIPA 1', '2025/2026', 'Ganjil', 'Tugas', 95.00, 'Latihan Bab 1');

-- Seed Academic History (Rapor Riwayat)
INSERT INTO `academic_history` (`student_id`, `class_name`, `academic_year`, `semester`, `behavior_score`, `present`, `absent`, `sick`, `permission`) VALUES
(1, 'X MIPA 1', '2025/2026', 'Ganjil', 95, 40, 0, 1, 1),
(2, 'X MIPA 1', '2025/2026', 'Ganjil', 100, 41, 0, 0, 1);

-- Seed BK Cases (Kasus BK)
INSERT INTO `bk_cases` (`student_id`, `case_description`, `severity`, `follow_up`, `status`, `logged_by`) VALUES
(3, 'Terlambat masuk sekolah sebanyak 3 kali dalam seminggu', 'Ringan', 'Konseling individu dan peringatan tertulis', 'Selesai', 6);

-- Seed CBT Exams & Questions
INSERT INTO `cbt_exams` (`id`, `title`, `subject_name`, `class_name`, `duration_minutes`, `status`) VALUES
(1, 'Ujian Harian Aljabar Linear', 'Matematika', 'X MIPA 1', 60, 'Aktif');

INSERT INTO `cbt_questions` (`exam_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`) VALUES
(1, 'Tentukan himpunan penyelesaian dari 2x + 5 = 15!', 'x = 3', 'x = 5', 'x = 10', 'x = 2', 'B'),
(1, 'Jika f(x) = 3x - 1, maka f(4) adalah...', '11', '12', '13', '10', 'A');

-- Seed CBT Submissions
INSERT INTO `cbt_submissions` (`exam_id`, `student_id`, `score`) VALUES
(1, 1, 100.00);

-- Seed Sarana Prasarana (Inventaris)
INSERT INTO `sarpras` (`id`, `item_name`, `code`, `category`, `qty_baik`, `qty_rusak_ringan`, `qty_rusak_berat`, `room`) VALUES
(1, 'Proyektor Epson EB-X400', 'Eps-PJ-01', 'Elektronik', 1, 0, 0, 'Ruang Kelas X MIPA 1'),
(2, 'Kursi Belajar Kayu Jati', 'Krs-KW-12', 'Mebel', 36, 0, 0, 'Ruang Kelas X MIPA 1'),
(3, 'AC Panasonic 1.5 PK', 'AC-Pan-03', 'Elektronik', 0, 1, 0, 'Ruang Perpustakaan');

-- Seed Announcements (Pengumuman)
INSERT INTO `announcements` (`title`, `content`, `target_audience`, `created_by`) VALUES
('Rapat Awal Tahun Ajaran 2026/2027', 'Diberitahukan kepada seluruh ustadz/ustadzah bahwa rapat pembagian tugas akan dilaksanakan hari Sabtu ini jam 08:30 WIB.', 'guru', 1),
('Libur Menyambut Tahun Baru Hijriah', 'Siswa-siswi diliburkan mulai tanggal 25 s.d 26 Muharram.', 'semua', 1);

-- Seed Notifications
INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `is_read`) VALUES
(3, 'Pengajuan Izin Disetujui', 'Pengajuan izin sakit Anda tanggal 15 s.d 16 Juli telah disetujui Kepala Madrasah.', 'success', 0),
(4, 'Ada Pengajuan Izin Baru', 'Wali murid Farhan mengirimkan pengajuan izin baru.', 'info', 0);

-- Seed Academic Terms
INSERT INTO `academic_terms` (`year`, `semester`, `is_active`) VALUES
('2025/2026', 'Ganjil', 1),
('2025/2026', 'Genap', 0);

-- Seed Kinerja Staf
INSERT INTO `kinerja_staf` (`user_id`, `task`, `status`) VALUES
(3, 'Unggah Modul Ajar Matematika Semester Ganjil', 'Selesai'),
(4, 'Penyusunan Jadwal Kelas Binaan X MIPA 1', 'Proses'),
(5, 'Evaluasi Mingguan Setoran Hafalan Siswa', 'Selesai');

-- Seed Materi Ajar
INSERT INTO `materi_ajar` (`id`, `user_id`, `subject`, `class_name`, `title`, `description`, `file_name`, `status`, `date`) VALUES
(1, 3, 'Matematika', 'X MIPA 1', 'Fungsi Kuadrat & Grafik', 'Membahas konsep fungsi kuadrat lengkap dengan sifat kurvanya.', 'Fungsi_Kuadrat.pdf', 'Terbit', '2026-07-19'),
(2, 4, 'Bimbingan Wali Kelas', 'X MIPA 1', 'Persiapan Karir & Minat Bakat', 'Pengarahan wali kelas mengenai pilihan prodi akademik.', 'Panduan_Studi.pdf', 'Terbit', '2026-07-19'),
(3, 5, 'Tahfizh & Tajwid', 'Halaqah Al-Mulk', 'Tajwid: Hukum Idgham Bighunnah', 'Pendalaman materi tajwid praktis beserta contoh pelafalan.', 'Tajwid.pdf', 'Terbit', '2026-07-18');

-- Seed Objectives Materi
INSERT INTO `materi_objectives` (`materi_id`, `objective`) VALUES
(1, 'Siswa dapat menentukan titik puncak parabola'),
(1, 'Siswa dapat menggambar grafik fungsi kuadrat di milimeter blok'),
(2, 'Siswa memahami jalur SNBP dan UTBK-SNBT'),
(3, 'Siswa dapat melafalkan bacaan Idgham dengan dengung sempurna');

-- Seed Agenda Akademik
INSERT INTO `agenda` (`id`, `date`, `event`, `type`, `color`) VALUES
(1, '2026-07-15', 'Hari Pertama Masuk Sekolah', 'Umum', 'bg-emerald-100 text-emerald-800'),
(2, '2026-08-17', 'Upacara HUT RI', 'Libur Nasional', 'bg-red-100 text-red-800'),
(3, '2026-09-21', 'Penilaian Tengah Semester (PTS)', 'Ujian', 'bg-amber-100 text-amber-800');
