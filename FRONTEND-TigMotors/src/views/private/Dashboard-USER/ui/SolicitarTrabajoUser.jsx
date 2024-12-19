import React, { useState, useEffect } from "react";
import {
  FaPencilAlt,
  FaSave,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import SidebarUser from "./SidebarUser";
import HeaderUsuario from "./HeaderUsuario";
import axios from "axios";

const SolicitarTrabajoUser = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [filteredSolicitudes, setFilteredSolicitudes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingSolicitud, setEditingSolicitud] = useState(null);
  const [editedDescriptions, setEditedDescriptions] = useState({});
  const [descripcionInicial, setDescripcionInicial] = useState("");
  const [prioridad, setPrioridad] = useState("ALTA");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  const getToken = () => localStorage.getItem("authToken");

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    filterSolicitudes();
  }, [solicitudes, searchTerm, statusFilter]);

  const fetchSolicitudes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/historial-solicitud`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setSolicitudes(response.data);
    } catch (error) {
      setMessage({
        text: "Error al obtener las solicitudes. Por favor, intente nuevamente.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterSolicitudes = () => {
    let filtered = solicitudes.filter(
      (sol) =>
        sol.idSolicitud.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sol.descripcionInicial.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (statusFilter) {
      filtered = filtered.filter((sol) => sol.estado === statusFilter);
    }
    setFilteredSolicitudes(filtered);
  };

  const handleCreateSolicitud = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/crear-solicitud`,
        { descripcionInicial, prioridad },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessage({ text: "Solicitud creada exitosamente.", type: "success" });
      fetchSolicitudes();
      setDescripcionInicial("");
      setPrioridad("ALTA");
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error al crear la solicitud.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDescription = async (id) => {
    setIsLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/modificar-solicitud/${id}`,
        { descripcionInicial: editedDescriptions[id] },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessage({ text: "Descripción actualizada exitosamente.", type: "success" });
      fetchSolicitudes();
      setEditingSolicitud(null);
    } catch (error) {
      setMessage({
        text: "Error al guardar la descripción.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/eliminar-solicitud/${id}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessage({ text: "Solicitud eliminada exitosamente.", type: "success" });
      fetchSolicitudes();
    } catch (error) {
      setMessage({
        text: "Error al eliminar la solicitud.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptCotizacion = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/aceptar-cotizacion/${id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessage({
        text: response.data?.message || "Cotización aceptada exitosamente.",
        type: "success",
      });
      fetchSolicitudes();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error al aceptar la cotización.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectCotizacion = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/rechazar-cotizacion/${id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessage({
        text: response.data?.message || "Cotización rechazada exitosamente.",
        type: "success",
      });
      fetchSolicitudes();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Error al rechazar la cotización.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedSolicitudes = filteredSolicitudes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredSolicitudes.length / itemsPerPage);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <SidebarUser />
      <div className="flex-1 flex flex-col">
        <HeaderUsuario />
        <main className="p-6 grid grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-2">
            <h2 className="text-xl font-bold mb-4 text-center">Solicitar Trabajo</h2>
            <textarea
              placeholder="Describa pieza y daño"
              value={descripcionInicial}
              onChange={(e) => setDescripcionInicial(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded mb-4"
            />
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
              className="w-full bg-gray-700 text-white p-2 rounded mb-4"
            >
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
            <button
              onClick={handleCreateSolicitud}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full"
              disabled={isLoading}
            >
              {isLoading ? <FaSpinner className="animate-spin" /> : "Crear Solicitud"}
            </button>
          </div>

          {/* Tabla */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-3">
            <h1 className="text-2xl font-bold mb-4 text-center">Historial de Solicitudes</h1>

            {/* Filtros */}
            <div className="flex justify-between mb-4">
              <input
                type="text"
                placeholder="Buscar por ID o descripción"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              >
                <option value="">Todos</option>
                <option value="ACEPTADO">Aceptado</option>
                <option value="RECHAZADO">Rechazado</option>
              </select>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-gray-700 text-white p-2 rounded"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
              <button
                onClick={fetchSolicitudes}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Recargar
              </button>
            </div>

            {/* Tabla */}
            <table className="table-auto w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-2 py-2">ID Solicitud</th>
                  <th className="px-2 py-2">Descripción Inicial</th>
                  <th className="px-2 py-2">Descripción de Trabajo</th>
                  <th className="px-2 py-2">Estado</th>
                  <th className="px-2 py-2">Prioridad</th>
                  <th className="px-2 py-2">Cotización</th>
                  <th className="px-2 py-2">Est Cotización</th>
                  <th className="px-2 py-2">Fecha</th>
                  <th className="px-2 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSolicitudes.map((sol) => (
                  <tr key={sol.idSolicitud} className="bg-gray-600">
                    <td className="px-4 py-2">{sol.idSolicitud}</td>
                    <td className="px-4 py-2">
                      {editingSolicitud === sol.idSolicitud ? (
                        <input
                          type="text"
                          value={editedDescriptions[sol.idSolicitud] || sol.descripcionInicial}
                          onChange={(e) =>
                            setEditedDescriptions({
                              ...editedDescriptions,
                              [sol.idSolicitud]: e.target.value,
                            })
                          }
                          className="bg-gray-700 text-white p-2 rounded"
                        />
                      ) : (
                        sol.descripcionInicial
                      )}
                    </td>
                    <td className="px-4 py-2">{sol.descripcionTrabajo || "En espera"}</td>
                    <td className="px-4 py-2">{sol.estado}</td>
                    <td className="px-4 py-2">{sol.prioridad}</td>
                    <td className="px-4 py-2">{sol.cotizacion || "N/A"}</td>
                    <td className="px-4 py-2">{sol.cotizacionAceptada || "N/A"}</td>
                    <td className="px-4 py-2">{sol.fechaCreacion || "N/A"}</td>
                    <td className="px-4 py-2 flex space-x-2">
                      {editingSolicitud === sol.idSolicitud ? (
                        <FaSave
                          onClick={() => handleSaveDescription(sol.idSolicitud)}
                          className="text-green-500 cursor-pointer"
                        />
                      ) : (
                        <FaPencilAlt
                          onClick={() => setEditingSolicitud(sol.idSolicitud)}
                          className="text-blue-500 cursor-pointer"
                        />
                      )}
                      <FaCheck
                        onClick={() => handleAcceptCotizacion(sol.idSolicitud)}
                        className="text-green-500 cursor-pointer"
                      />
                      <FaTimes
                        onClick={() => handleRejectCotizacion(sol.idSolicitud)}
                        className="text-red-500 cursor-pointer"
                      />
                      <FaTrash
                        onClick={() => handleDelete(sol.idSolicitud)}
                        className="text-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SolicitarTrabajoUser;
