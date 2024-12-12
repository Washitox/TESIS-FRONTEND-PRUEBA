import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Estatus() {
  const [statusData, setStatusData] = useState({ Pendiente: 0, Aprobado: 0 });
  const [isFetching, setIsFetching] = useState(false);

  // Obtener el token de almacenamiento local
  const getToken = () => localStorage.getItem("authToken");

  const fetchStatusData = async () => {
    setIsFetching(true); // Iniciar estado de recarga

    try {
      const token = getToken();
      const response = await axios.get("http://localhost:8085/api/admin/users/status", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Mapear los datos directamente desde la respuesta del backend
      setStatusData({
        Pendiente: response.data["Pendiente"] || 0,
        Aprobado: response.data["Aprobado"] || 0,
      });
    } catch (error) {
      console.error("Error al obtener el estado de los usuarios:", error);
    } finally {
      setIsFetching(false); // Finalizar estado de recarga
    }
  };

  useEffect(() => {
    // Llamar a la función fetchStatusData al cargar el componente
    fetchStatusData();

    // Configurar un intervalo para actualizar los datos en tiempo real
    const interval = setInterval(() => {
      fetchStatusData();
    }, 15000); // Actualiza cada 15 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  // Configuración de la gráfica
  const chartData = {
    labels: ["Aprobado", "Pendiente"], // Etiquetas para las barras
    datasets: [
      {
        label: "Usuarios",
        data: [statusData.Aprobado, statusData.Pendiente], // Ordenado según las etiquetas
        backgroundColor: ["#4CAF50", "#FFC107"], // Colores para las barras
        borderColor: ["#388E3C", "#FF8F00"], // Color de borde
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Estado de las Solicitudes",
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-4">
      <h2 className="text-xl font-bold text-white mb-4">Estatus de las Solicitudes</h2>
      {isFetching ? (
        <div className="text-center text-white">Cargando...</div>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}
