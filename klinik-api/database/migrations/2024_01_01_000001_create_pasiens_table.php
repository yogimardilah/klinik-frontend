<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pasiens', function (Blueprint $table) {
            $table->id();
            
            // Basic information
            $table->string('nama');
            $table->string('email')->nullable();
            $table->string('telepon', 20);
            $table->text('alamat');
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['L', 'P']); // L = Laki-laki, P = Perempuan
            
            // Identity information
            $table->string('nomor_identitas', 50)->unique();
            $table->enum('jenis_identitas', ['ktp', 'sim', 'passport', 'kk', 'anak']);
            
            // Medical information
            $table->enum('golongan_darah', ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])->nullable();
            $table->text('alergi')->nullable();
            $table->text('riwayat_penyakit')->nullable();
            
            // Emergency contact
            $table->string('kontak_darurat_nama');
            $table->string('kontak_darurat_telepon', 20);
            $table->string('kontak_darurat_hubungan', 100);
            
            // Additional information
            $table->string('pekerjaan')->nullable();
            $table->enum('status_pernikahan', ['belum_menikah', 'menikah', 'cerai', 'janda'])->nullable();
            $table->enum('agama', ['islam', 'kristen', 'katolik', 'hindu', 'buddha', 'konghucu', 'lainnya'])->nullable();
            $table->text('catatan')->nullable();
            
            // System fields
            $table->foreignId('doctor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('status', ['aktif', 'tidak_aktif', 'meninggal'])->default('aktif');
            $table->string('nomor_rekam_medis', 20)->unique();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index('nama');
            $table->index('telepon');
            $table->index('nomor_rekam_medis');
            $table->index('status');
            $table->index('jenis_kelamin');
            $table->index('doctor_id');
            $table->index(['status', 'doctor_id']);
            $table->index(['created_at', 'status']);
            
            // Full text search indexes (if using MySQL)
            $table->fullText(['nama', 'telepon', 'nomor_rekam_medis', 'nomor_identitas']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pasiens');
    }
};