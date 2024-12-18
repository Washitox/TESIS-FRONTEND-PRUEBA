import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import HeaderAdmin from "./HeaderAdmin";
import axios from "axios";

function Trabajos() {
  const [tickets, setTickets] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Función para obtener el token
  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  // Función para obtener los tickets desde la API
  const fetchTickets = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/historial-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTickets(response.data);
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
      setErrorMessage("Error al obtener los tickets. Inténtalo de nuevo más tarde.");
    }
  };

  // Llamar a la función fetchTickets al montar el componente
  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar para la navegación */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Header superior */}
        <HeaderAdmin />

        {/* Contenido de la página */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Trabajos</h1>
            <p className="text-gray-400 mb-4">
              Aquí puedes gestionar y visualizar los trabajos registrados en el sistema.
            </p>

            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

            {/* Tabla de trabajos */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3">ID Ticket</th>
                    <th className="p-3">Usuario</th>
                    <th className="p-3">ID Solicitud</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Descripción Inicial</th>
                    <th className="p-3">Descripción del Trabajo</th>
                    <th className="p-3">Fecha de Creación</th>
                    <th className="p-3">Hora de Creación</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, idx) => (
                    <tr
                      key={ticket.id}
                      className={idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
                    >
                      <td className="p-3">{ticket.id || "No disponible"}</td>
                      <td className="p-3">{ticket.username || "No disponible"}</td>
                      <td className="p-3">{ticket.solicitudId || "No disponible"}</td>
                      <td className="p-3">{ticket.estado || "No disponible"}</td>
                      <td className="p-3">{ticket.descripcionInicial || "No disponible"}</td>
                      <td className="p-3">{ticket.descripcionTrabajo || "No disponible"}</td>
                      <td className="p-3">
                        {ticket.fechaCreacion
                          ? new Date(ticket.fechaCreacion).toLocaleDateString()
                          : "No disponible"}
                      </td>
                      <td className="p-3">{ticket.horaCreacion || "No disponible"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Trabajos;
