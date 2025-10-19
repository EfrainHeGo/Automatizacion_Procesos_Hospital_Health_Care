<?php

namespace Database\Seeders;

use App\Models\CredencialEmpleado;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        $userJuan = User::create([
            'curp' => 'JUAP850101HDFLRS01',
            'nombre' => 'Juan',
            'apellido_paterno' => 'Pérez',
            'apellido_materno' => 'Ramírez',
            'sexo' => 'Masculino',
            'fecha_nacimiento' => '1985-01-01',
            'email' => 'juan.perez@hospital.com',
            'password' => Hash::make('password123'),
            'cargo_id' => 6,
        ]);

        $userJuan->colaborador_responsable_id = $userJuan->id;
        $userJuan->save();

        $userMaria = User::create([
            'curp' => 'MALO900214MDFLPS02',
            'nombre' => 'María',
            'apellido_paterno' => 'López',
            'apellido_materno' => 'Santos',
            'sexo' => 'Femenino',
            'fecha_nacimiento' => '1990-02-14',
            'email' => 'maria.lopez@hospital.com',
            'colaborador_responsable_id' => $userJuan->id, 
            'password' => Hash::make('password123'),
            'cargo_id' => 5,
        ]);
        CredencialEmpleado::create([
            'user_id' => $userMaria->id,
            'titulo' => 'Licenciatura en Enfermería',
            'cedula_profesional' => '7654321'
        ]);

        $userCarlos = User::create([
            'curp' => 'CARA820710HDFRMR03',
            'nombre' => 'Carlos',
            'apellido_paterno' => 'Ramírez',
            'apellido_materno' => 'Moreno',
            'sexo' => 'Masculino',
            'fecha_nacimiento' => '1982-07-10',
            'colaborador_responsable_id' => $userJuan->id, 
            'email' => 'carlos.ramirez@hospital.com',
            'password' => Hash::make('password123'),
            'cargo_id' => 4,
        ]);

       
        User::create([
            'curp' => 'LAHE880320MDFHND04',
            'nombre' => 'Laura',
            'apellido_paterno' => 'Hernández',
            'apellido_materno' => 'Díaz',
            'sexo' => 'Femenino',
            'fecha_nacimiento' => '1988-03-20',
            'colaborador_responsable_id' => $userCarlos->id, 
            'email' => 'laura.hernandez@hospital.com',
            'password' => Hash::make('password123'),
            'cargo_id' => 3,
        ]);

        $userAndres = User::create([
            'curp' => 'ANGG910923HDFGLZ05',
            'nombre' => 'Andrés',
            'apellido_paterno' => 'González',
            'apellido_materno' => 'Luna',
            'sexo' => 'Masculino',
            'fecha_nacimiento' => '1991-09-23',
            'colaborador_responsable_id' => $userMaria->id, 
            'email' => 'andres.gonzalez@hospital.com',
            'password' => Hash::make('password123'),
            'cargo_id' => 1,
        ]);

        $user = User::create([
            'curp' => 'SOMA950105MDFMRT06',
            'nombre' => 'Sofía',
            'apellido_paterno' => 'Martínez',
            'apellido_materno' => 'Rojas',
            'sexo' => 'Femenino',
            'fecha_nacimiento' => '1995-01-05',
            'colaborador_responsable_id' => $userAndres->id, 
            'email' => 'sofia.martinez@hospital.com',
            'password' => Hash::make('password123'),
            'cargo_id' => 2,
        ]);

        CredencialEmpleado::create([
            'user_id' => $user->id,
            'titulo' => 'Médico Especialista en Cirugía General',
            'cedula_profesional' => '9123456' 
        ]);

        CredencialEmpleado::create([
            'user_id' => $user->id,
            'titulo' => 'Médico Especialista en Pediatría',
            'cedula_profesional' => '8765432'
        ]);

        $user = User::create([
            'curp' => 'TIMK040210HMSRDVA6',
            'nombre' => 'Kevin Yahir',
            'apellido_paterno' => 'Trinidad',
            'apellido_materno' => 'Medina',
            'sexo' => 'Masculino', 
            'fecha_nacimiento' => '2004-02-10',
            'email' => 'kevinyahirt@gmail.com',
            'password' => Hash::make('12345678'),
            'cargo_id' => 2,
        ]);

        CredencialEmpleado::create([
            'user_id' => $user->id,
            'titulo' => 'Médico Especialista en Pediatría',
            'cedula_profesional' => '8765432'
        ]);
    }
}
