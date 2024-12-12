import React, { useState, useEffect } from "react";
import HeaderUsuario from "./HeaderUsuario";
import SidebarUser from "./SidebarUser";
import axios from "axios";

function TrabajosUser() {
  const [trabajos, setTrabajos] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const fetchTrabajos = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.get("http://localhost:8085/api-user/historial-solicitud", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrabajos(response.data);
    } catch (error) {
      console.error("Error al obtener trabajos:", error);
      setErrorMessage("No se pudieron cargar los trabajos.");
    }
  };

  const handleFiltrar = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await axios.get(
        `http://localhost:8085/api-user/filtrar-trabajos`,
        {
          params: { fechaInicio, fechaFin },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTrabajos(response.data);
    } catch (error) {
      console.error("Error al filtrar trabajos:", error);
      setErrorMessage("Error al filtrar los trabajos.");
    }
  };

  const totalPages = Math.ceil(trabajos.length / itemsPerPage);
  const paginatedTrabajos = trabajos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchTrabajos();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar del usuario */}
      <SidebarUser />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header del usuario */}
        <HeaderUsuario />

        {/* Contenedor principal */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Trabajos Realizados</h1>
              <button
                onClick={fetchTrabajos}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Recargar
              </button>
            </div>

            {/* Controles superiores */}
            <div className="flex justify-between items-center mb-4">
              {/* Selección de elementos por página */}
              <div>
                <label htmlFor="itemsPerPage" className="block text-sm font-medium mb-1">
                  Mostrar
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>

              {/* Filtros por fecha */}
              <div className="flex items-center gap-4">
                <div>
                  <label htmlFor="fechaInicio" className="block text-sm font-medium">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded border border-gray-600"
                  />
                </div>
                <div>
                  <label htmlFor="fechaFin" className="block text-sm font-medium">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="bg-gray-700 text-white p-2 rounded border border-gray-600"
                  />
                </div>
                <button
                  onClick={handleFiltrar}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Filtrar
                </button>
              </div>
            </div>

            {/* Tabla de trabajos */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Descripción</th>
                    <th className="p-3">Prioridad</th>
                    <th className="p-3">Trabajo Realizado</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Fecha Inicio</th>
                    <th className="p-3">Fecha Fin</th>
                    <th className="p-3">Precio</th>
                    <th className="p-3">Valor Cancelado</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTrabajos.map((trabajo, idx) => (
                    <tr
                      key={trabajo.id}
                      className={idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
                    >
                      <td className="p-3">{trabajo.id}</td>
                      <td className="p-3">{trabajo.descripcion}</td>
                      <td className="p-3">{trabajo.prioridad}</td>
                      <td className="p-3">{trabajo.trabajoRealizado}</td>
                      <td className="p-3">{trabajo.estado}</td>
                      <td className="p-3">{trabajo.fechaInicio}</td>
                      <td className="p-3">{trabajo.fechaFin}</td>
                      <td className="p-3">{trabajo.precio}</td>
                      <td className="p-3">{trabajo.valorCancelado}</td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => console.log(`Ver detalles del trabajo ${trabajo.id}`)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => console.log(`Eliminar trabajo ${trabajo.id}`)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-400">
                Mostrando {currentPage * itemsPerPage - itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, trabajos.length)} de {trabajos.length} entradas
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Anterior
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Siguiente
                </button>
              </div>
            </div>

            {/* Mensajes de error */}
            {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
          </div>
        </main>
      </div>
    </div>
  );
}

export default TrabajosUser;
