import React, { useState } from 'react'; 
import { Paciente, Estancia, ProductoServicio, HojaEnfermeria, HojaSignosGraficas } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import InputTextArea from '@/components/ui/input-text-area';
import PrimaryButton from '@/components/ui/primary-button';

import MainLayout from '@/layouts/MainLayout';
import PacienteCard from '@/components/paciente-card';
import TerapiaIVForm from '@/components/terapia-iv-form';
import SignosVitalesForm from '@/components/signos-vitales-form';
import GraficaContent from '@/components/graphs/grafica-content'
import MedicamentosForm from '@/components/forms/medicamentos-form';
import SondasCateteresForm from '@/components/forms/sondas-cateteres-form';

interface CreateProps {
    paciente: Paciente;
    estancia: Estancia;
    hojaenfermeria: HojaEnfermeria;
    medicamentos: ProductoServicio[];
    soluciones: ProductoServicio[];
    dataParaGraficas: HojaSignosGraficas[];
}

type SeccionHoja = 'signos' | 'medicamentos' | 'terapia_iv' | 'estudios' | 'sondas' | 'liquidos' | 'dieta' | 'observaciones' | 'graficas';

const secciones: { id: SeccionHoja, label: string }[] = [
    { id: 'signos', label: 'Tomar Signos' },
    { id: 'medicamentos', label: 'Ministración de Medicamentos' },
    { id: 'terapia_iv', label: 'Terapia Intravenosa' },
    { id: 'estudios', label: 'Ordenar Estudios' },
    { id: 'sondas', label: 'Sondas y Catéteres' },
    { id: 'liquidos', label: 'Control de Líquidos' },
    { id: 'dieta', label: 'Dieta' },
    { id: 'observaciones', label: 'Observaciones' },
    { id: 'graficas', label: 'Gráficas' },
];

interface CerrarHojaProps {
    hoja: HojaEnfermeria;
    estanciaId: number; 
}

const CerrarHojaSection: React.FC<CerrarHojaProps> = ({ hoja, estanciaId }) => {
    
    const { put, processing } = useForm({
        estado: 'Cerrado',
    });

    const handleCerrarHoja = () => {
        Swal.fire({
            title: '¿Estás seguro de cerrar la hoja?',
            text: "Una vez cerrada, esta hoja de enfermería no podrá ser modificada.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33', 
            cancelButtonColor: '#3085d6', 
            confirmButtonText: 'Sí, ¡cerrar hoja!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                put(route('hojasenfermerias.update', { hojasenfermeria: hoja.id }), {

                    onSuccess: () => {
                         Swal.fire(
                            '¡Cerrada!',
                            'La hoja de enfermería ha sido cerrada.',
                            'success'
                        );
                        router.get(route('estancias.show', { estancia: estanciaId }));
                    },
                    onError: () => {
                        Swal.fire(
                            'Error',
                            'No se pudo cerrar la hoja. Intenta de nuevo.',
                            'error'
                        );
                    }
                });
            }
        });
    };

    if (hoja.estado === 'Cerrado') {
        return (
            <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-100" role="alert">
                <span className="font-medium">Hoja cerrada:</span> Esta hoja de enfermería ya ha sido finalizada y no puede ser editada.
            </div>
        );
    }

    return (
        <div className="p-4 mb-6 border border-red-300 rounded-lg bg-red-50">
            <h3 className="text-lg font-medium text-red-800">Cerrar hoja de enfermería</h3>
            <p className="mt-1 text-sm text-red-700">
                Esta acción finalizará la hoja de enfermería y la marcará como "Cerrada".
                No podrás realizar más cambios después de esto.
            </p>
            <div className="mt-4">
                <PrimaryButton
                    type="button"
                    className="bg-red-600 hover:bg-red-700 focus:bg-red-700 active:bg-red-800 focus:ring-red-500"
                    onClick={handleCerrarHoja}
                    disabled={processing}
                >
                    {processing ? 'Cerrando...' : 'Cerrar hoja permanentemente'}
                </PrimaryButton>
            </div>
        </div>
    );
}


type CreateComponent = React.FC<CreateProps> & {
    layout: (page: React.ReactElement) => React.ReactNode;
};

interface Props {
    hojasenfermeria: HojaEnfermeria
}

const Observaciones = ({hojasenfermeria}: Props) => {

    const { data, setData, put, processing, errors } = useForm({
        observaciones: hojasenfermeria.observaciones || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('hojasenfermerias.update', { hojasenfermeria: hojasenfermeria.id }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputTextArea
                id='observaciones'
                label='Observaciones'
                value={data.observaciones}
                onChange={e => setData('observaciones', e.target.value)}
                error={errors.observaciones}
            />

            <div className="mt-4">
                <PrimaryButton type='submit' disabled={processing}>
                    {processing ? 'Guardando...' : 'Guardar observaciones'}
                </PrimaryButton>
            </div>
        </form>
    )
}

const Create: CreateComponent = ({ paciente, estancia, hojaenfermeria ,medicamentos, soluciones, dataParaGraficas}) => {

    const [activeSection, setActiveSection] = useState<SeccionHoja>('signos');

    const NavigationTabs = () => (
        <nav className="mb-6 -mt-2">
            <div className="border-b border-gray-200">
                <div className="flex flex-wrap -mb-px gap-x-6 gap-y-2" aria-label="Tabs">
                    {secciones.map((seccion) => (
                        <button
                            key={seccion.id}
                            type="button" 
                            onClick={() => setActiveSection(seccion.id)}
                            className={`
                                ${activeSection === seccion.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                                whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150
                            `}
                        >
                            {seccion.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'signos':
                return <SignosVitalesForm 
                    hoja={hojaenfermeria}/>;
            case 'medicamentos':
                return <MedicamentosForm 
                        hoja={hojaenfermeria}
                        medicamentos={medicamentos}/>;
            case 'terapia_iv':
                return <TerapiaIVForm
                        hoja={hojaenfermeria}
                        soluciones={soluciones}/>;
            //case 'estudios':
            case 'sondas':
                return <SondasCateteresForm
                        hoja={hojaenfermeria}
                        estancia={estancia}/>
            case 'liquidos':
                return <div><p>Campos para Control de Líquidos...</p></div>;
            case 'dieta':
                return <div><p>Campos para Dieta...</p></div>;
            case 'observaciones':
                return <Observaciones
                        hojasenfermeria={hojaenfermeria}/>
            case 'graficas':
                return <GraficaContent
                        historialSignos={dataParaGraficas ?? []}/>
            default:
                return null;
        }
    }

    return (
        <> 
            <Head title="Hoja de enfermería" />
            <PacienteCard
                paciente={paciente}
                estancia={estancia}
            />
            <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2 mt-6 p-6">
                <CerrarHojaSection 
                    hoja={hojaenfermeria} 
                    estanciaId={estancia.id} 
                />
                
                <NavigationTabs />
                
                <div className="mt-4">
                    {renderActiveSection()}
                </div>
            </div>
        </>
    );
}

Create.layout = (page: React.ReactElement) => {
    return (
        <MainLayout pageTitle='Creación de hoja de enfermería' children={page} />
    );
}

export default Create;