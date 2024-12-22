import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import HeaderAdmin from "./HeaderAdmin";
import axios from "axios";

function Trabajos() {
  const [tickets, setTickets] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterCriteria, setFilterCriteria] = useState({
    fechaInicio: "",
    fechaFin: "",
    username: "",
    prioridad: "",
    estado: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const filterTickets = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/filtrar-tickets`,
        filterCriteria,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTickets(response.data);
      setSuccessMessage("Filtros aplicados correctamente.");
    } catch (error) {
      console.error("Error al filtrar tickets:", error);
      setErrorMessage("Error al aplicar los filtros. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const changeTicketStatus = async (ticketId, newStatus) => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/${ticketId}/estado-ticket?nuevoEstado=${newStatus}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage(`Estado del ticket ${ticketId} cambiado a ${newStatus}.`);
      fetchTickets();
    } catch (error) {
      console.error("Error al cambiar el estado del ticket:", error);
      setErrorMessage("Error al cambiar el estado del ticket. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTickets.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <HeaderAdmin />

        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Trabajos</h1>

            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

            <div className="flex justify-between items-center mb-4">
              <button
                onClick={fetchTickets}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : "Recargar"}
              </button>

              <input
                type="text"
                placeholder="Buscar por ID o Usuario"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded w-64"
              />

              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-gray-700 text-white p-2 rounded"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="date"
                  placeholder="Fecha Inicio"
                  value={filterCriteria.fechaInicio}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({ ...prev, fechaInicio: e.target.value }))
                  }
                  className="bg-gray-700 text-white p-2 rounded"
                />
                <input
                  type="date"
                  placeholder="Fecha Fin"
                  value={filterCriteria.fechaFin}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({ ...prev, fechaFin: e.target.value }))
                  }
                  className="bg-gray-700 text-white p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Usuario"
                  value={filterCriteria.username}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({ ...prev, username: e.target.value }))
                  }
                  className="bg-gray-700 text-white p-2 rounded"
                />
                <select
                  value={filterCriteria.prioridad}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({ ...prev, prioridad: e.target.value }))
                  }
                  className="bg-gray-700 text-white p-2 rounded"
                >
                  <option value="">Todas</option>
                  <option value="ALTA">ALTA</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="BAJA">BAJA</option>
                </select>
                <select
                  value={filterCriteria.estado}
                  onChange={(e) =>
                    setFilterCriteria((prev) => ({ ...prev, estado: e.target.value }))
                  }
                  className="bg-gray-700 text-white p-2 rounded"
                >
                  <option value="">Todos</option>
                  <option value="TRABAJO_PENDIENTE">TRABAJO_PENDIENTE</option>
                  <option value="TRABAJO_EN_PROGRESO">TRABAJO_EN_PROGRESO</option>
                  <option value="TRABAJO_TERMINADO">TRABAJO_TERMINADO</option>
                </select>
              </div>

              <button
                onClick={filterTickets}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                disabled={isLoading}
              >
                {isLoading ? "Filtrando..." : "Filtrar"}
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
              <table className="w-full text-left table-auto">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3">ID Ticket</th>
                    <th className="p-3">Usuario</th>
                    <th className="p-3">ID Solicitud</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Descripción Inicial</th>
                    <th className="p-3">Descripción del Trabajo</th>
                    <th className="p-3">Prioridad</th>
                    <th className="p-3">Fecha de Creación</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((ticket, idx) => (
                    <tr key={ticket.id} className={idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}>
                      <td className="p-3">{ticket.id || "No disponible"}</td>
                      <td className="p-3">{ticket.username || "No disponible"}</td>
                      <td className="p-3">{ticket.solicitudId || "No disponible"}</td>
                      <td className="p-3">
                        <select
                          value={ticket.estado}
                          onChange={(e) => changeTicketStatus(ticket.id, e.target.value)}
                          className="bg-gray-700 text-white p-2 rounded"
                        >
                          <option value="TRABAJO_PENDIENTE">TRABAJO_PENDIENTE</option>
                          <option value="TRABAJO_EN_PROGRESO">TRABAJO_EN_PROGRESO</option>
                          <option value="TRABAJO_TERMINADO">TRABAJO_TERMINADO</option>
                        </select>
                      </td>
                      <td className="p-3">{ticket.descripcionInicial || "No disponible"}</td>
                      <td className="p-3">{ticket.descripcionTrabajo || "No disponible"}</td>
                      <td className="p-3">{ticket.prioridad || "No disponible"}</td>
                      <td className="p-3">
                        {ticket.fechaCreacion
                          ? new Date(ticket.fechaCreacion).toLocaleDateString()
                          : "No disponible"}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => fetchTickets()}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Actualizar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <p>
                Página {currentPage} de {totalPages}
              </p>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-gray-700 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Trabajos;
