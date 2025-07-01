<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pasien extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nama',
        'email',
        'telepon',
        'alamat',
        'tanggal_lahir',
        'jenis_kelamin',
        'nomor_identitas',
        'jenis_identitas',
        'golongan_darah',
        'alergi',
        'riwayat_penyakit',
        'kontak_darurat_nama',
        'kontak_darurat_telepon',
        'kontak_darurat_hubungan',
        'pekerjaan',
        'status_pernikahan',
        'agama',
        'catatan',
        'doctor_id',
        'status',
        'nomor_rekam_medis'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'tanggal_lahir' => 'date',
        'deleted_at' => 'datetime',
    ];

    /**
     * Available gender options
     */
    public const JENIS_KELAMIN = [
        'L' => 'Laki-laki',
        'P' => 'Perempuan'
    ];

    /**
     * Available blood types
     */
    public const GOLONGAN_DARAH = [
        'A' => 'A',
        'B' => 'B',
        'AB' => 'AB',
        'O' => 'O',
        'A+' => 'A+',
        'A-' => 'A-',
        'B+' => 'B+',
        'B-' => 'B-',
        'AB+' => 'AB+',
        'AB-' => 'AB-',
        'O+' => 'O+',
        'O-' => 'O-'
    ];

    /**
     * Available ID types
     */
    public const JENIS_IDENTITAS = [
        'ktp' => 'KTP',
        'sim' => 'SIM',
        'passport' => 'Passport',
        'kk' => 'Kartu Keluarga',
        'anak' => 'Akta Kelahiran'
    ];

    /**
     * Available marital status
     */
    public const STATUS_PERNIKAHAN = [
        'belum_menikah' => 'Belum Menikah',
        'menikah' => 'Menikah',
        'cerai' => 'Cerai',
        'janda' => 'Janda/Duda'
    ];

    /**
     * Available religions
     */
    public const AGAMA = [
        'islam' => 'Islam',
        'kristen' => 'Kristen',
        'katolik' => 'Katolik',
        'hindu' => 'Hindu',
        'buddha' => 'Buddha',
        'konghucu' => 'Konghucu',
        'lainnya' => 'Lainnya'
    ];

    /**
     * Patient status
     */
    public const STATUS = [
        'aktif' => 'Aktif',
        'tidak_aktif' => 'Tidak Aktif',
        'meninggal' => 'Meninggal'
    ];

    /**
     * Get the doctor assigned to this patient
     */
    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    /**
     * Get patient's age
     */
    public function getUmurAttribute()
    {
        if (!$this->tanggal_lahir) {
            return null;
        }
        
        return $this->tanggal_lahir->diffInYears(now());
    }

    /**
     * Get patient's full name with ID
     */
    public function getDisplayNameAttribute(): string
    {
        $rekamMedis = $this->nomor_rekam_medis ? " ({$this->nomor_rekam_medis})" : "";
        return $this->nama . $rekamMedis;
    }

    /**
     * Get gender label
     */
    public function getJenisKelaminLabelAttribute(): string
    {
        return self::JENIS_KELAMIN[$this->jenis_kelamin] ?? 'Tidak Diketahui';
    }

    /**
     * Get blood type label
     */
    public function getGolonganDarahLabelAttribute(): string
    {
        return self::GOLONGAN_DARAH[$this->golongan_darah] ?? 'Tidak Diketahui';
    }

    /**
     * Get ID type label
     */
    public function getJenisIdentitasLabelAttribute(): string
    {
        return self::JENIS_IDENTITAS[$this->jenis_identitas] ?? 'Tidak Diketahui';
    }

    /**
     * Get marital status label
     */
    public function getStatusPernikahanLabelAttribute(): string
    {
        return self::STATUS_PERNIKAHAN[$this->status_pernikahan] ?? 'Tidak Diketahui';
    }

    /**
     * Get religion label
     */
    public function getAgamaLabelAttribute(): string
    {
        return self::AGAMA[$this->agama] ?? 'Tidak Diketahui';
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUS[$this->status] ?? 'Tidak Diketahui';
    }

    /**
     * Scope query for active patients
     */
    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    /**
     * Scope query for inactive patients
     */
    public function scopeTidakAktif($query)
    {
        return $query->where('status', 'tidak_aktif');
    }

    /**
     * Scope query by gender
     */
    public function scopeJenisKelamin($query, string $gender)
    {
        return $query->where('jenis_kelamin', $gender);
    }

    /**
     * Scope query by doctor
     */
    public function scopeByDoctor($query, int $doctorId)
    {
        return $query->where('doctor_id', $doctorId);
    }

    /**
     * Search patients by name, email, phone, or medical record number
     */
    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('nama', 'LIKE', "%{$term}%")
              ->orWhere('email', 'LIKE', "%{$term}%")
              ->orWhere('telepon', 'LIKE', "%{$term}%")
              ->orWhere('nomor_rekam_medis', 'LIKE', "%{$term}%")
              ->orWhere('nomor_identitas', 'LIKE', "%{$term}%");
        });
    }

    /**
     * Generate medical record number
     */
    public static function generateNomorRekamMedis(): string
    {
        $year = date('Y');
        $month = date('m');
        
        // Get the last patient for this month
        $lastPatient = self::whereYear('created_at', $year)
                          ->whereMonth('created_at', $month)
                          ->orderBy('id', 'desc')
                          ->first();
        
        $sequence = 1;
        if ($lastPatient && $lastPatient->nomor_rekam_medis) {
            // Extract sequence from last medical record number
            $lastSequence = (int) substr($lastPatient->nomor_rekam_medis, -4);
            $sequence = $lastSequence + 1;
        }
        
        return sprintf('RM%s%s%04d', $year, $month, $sequence);
    }

    /**
     * Boot method to auto-generate medical record number
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($pasien) {
            if (!$pasien->nomor_rekam_medis) {
                $pasien->nomor_rekam_medis = self::generateNomorRekamMedis();
            }
            
            if (!$pasien->status) {
                $pasien->status = 'aktif';
            }
        });
    }

    /**
     * Get formatted address
     */
    public function getFormattedAlamatAttribute(): string
    {
        return $this->alamat ?: 'Alamat tidak tersedia';
    }

    /**
     * Check if patient has allergies
     */
    public function hasAllergies(): bool
    {
        return !empty($this->alergi);
    }

    /**
     * Check if patient has medical history
     */
    public function hasMedicalHistory(): bool
    {
        return !empty($this->riwayat_penyakit);
    }

    /**
     * Get emergency contact info
     */
    public function getEmergencyContactAttribute(): ?string
    {
        if ($this->kontak_darurat_nama && $this->kontak_darurat_telepon) {
            return "{$this->kontak_darurat_nama} ({$this->kontak_darurat_telepon}) - {$this->kontak_darurat_hubungan}";
        }
        
        return null;
    }
}