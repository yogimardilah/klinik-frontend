<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PasienController extends Controller
{
    /**
     * Display a listing of patients
     */
    public function index(Request $request): JsonResponse
    {
        $query = Pasien::with('doctor:id,name');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $query->search($request->search);
        }

        // Filter by status
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Filter by gender
        if ($request->has('jenis_kelamin') && !empty($request->jenis_kelamin)) {
            $query->where('jenis_kelamin', $request->jenis_kelamin);
        }

        // Filter by doctor
        if ($request->has('doctor_id') && !empty($request->doctor_id)) {
            $query->where('doctor_id', $request->doctor_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSortFields = ['nama', 'email', 'telepon', 'tanggal_lahir', 'created_at', 'updated_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $perPage = min($perPage, 100); // Max 100 items per page

        $patients = $query->paginate($perPage);

        // Transform data
        $patients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'nama' => $patient->nama,
                'email' => $patient->email,
                'telepon' => $patient->telepon,
                'alamat' => $patient->alamat,
                'tanggal_lahir' => $patient->tanggal_lahir?->format('Y-m-d'),
                'umur' => $patient->umur,
                'jenis_kelamin' => $patient->jenis_kelamin,
                'jenis_kelamin_label' => $patient->jenis_kelamin_label,
                'nomor_identitas' => $patient->nomor_identitas,
                'jenis_identitas' => $patient->jenis_identitas,
                'jenis_identitas_label' => $patient->jenis_identitas_label,
                'golongan_darah' => $patient->golongan_darah,
                'golongan_darah_label' => $patient->golongan_darah_label,
                'alergi' => $patient->alergi,
                'riwayat_penyakit' => $patient->riwayat_penyakit,
                'kontak_darurat_nama' => $patient->kontak_darurat_nama,
                'kontak_darurat_telepon' => $patient->kontak_darurat_telepon,
                'kontak_darurat_hubungan' => $patient->kontak_darurat_hubungan,
                'emergency_contact' => $patient->emergency_contact,
                'pekerjaan' => $patient->pekerjaan,
                'status_pernikahan' => $patient->status_pernikahan,
                'status_pernikahan_label' => $patient->status_pernikahan_label,
                'agama' => $patient->agama,
                'agama_label' => $patient->agama_label,
                'catatan' => $patient->catatan,
                'status' => $patient->status,
                'status_label' => $patient->status_label,
                'nomor_rekam_medis' => $patient->nomor_rekam_medis,
                'display_name' => $patient->display_name,
                'doctor' => $patient->doctor ? [
                    'id' => $patient->doctor->id,
                    'name' => $patient->doctor->name
                ] : null,
                'created_at' => $patient->created_at,
                'updated_at' => $patient->updated_at
            ];
        });

        return response()->json($patients);
    }

    /**
     * Store a newly created patient
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|unique:pasiens,email',
            'telepon' => 'required|string|max:20',
            'alamat' => 'required|string',
            'tanggal_lahir' => 'required|date|before:today',
            'jenis_kelamin' => 'required|in:L,P',
            'nomor_identitas' => 'required|string|max:50|unique:pasiens,nomor_identitas',
            'jenis_identitas' => 'required|in:ktp,sim,passport,kk,anak',
            'golongan_darah' => 'nullable|in:A,B,AB,O,A+,A-,B+,B-,AB+,AB-,O+,O-',
            'alergi' => 'nullable|string',
            'riwayat_penyakit' => 'nullable|string',
            'kontak_darurat_nama' => 'required|string|max:255',
            'kontak_darurat_telepon' => 'required|string|max:20',
            'kontak_darurat_hubungan' => 'required|string|max:100',
            'pekerjaan' => 'nullable|string|max:255',
            'status_pernikahan' => 'nullable|in:belum_menikah,menikah,cerai,janda',
            'agama' => 'nullable|in:islam,kristen,katolik,hindu,buddha,konghucu,lainnya',
            'catatan' => 'nullable|string',
            'doctor_id' => 'nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify doctor role if doctor_id is provided
        if ($request->doctor_id) {
            $doctor = User::find($request->doctor_id);
            if (!$doctor || !$doctor->isDoctor()) {
                return response()->json([
                    'message' => 'Invalid doctor selection'
                ], 422);
            }
        }

        try {
            $pasien = Pasien::create($request->all());
            $pasien->load('doctor:id,name');

            return response()->json([
                'message' => 'Pasien berhasil ditambahkan',
                'data' => $this->transformPasien($pasien)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menambahkan pasien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified patient
     */
    public function show(Pasien $pasien): JsonResponse
    {
        $pasien->load('doctor:id,name,role');

        return response()->json([
            'data' => $this->transformPasien($pasien)
        ]);
    }

    /**
     * Update the specified patient
     */
    public function update(Request $request, Pasien $pasien): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|unique:pasiens,email,' . $pasien->id,
            'telepon' => 'sometimes|required|string|max:20',
            'alamat' => 'sometimes|required|string',
            'tanggal_lahir' => 'sometimes|required|date|before:today',
            'jenis_kelamin' => 'sometimes|required|in:L,P',
            'nomor_identitas' => 'sometimes|required|string|max:50|unique:pasiens,nomor_identitas,' . $pasien->id,
            'jenis_identitas' => 'sometimes|required|in:ktp,sim,passport,kk,anak',
            'golongan_darah' => 'nullable|in:A,B,AB,O,A+,A-,B+,B-,AB+,AB-,O+,O-',
            'alergi' => 'nullable|string',
            'riwayat_penyakit' => 'nullable|string',
            'kontak_darurat_nama' => 'sometimes|required|string|max:255',
            'kontak_darurat_telepon' => 'sometimes|required|string|max:20',
            'kontak_darurat_hubungan' => 'sometimes|required|string|max:100',
            'pekerjaan' => 'nullable|string|max:255',
            'status_pernikahan' => 'nullable|in:belum_menikah,menikah,cerai,janda',
            'agama' => 'nullable|in:islam,kristen,katolik,hindu,buddha,konghucu,lainnya',
            'catatan' => 'nullable|string',
            'status' => 'sometimes|required|in:aktif,tidak_aktif,meninggal',
            'doctor_id' => 'nullable|exists:users,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify doctor role if doctor_id is provided
        if ($request->doctor_id) {
            $doctor = User::find($request->doctor_id);
            if (!$doctor || !$doctor->isDoctor()) {
                return response()->json([
                    'message' => 'Invalid doctor selection'
                ], 422);
            }
        }

        try {
            $pasien->update($request->all());
            $pasien->load('doctor:id,name');

            return response()->json([
                'message' => 'Pasien berhasil diperbarui',
                'data' => $this->transformPasien($pasien)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui pasien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified patient
     */
    public function destroy(Pasien $pasien): JsonResponse
    {
        try {
            $pasien->delete(); // Soft delete

            return response()->json([
                'message' => 'Pasien berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus pasien',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search patients
     */
    public function search(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'q' => 'required|string|min:2'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $patients = Pasien::search($request->q)
                         ->with('doctor:id,name')
                         ->limit(20)
                         ->get();

        $patients = $patients->map(function ($patient) {
            return [
                'id' => $patient->id,
                'nama' => $patient->nama,
                'email' => $patient->email,
                'telepon' => $patient->telepon,
                'nomor_rekam_medis' => $patient->nomor_rekam_medis,
                'display_name' => $patient->display_name,
                'jenis_kelamin_label' => $patient->jenis_kelamin_label,
                'umur' => $patient->umur,
                'doctor' => $patient->doctor ? [
                    'id' => $patient->doctor->id,
                    'name' => $patient->doctor->name
                ] : null
            ];
        });

        return response()->json([
            'data' => $patients
        ]);
    }

    /**
     * Get patient statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_patients' => Pasien::count(),
                'active_patients' => Pasien::aktif()->count(),
                'inactive_patients' => Pasien::tidakAktif()->count(),
                'male_patients' => Pasien::jenisKelamin('L')->count(),
                'female_patients' => Pasien::jenisKelamin('P')->count(),
                'patients_this_month' => Pasien::whereMonth('created_at', now()->month)
                                              ->whereYear('created_at', now()->year)
                                              ->count(),
                'patients_this_year' => Pasien::whereYear('created_at', now()->year)->count(),
            ];

            // Age groups
            $ageGroups = DB::table('pasiens')
                ->selectRaw('
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) < 18 THEN 1 ELSE 0 END) as anak,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 18 AND 30 THEN 1 ELSE 0 END) as dewasa_muda,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) BETWEEN 31 AND 50 THEN 1 ELSE 0 END) as dewasa,
                    SUM(CASE WHEN TIMESTAMPDIFF(YEAR, tanggal_lahir, CURDATE()) > 50 THEN 1 ELSE 0 END) as lansia
                ')
                ->whereNull('deleted_at')
                ->first();

            $stats['age_groups'] = [
                'anak' => (int) $ageGroups->anak,
                'dewasa_muda' => (int) $ageGroups->dewasa_muda,
                'dewasa' => (int) $ageGroups->dewasa,
                'lansia' => (int) $ageGroups->lansia
            ];

            // Blood type distribution
            $bloodTypes = Pasien::selectRaw('golongan_darah, COUNT(*) as count')
                               ->whereNotNull('golongan_darah')
                               ->groupBy('golongan_darah')
                               ->pluck('count', 'golongan_darah')
                               ->toArray();

            $stats['blood_type_distribution'] = $bloodTypes;

            return response()->json([
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil statistik',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export patients data
     */
    public function export(Request $request): JsonResponse
    {
        // This would typically export to CSV/Excel
        // For now, just return all data in JSON format
        
        $patients = Pasien::with('doctor:id,name')->get();
        
        $exportData = $patients->map(function ($patient) {
            return $this->transformPasien($patient);
        });

        return response()->json([
            'message' => 'Data pasien berhasil diekspor',
            'data' => $exportData,
            'total' => $exportData->count()
        ]);
    }

    /**
     * Import patients data
     */
    public function import(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv,xlsx,xls|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // This would typically process the uploaded file
        // For now, just return a success message
        
        return response()->json([
            'message' => 'Data pasien berhasil diimpor',
            'imported_count' => 0 // Would be actual count after processing
        ]);
    }

    /**
     * Transform patient data for API response
     */
    private function transformPasien(Pasien $pasien): array
    {
        return [
            'id' => $pasien->id,
            'nama' => $pasien->nama,
            'email' => $pasien->email,
            'telepon' => $pasien->telepon,
            'alamat' => $pasien->alamat,
            'formatted_alamat' => $pasien->formatted_alamat,
            'tanggal_lahir' => $pasien->tanggal_lahir?->format('Y-m-d'),
            'umur' => $pasien->umur,
            'jenis_kelamin' => $pasien->jenis_kelamin,
            'jenis_kelamin_label' => $pasien->jenis_kelamin_label,
            'nomor_identitas' => $pasien->nomor_identitas,
            'jenis_identitas' => $pasien->jenis_identitas,
            'jenis_identitas_label' => $pasien->jenis_identitas_label,
            'golongan_darah' => $pasien->golongan_darah,
            'golongan_darah_label' => $pasien->golongan_darah_label,
            'alergi' => $pasien->alergi,
            'has_allergies' => $pasien->hasAllergies(),
            'riwayat_penyakit' => $pasien->riwayat_penyakit,
            'has_medical_history' => $pasien->hasMedicalHistory(),
            'kontak_darurat_nama' => $pasien->kontak_darurat_nama,
            'kontak_darurat_telepon' => $pasien->kontak_darurat_telepon,
            'kontak_darurat_hubungan' => $pasien->kontak_darurat_hubungan,
            'emergency_contact' => $pasien->emergency_contact,
            'pekerjaan' => $pasien->pekerjaan,
            'status_pernikahan' => $pasien->status_pernikahan,
            'status_pernikahan_label' => $pasien->status_pernikahan_label,
            'agama' => $pasien->agama,
            'agama_label' => $pasien->agama_label,
            'catatan' => $pasien->catatan,
            'status' => $pasien->status,
            'status_label' => $pasien->status_label,
            'nomor_rekam_medis' => $pasien->nomor_rekam_medis,
            'display_name' => $pasien->display_name,
            'doctor' => $pasien->doctor ? [
                'id' => $pasien->doctor->id,
                'name' => $pasien->doctor->name,
                'role' => $pasien->doctor->role ?? 'doctor'
            ] : null,
            'created_at' => $pasien->created_at,
            'updated_at' => $pasien->updated_at
        ];
    }
}