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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'doctor', 'nurse', 'staff'])->default('staff');
            
            // Additional profile information
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['L', 'P'])->nullable(); // L = Laki-laki, P = Perempuan
            
            // Doctor specific fields
            $table->string('specialization')->nullable(); // for doctors
            $table->string('license_number', 100)->nullable()->unique(); // for doctors
            
            $table->rememberToken();
            $table->timestamps();
            
            // Indexes for performance
            $table->index('role');
            $table->index('email_verified_at');
            $table->index(['role', 'email_verified_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};