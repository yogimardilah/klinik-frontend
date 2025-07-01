<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Pasien;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class DoctorController extends Controller
{
    /**
     * Display a listing of doctors
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::doctors()->with(['patients' => function ($q) {
            $q->select('id', 'nama', 'doctor_id')->aktif();
        }]);

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('specialization', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('license_number', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filter by specialization
        if ($request->has('specialization') && !empty($request->specialization)) {
            $query->where('specialization', $request->specialization);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        
        $allowedSortFields = ['name', 'email', 'specialization', 'created_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $perPage = min($perPage, 100);

        $doctors = $query->paginate($perPage);

        // Transform data
        $doctors->getCollection()->transform(function ($doctor) {
            return $this->transformDoctor($doctor);
        });

        return response()->json($doctors);
    }

    /**
     * Store a newly created doctor
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:L,P',
            'specialization' => 'required|string|max:255',
            'license_number' => 'required|string|max:100|unique:users,license_number'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $doctor = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'doctor',
                'phone' => $request->phone,
                'address' => $request->address,
                'date_of_birth' => $request->date_of_birth,
                'gender' => $request->gender,
                'specialization' => $request->specialization,
                'license_number' => $request->license_number,
                'email_verified_at' => now()
            ]);

            return response()->json([
                'message' => 'Dokter berhasil ditambahkan',
                'data' => $this->transformDoctor($doctor)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menambahkan dokter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified doctor
     */
    public function show(User $doctor): JsonResponse
    {
        // Ensure the user is a doctor
        if (!$doctor->isDoctor()) {
            return response()->json([
                'message' => 'User bukan dokter'
            ], 404);
        }

        $doctor->load(['patients' => function ($q) {
            $q->select('id', 'nama', 'nomor_rekam_medis', 'telepon', 'jenis_kelamin', 'tanggal_lahir', 'doctor_id', 'status')
              ->aktif()
              ->orderBy('nama');
        }]);

        return response()->json([
            'data' => $this->transformDoctor($doctor, true)
        ]);
    }

    /**
     * Update the specified doctor
     */
    public function update(Request $request, User $doctor): JsonResponse
    {
        // Ensure the user is a doctor
        if (!$doctor->isDoctor()) {
            return response()->json([
                'message' => 'User bukan dokter'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $doctor->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:L,P',
            'specialization' => 'sometimes|required|string|max:255',
            'license_number' => 'sometimes|required|string|max:100|unique:users,license_number,' . $doctor->id
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $doctor->update($request->only([
                'name', 'email', 'phone', 'address', 'date_of_birth', 
                'gender', 'specialization', 'license_number'
            ]));

            return response()->json([
                'message' => 'Dokter berhasil diperbarui',
                'data' => $this->transformDoctor($doctor)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memperbarui dokter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified doctor
     */
    public function destroy(User $doctor): JsonResponse
    {
        // Ensure the user is a doctor
        if (!$doctor->isDoctor()) {
            return response()->json([
                'message' => 'User bukan dokter'
            ], 404);
        }

        // Check if doctor has assigned patients
        $patientCount = $doctor->patients()->aktif()->count();
        if ($patientCount > 0) {
            return response()->json([
                'message' => "Tidak dapat menghapus dokter yang memiliki {$patientCount} pasien aktif. Pindahkan pasien terlebih dahulu."
            ], 422);
        }

        try {
            // Revoke all tokens
            $doctor->tokens()->delete();
            
            // Delete doctor
            $doctor->delete();

            return response()->json([
                'message' => 'Dokter berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal menghapus dokter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get doctor's schedule
     */
    public function schedule(User $doctor): JsonResponse
    {
        // Ensure the user is a doctor
        if (!$doctor->isDoctor()) {
            return response()->json([
                'message' => 'User bukan dokter'
            ], 404);
        }

        // In a real implementation, you would have a Schedule model
        // For now, return a mock schedule
        $schedule = [
            'doctor_id' => $doctor->id,
            'doctor_name' => $doctor->name,
            'weekly_schedule' => [
                'monday' => ['start' => '08:00', 'end' => '17:00', 'available' => true],
                'tuesday' => ['start' => '08:00', 'end' => '17:00', 'available' => true],
                'wednesday' => ['start' => '08:00', 'end' => '17:00', 'available' => true],
                'thursday' => ['start' => '08:00', 'end' => '17:00', 'available' => true],
                'friday' => ['start' => '08:00', 'end' => '17:00', 'available' => true],
                'saturday' => ['start' => '08:00', 'end' => '14:00', 'available' => true],
                'sunday' => ['start' => null, 'end' => null, 'available' => false]
            ],
            'break_time' => ['start' => '12:00', 'end' => '13:00'],
            'consultation_duration' => 30, // minutes
            'max_patients_per_day' => 20
        ];

        return response()->json([
            'data' => $schedule
        ]);
    }

    /**
     * Update doctor's schedule
     */
    public function updateSchedule(Request $request, User $doctor): JsonResponse
    {
        // Ensure the user is a doctor
        if (!$doctor->isDoctor()) {
            return response()->json([
                'message' => 'User bukan dokter'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'weekly_schedule' => 'required|array',
            'weekly_schedule.*.start' => 'nullable|date_format:H:i',
            'weekly_schedule.*.end' => 'nullable|date_format:H:i',
            'weekly_schedule.*.available' => 'required|boolean',
            'break_time.start' => 'nullable|date_format:H:i',
            'break_time.end' => 'nullable|date_format:H:i',
            'consultation_duration' => 'nullable|integer|min:15|max:120',
            'max_patients_per_day' => 'nullable|integer|min:1|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // In a real implementation, you would save this to a Schedule model
        // For now, just return success
        
        return response()->json([
            'message' => 'Jadwal dokter berhasil diperbarui',
            'data' => [
                'doctor_id' => $doctor->id,
                'updated_at' => now()->toISOString()
            ]
        ]);
    }

    /**
     * Get doctor's patients
     */
    public function patients(User $doctor): JsonResponse
    {
        // Ensure the user is a doctor
        if (!$doctor->isDoctor()) {
            return response()->json([
                'message' => 'User bukan dokter'
            ], 404);
        }

        $patients = $doctor->patients()
                          ->aktif()
                          ->orderBy('nama')
                          ->paginate(20);

        $patients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'nama' => $patient->nama,
                'nomor_rekam_medis' => $patient->nomor_rekam_medis,
                'email' => $patient->email,
                'telepon' => $patient->telepon,
                'tanggal_lahir' => $patient->tanggal_lahir?->format('Y-m-d'),
                'umur' => $patient->umur,
                'jenis_kelamin' => $patient->jenis_kelamin,
                'jenis_kelamin_label' => $patient->jenis_kelamin_label,
                'alamat' => $patient->alamat,
                'status' => $patient->status,
                'status_label' => $patient->status_label,
                'alergi' => $patient->alergi,
                'has_allergies' => $patient->hasAllergies(),
                'riwayat_penyakit' => $patient->riwayat_penyakit,
                'has_medical_history' => $patient->hasMedicalHistory(),
                'created_at' => $patient->created_at,
                'updated_at' => $patient->updated_at
            ];
        });

        return response()->json($patients);
    }

    /**
     * Get doctor statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $totalDoctors = User::doctors()->count();
            $doctorsWithPatients = User::doctors()->has('patients')->count();
            
            $stats = [
                'total_doctors' => $totalDoctors,
                'doctors_with_patients' => $doctorsWithPatients,
                'doctors_without_patients' => $totalDoctors - $doctorsWithPatients,
                'average_patients_per_doctor' => $totalDoctors > 0 ? 
                    round(Pasien::aktif()->whereNotNull('doctor_id')->count() / $totalDoctors, 2) : 0
            ];

            // Doctor workload distribution
            $workloadStats = User::doctors()
                                ->withCount(['patients' => function ($q) {
                                    $q->aktif();
                                }])
                                ->orderBy('patients_count', 'desc')
                                ->get()
                                ->map(function ($doctor) {
                                    return [
                                        'id' => $doctor->id,
                                        'name' => $doctor->name,
                                        'specialization' => $doctor->specialization,
                                        'patient_count' => $doctor->patients_count,
                                        'workload_level' => $this->getWorkloadLevel($doctor->patients_count)
                                    ];
                                });

            $stats['workload_distribution'] = $workloadStats;

            // Specialization distribution
            $specializationStats = User::doctors()
                                      ->selectRaw('specialization, COUNT(*) as count')
                                      ->whereNotNull('specialization')
                                      ->groupBy('specialization')
                                      ->orderBy('count', 'desc')
                                      ->get()
                                      ->map(function ($item) {
                                          return [
                                              'specialization' => $item->specialization,
                                              'count' => $item->count
                                          ];
                                      });

            $stats['specialization_distribution'] = $specializationStats;

            return response()->json([
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil statistik dokter',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Transform doctor data for API response
     */
    private function transformDoctor(User $doctor, bool $includePatients = false): array
    {
        $data = [
            'id' => $doctor->id,
            'name' => $doctor->name,
            'email' => $doctor->email,
            'phone' => $doctor->phone,
            'address' => $doctor->address,
            'date_of_birth' => $doctor->date_of_birth?->format('Y-m-d'),
            'gender' => $doctor->gender,
            'specialization' => $doctor->specialization,
            'license_number' => $doctor->license_number,
            'role' => $doctor->role,
            'role_label' => $doctor->role_label,
            'email_verified_at' => $doctor->email_verified_at,
            'patient_count' => $doctor->patients()->aktif()->count(),
            'created_at' => $doctor->created_at,
            'updated_at' => $doctor->updated_at
        ];

        if ($includePatients && $doctor->relationLoaded('patients')) {
            $data['patients'] = $doctor->patients->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'nama' => $patient->nama,
                    'nomor_rekam_medis' => $patient->nomor_rekam_medis,
                    'telepon' => $patient->telepon,
                    'jenis_kelamin_label' => $patient->jenis_kelamin_label,
                    'umur' => $patient->umur,
                    'status_label' => $patient->status_label
                ];
            });
        }

        return $data;
    }

    /**
     * Get workload level based on patient count
     */
    private function getWorkloadLevel(int $patientCount): string
    {
        if ($patientCount === 0) {
            return 'none';
        } elseif ($patientCount <= 10) {
            return 'light';
        } elseif ($patientCount <= 30) {
            return 'moderate';
        } elseif ($patientCount <= 50) {
            return 'heavy';
        } else {
            return 'overloaded';
        }
    }
}