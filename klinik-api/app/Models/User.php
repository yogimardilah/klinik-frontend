<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'address',
        'date_of_birth',
        'gender',
        'specialization', // for doctors
        'license_number', // for doctors
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'date_of_birth' => 'date',
        'password' => 'hashed',
    ];

    /**
     * Available user roles
     */
    public const ROLES = [
        'admin' => 'Administrator',
        'doctor' => 'Dokter',
        'nurse' => 'Perawat',
        'staff' => 'Staff'
    ];

    /**
     * Check if user has specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user has any of the specified roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is doctor
     */
    public function isDoctor(): bool
    {
        return $this->hasRole('doctor');
    }

    /**
     * Check if user is nurse
     */
    public function isNurse(): bool
    {
        return $this->hasRole('nurse');
    }

    /**
     * Check if user is staff
     */
    public function isStaff(): bool
    {
        return $this->hasRole('staff');
    }

    /**
     * Get user's display name with role
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name . ' (' . (self::ROLES[$this->role] ?? 'Unknown') . ')';
    }

    /**
     * Get user's initials for avatar
     */
    public function getInitialsAttribute(): string
    {
        $words = explode(' ', $this->name);
        $initials = '';
        
        foreach ($words as $word) {
            $initials .= strtoupper(substr($word, 0, 1));
        }
        
        return substr($initials, 0, 2);
    }

    /**
     * Get role label
     */
    public function getRoleLabelAttribute(): string
    {
        return self::ROLES[$this->role] ?? 'Unknown';
    }

    /**
     * Scope query to specific role
     */
    public function scopeRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope query to doctors
     */
    public function scopeDoctors($query)
    {
        return $query->where('role', 'doctor');
    }

    /**
     * Scope query to nurses
     */
    public function scopeNurses($query)
    {
        return $query->where('role', 'nurse');
    }

    /**
     * Scope query to staff
     */
    public function scopeStaff($query)
    {
        return $query->where('role', 'staff');
    }

    /**
     * Scope query to verified users
     */
    public function scopeVerified($query)
    {
        return $query->whereNotNull('email_verified_at');
    }

    /**
     * Scope query to unverified users
     */
    public function scopeUnverified($query)
    {
        return $query->whereNull('email_verified_at');
    }

    /**
     * Relationship with patients (for doctors)
     */
    public function patients()
    {
        return $this->hasMany(Pasien::class, 'doctor_id');
    }

    /**
     * Get permissions based on role
     */
    public function getPermissions(): array
    {
        $permissions = [
            'admin' => [
                'users.create',
                'users.read',
                'users.update',
                'users.delete',
                'patients.create',
                'patients.read',
                'patients.update',
                'patients.delete',
                'doctors.create',
                'doctors.read',
                'doctors.update',
                'doctors.delete',
                'dashboard.read',
                'reports.read',
                'settings.update'
            ],
            'doctor' => [
                'patients.create',
                'patients.read',
                'patients.update',
                'dashboard.read',
                'schedule.read',
                'schedule.update'
            ],
            'nurse' => [
                'patients.read',
                'patients.update',
                'dashboard.read'
            ],
            'staff' => [
                'patients.read',
                'dashboard.read'
            ]
        ];

        return $permissions[$this->role] ?? [];
    }

    /**
     * Check if user has specific permission
     */
    public function hasPermission(string $permission): bool
    {
        return in_array($permission, $this->getPermissions());
    }
}