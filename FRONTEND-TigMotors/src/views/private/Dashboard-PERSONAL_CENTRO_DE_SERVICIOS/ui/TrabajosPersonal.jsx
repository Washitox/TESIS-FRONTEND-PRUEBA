import React, { useState, useEffect } from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";
import axios from "axios";

function TrabajosPersonal() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    username: "",
    prioridad: "",
    estado: "",
  });
  const [isFiltering, setIsFiltering] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Cambiar la cantidad de elementos por página
    setCurrentPage(1); // Reiniciar a la primera página después de cambiar
  };
  

  const getToken = () => localStorage.getItem("authToken");

  // Convertir fecha al formato requerido
  const formatDate = (date) => {
    if (!date) return null;
    const [year, month, day] = date.split("-");
    return `${year}/${month}/${day}`;
  };

  const fetchTickets = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }
      const response = await axios.get(
        "http://localhost:8085/api/staff-cds/historial-tickets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTickets(response.data);
      setFilteredTickets(response.data); // Mostrar todos los datos inicialmente
    } catch (error) {
      console.error("Error al obtener los tickets:", error);
      setErrorMessage("No se pudieron cargar los tickets.");
    }
  };

  const handleFilter = async () => {
    setIsFiltering(true);
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }

      // Crear el payload dinámico sin campos vacíos
      const payload = {};
      for (const [key, value] of Object.entries(formData)) {
        if (value) {
          payload[key] = key.includes("fecha") ? formatDate(value) : value;
        }
      }

      const response = await axios.post(
        "http://localhost:8085/api/staff-cds/filtrar-tickets",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFilteredTickets(response.data);
    } catch (error) {
      console.error("Error al filtrar tickets:", error);
      setErrorMessage("No se pudieron filtrar los tickets.");
    } finally {
      setIsFiltering(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFormData({
      fechaInicio: "",
      fechaFin: "",
      username: "",
      prioridad: "",
      estado: "",
    });
    setFilteredTickets(tickets); // Mostrar todos los datos
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <SidebarPersonal />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderPersonal />

        {/* Contenedor principal */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-white">Tickets</h1>
            <div>
              <label className="text-sm text-gray-400 mr-2">Mostrar:</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="p-2 bg-gray-700 text-white rounded"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
            {/* Formulario de filtros */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Ingrese nombre de usuario"
                  className="w-full bg-gray-700 text-white p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Prioridad
                </label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white p-2 rounded"
                >
                  <option value="">Todas</option>
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white p-2 rounded"
                >
                  <option value="">Todos</option>
                  <option value="TRABAJO_PENDIENTE">Pendiente</option>
                  <option value="TRABAJO_EN_PROGRESO">En Progreso</option>
                  <option value="TRABAJO_TERMINADO">Terminado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <button
                onClick={handleFilter}
                disabled={isFiltering}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                {isFiltering ? "Filtrando..." : "Filtrar"}
              </button>
              <button
                onClick={handleClearFilters}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Limpiar Filtros
              </button>
            </div>

            {/* Tabla de tickets */}
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
              <table className="w-full text-left">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Usuario</th>
                    <th className="p-3">ID Solicitud</th>
                    <th className="p-3">Prioridad</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Descripción Inicial</th>
                    <th className="p-3">Descripción del Trabajo</th>
                    <th className="p-3">Fecha Creación</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTickets.map((ticket, idx) => (
                    <tr
                      key={ticket.id}
                      className={
                        idx % 2 === 0 ? "bg-gray-600 text-white" : "bg-gray-700 text-white"
                      }
                    >
                      <td className="p-3">{ticket.id}</td>
                      <td className="p-3">{ticket.username}</td>
                      <td className="p-3">{ticket.solicitudId}</td>
                      <td className="p-3">
                        {ticket.prioridad || "No disponible"}
                      </td>
                      <td className="p-3">{ticket.estado}</td>
                      <td className="p-3">{ticket.descripcionInicial}</td>
                      <td className="p-3">{ticket.descripcionTrabajo}</td>
                      <td className="p-3">{ticket.fechaCreacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-white">
                Mostrando{" "}
                {currentPage * itemsPerPage - itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, filteredTickets.length)}{" "}
                de {filteredTickets.length} entradas
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TrabajosPersonal;
