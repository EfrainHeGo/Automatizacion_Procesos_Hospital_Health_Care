<?php

namespace App\Notifications;

use App\Models\Paciente;
use Illuminate\Support\Collection;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast; 
use Illuminate\Notifications\Messages\BroadcastMessage;

class NuevaSolicitudMedicamentos extends Notification implements ShouldBroadcast, ShouldQueue
{
    use Queueable;

    public $medicamentos;
    public $paciente;
    public $hojaId;

    /**
     * Create a new notification instance.
     */
    public function __construct(Collection $medicamentos, Paciente $paciente, int $hojaId)
    {
        $this->medicamentos = $medicamentos;
        $this->paciente = $paciente;
        $this->hojaId = $hojaId;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        $nombreCompleto = trim("{$this->paciente->nombre} {$this->paciente->apellido_paterno} {$this->paciente->apellido_materno}");
        return [
            'message' => "Nueva solicitud de {$this->medicamentos->count()} medicamento(s) para {$nombreCompleto}.",
            'paciente_id' => $this->paciente->id,
            'paciente_nombre' => $nombreCompleto,
            'meds_count' => $this->medicamentos->count(),
            'hoja_id' => $this->hojaId,
        ];
    }
}
