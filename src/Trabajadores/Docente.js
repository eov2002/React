import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const ListaDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [genderCount, setGenderCount] = useState({ M: 0, F: 0 });
    const [isDataUpdated, setIsDataUpdated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://alex.starcode.com.mx/apiBD.php');
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setDocentes(data);

                    const genderCounts = data.reduce(
                        (counts, docente) => {
                            if (docente.sexo === 'M') {
                                counts.M += 1;
                            } else if (docente.sexo === 'F') {
                                counts.F += 1;
                            }
                            return counts;
                        },
                        { M: 0, F: 0 }
                    );
                    setGenderCount(genderCounts);
                    setIsDataUpdated(true);
                } else {
                    throw new Error('Formato de datos no válido');
                }
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 3000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading && !isDataUpdated) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando datos...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', color: 'red' }}>Error: {error}</div>;
    }

    const data = {
        labels: ['Masculino', 'Femenino'],
        datasets: [
            {
                label: 'Cantidad de docentes por género',
                data: [genderCount.M, genderCount.F],
                backgroundColor: ['#4CAF50', '#FF4081'],
                borderColor: ['#388E3C', '#E91E63'],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333',
                    font: {
                        size: 14,
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    precision: 0,
                    color: '#666',
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: '#e0e0e0',
                },
            },
            x: {
                ticks: {
                    color: '#666',
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ textAlign: 'center', color: '#333', fontSize: '24px', marginBottom: '30px' }}>
                DOCENTES INGENIERÍA INFORMÁTICA TESSFP
            </h1>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                {docentes.map((docente) => (
                    <div
                        key={docente.claveiss}
                        style={{
                            width: '260px',
                            backgroundColor: '#f4f6f8',
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            padding: '20px',
                            textAlign: 'left',
                            color: '#333',
                        }}
                    >
                        <p style={{ fontSize: '16px', margin: '10px 0', fontWeight: 'bold', color: '#4CAF50' }}>Clave ISSEMYN: {docente.claveiss}</p>
                        <p style={{ fontSize: '15px', margin: '8px 0' }}>Nombre: <strong>{docente.nombre}</strong></p>
                        <p style={{ fontSize: '15px', margin: '8px 0' }}>Sexo: <strong>{docente.sexo}</strong></p>
                        <p style={{ fontSize: '15px', margin: '8px 0' }}>Teléfono: <strong>{docente.telefono}</strong></p>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '20px', color: '#333', marginBottom: '20px' }}>Distribución de Género de los Docentes</h2>
                <div style={{ width: '80%', margin: '0 auto', maxWidth: '600px' }}>
                    <Bar data={data} options={options} />
                </div>
            </div>
        </div>
    );
};

export default ListaDocentes;
