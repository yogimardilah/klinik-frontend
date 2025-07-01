<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Pasien;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Administrator',
            'email' => 'admin@klinik.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'phone' => '08123456789',
            'address' => 'Jl. Admin No. 1, Jakarta',
            'email_verified_at' => now()
        ]);

        // Create sample doctors
        $doctors = [
            [
                'name' => 'Dr. Ahmad Hidayat, Sp.PD',
                'email' => 'ahmad.hidayat@klinik.com',
                'password' => Hash::make('doctor123'),
                'role' => 'doctor',
                'phone' => '08234567890',
                'address' => 'Jl. Dokter No. 1, Jakarta',
                'specialization' => 'Penyakit Dalam',
                'license_number' => 'STR001234567',
                'gender' => 'L',
                'date_of_birth' => '1980-05-15',
                'email_verified_at' => now()
            ],
            [
                'name' => 'Dr. Siti Nurhaliza, Sp.A',
                'email' => 'siti.nurhaliza@klinik.com',
                'password' => Hash::make('doctor123'),
                'role' => 'doctor',
                'phone' => '08345678901',
                'address' => 'Jl. Anak No. 2, Jakarta',
                'specialization' => 'Anak',
                'license_number' => 'STR001234568',
                'gender' => 'P',
                'date_of_birth' => '1985-08-20',
                'email_verified_at' => now()
            ],
            [
                'name' => 'Dr. Budi Santoso, Sp.OG',
                'email' => 'budi.santoso@klinik.com',
                'password' => Hash::make('doctor123'),
                'role' => 'doctor',
                'phone' => '08456789012',
                'address' => 'Jl. Kandungan No. 3, Jakarta',
                'specialization' => 'Obstetri dan Ginekologi',
                'license_number' => 'STR001234569',
                'gender' => 'L',
                'date_of_birth' => '1975-12-10',
                'email_verified_at' => now()
            ]
        ];

        foreach ($doctors as $doctorData) {
            User::create($doctorData);
        }

        // Create sample nurses
        $nurses = [
            [
                'name' => 'Ns. Maria Magdalena',
                'email' => 'maria.magdalena@klinik.com',
                'password' => Hash::make('nurse123'),
                'role' => 'nurse',
                'phone' => '08567890123',
                'address' => 'Jl. Perawat No. 1, Jakarta',
                'gender' => 'P',
                'date_of_birth' => '1990-03-25',
                'email_verified_at' => now()
            ],
            [
                'name' => 'Ns. Andi Pratama',
                'email' => 'andi.pratama@klinik.com',
                'password' => Hash::make('nurse123'),
                'role' => 'nurse',
                'phone' => '08678901234',
                'address' => 'Jl. Perawat No. 2, Jakarta',
                'gender' => 'L',
                'date_of_birth' => '1988-07-18',
                'email_verified_at' => now()
            ]
        ];

        foreach ($nurses as $nurseData) {
            User::create($nurseData);
        }

        // Create sample staff
        $staff = [
            [
                'name' => 'Dewi Sartika',
                'email' => 'dewi.sartika@klinik.com',
                'password' => Hash::make('staff123'),
                'role' => 'staff',
                'phone' => '08789012345',
                'address' => 'Jl. Staff No. 1, Jakarta',
                'gender' => 'P',
                'date_of_birth' => '1992-11-05',
                'email_verified_at' => now()
            ]
        ];

        foreach ($staff as $staffData) {
            User::create($staffData);
        }

        // Get doctor IDs for patient assignment
        $doctorIds = User::doctors()->pluck('id')->toArray();

        // Create sample patients
        $patients = [
            [
                'nama' => 'John Doe',
                'email' => 'john.doe@email.com',
                'telepon' => '08123456789',
                'alamat' => 'Jl. Pasien No. 1, Jakarta Selatan',
                'tanggal_lahir' => '1985-06-15',
                'jenis_kelamin' => 'L',
                'nomor_identitas' => '3171234567890001',
                'jenis_identitas' => 'ktp',
                'golongan_darah' => 'A+',
                'alergi' => 'Tidak ada alergi yang diketahui',
                'riwayat_penyakit' => 'Hipertensi ringan',
                'kontak_darurat_nama' => 'Jane Doe',
                'kontak_darurat_telepon' => '08123456788',
                'kontak_darurat_hubungan' => 'Istri',
                'pekerjaan' => 'Karyawan Swasta',
                'status_pernikahan' => 'menikah',
                'agama' => 'islam',
                'doctor_id' => $doctorIds[0] ?? null,
                'status' => 'aktif'
            ],
            [
                'nama' => 'Maria Gonzalez',
                'email' => 'maria.gonzalez@email.com',
                'telepon' => '08234567890',
                'alamat' => 'Jl. Pasien No. 2, Jakarta Utara',
                'tanggal_lahir' => '1990-12-20',
                'jenis_kelamin' => 'P',
                'nomor_identitas' => '3172345678900002',
                'jenis_identitas' => 'ktp',
                'golongan_darah' => 'B+',
                'alergi' => 'Alergi seafood',
                'riwayat_penyakit' => 'Asma ringan',
                'kontak_darurat_nama' => 'Carlos Gonzalez',
                'kontak_darurat_telepon' => '08234567889',
                'kontak_darurat_hubungan' => 'Suami',
                'pekerjaan' => 'Guru',
                'status_pernikahan' => 'menikah',
                'agama' => 'kristen',
                'doctor_id' => $doctorIds[1] ?? null,
                'status' => 'aktif'
            ],
            [
                'nama' => 'Ahmad Wijaya',
                'email' => 'ahmad.wijaya@email.com',
                'telepon' => '08345678901',
                'alamat' => 'Jl. Pasien No. 3, Jakarta Timur',
                'tanggal_lahir' => '1975-03-10',
                'jenis_kelamin' => 'L',
                'nomor_identitas' => '3173456789000003',
                'jenis_identitas' => 'ktp',
                'golongan_darah' => 'O+',
                'alergi' => null,
                'riwayat_penyakit' => 'Diabetes tipe 2',
                'kontak_darurat_nama' => 'Siti Wijaya',
                'kontak_darurat_telepon' => '08345678900',
                'kontak_darurat_hubungan' => 'Istri',
                'pekerjaan' => 'Wiraswasta',
                'status_pernikahan' => 'menikah',
                'agama' => 'islam',
                'doctor_id' => $doctorIds[0] ?? null,
                'status' => 'aktif'
            ],
            [
                'nama' => 'Sari Indah',
                'email' => 'sari.indah@email.com',
                'telepon' => '08456789012',
                'alamat' => 'Jl. Pasien No. 4, Jakarta Barat',
                'tanggal_lahir' => '2010-08-05',
                'jenis_kelamin' => 'P',
                'nomor_identitas' => '3174567890000004',
                'jenis_identitas' => 'anak',
                'golongan_darah' => 'AB+',
                'alergi' => 'Alergi susu sapi',
                'riwayat_penyakit' => null,
                'kontak_darurat_nama' => 'Budi Indah',
                'kontak_darurat_telepon' => '08456789011',
                'kontak_darurat_hubungan' => 'Ayah',
                'pekerjaan' => null,
                'status_pernikahan' => 'belum_menikah',
                'agama' => 'hindu',
                'doctor_id' => $doctorIds[1] ?? null,
                'status' => 'aktif'
            ],
            [
                'nama' => 'Robert Johnson',
                'email' => null,
                'telepon' => '08567890123',
                'alamat' => 'Jl. Pasien No. 5, Jakarta Pusat',
                'tanggal_lahir' => '1965-11-30',
                'jenis_kelamin' => 'L',
                'nomor_identitas' => '3175678900000005',
                'jenis_identitas' => 'ktp',
                'golongan_darah' => 'A-',
                'alergi' => 'Alergi penisilin',
                'riwayat_penyakit' => 'Penyakit jantung koroner',
                'kontak_darurat_nama' => 'Linda Johnson',
                'kontak_darurat_telepon' => '08567890122',
                'kontak_darurat_hubungan' => 'Istri',
                'pekerjaan' => 'Pensiunan',
                'status_pernikahan' => 'menikah',
                'agama' => 'kristen',
                'doctor_id' => $doctorIds[2] ?? null,
                'status' => 'aktif'
            ]
        ];

        foreach ($patients as $patientData) {
            Pasien::create($patientData);
        }

        $this->command->info('Database seeded successfully!');
        $this->command->info('Login credentials:');
        $this->command->info('Admin: admin@klinik.com / admin123');
        $this->command->info('Doctor: ahmad.hidayat@klinik.com / doctor123');
        $this->command->info('Nurse: maria.magdalena@klinik.com / nurse123');
        $this->command->info('Staff: dewi.sartika@klinik.com / staff123');
    }
}