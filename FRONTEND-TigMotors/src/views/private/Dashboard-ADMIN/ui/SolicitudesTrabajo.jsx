import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import HeaderAdmin from "./HeaderAdmin";
import axios from "axios";

function SolicitudesTrabajo() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Paginación
  const [rowsPerPage, setRowsPerPage] = useState(10); // Filas por página
  const [filterPriority, setFilterPriority] = useState(""); // Filtro de prioridad
  const [showFilterBox, setShowFilterBox] = useState(false); // Mostrar caja de filtro

  const [editingRow, setEditingRow] = useState(null); // Fila en edición
  const [editedValues, setEditedValues] = useState({}); // Valores editados

  const filterRef = useRef();

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const fetchSolicitudes = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }
      const response = await axios.get(
        "http://localhost:8085/api/admin/historial-solicitudes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSolicitudes(response.data);
    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
      setErrorMessage("Error al cargar las solicitudes.");
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleEdit = (idSolicitud) => {
    setEditingRow(idSolicitud);
    const solicitud = solicitudes.find((sol) => sol.idSolicitud === idSolicitud);
    setEditedValues({
      cotizacion: solicitud.cotizacion || "",
      descripcionTrabajo: solicitud.descripcionTrabajo || "",
    });
  };

  const handleSave = async (idSolicitud) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      // Aceptar la solicitud primero
      await axios.put(
        `http://localhost:8085/api/admin/aceptar/${idSolicitud}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Enviar datos editados
      await axios.put(
        `http://localhost:8085/api/admin/anadir-cotizacion/${idSolicitud}`,
        {
          cotizacion: parseFloat(editedValues.cotizacion),
          descripcionTrabajo: editedValues.descripcionTrabajo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Actualizar la fila en la tabla
      setSolicitudes((prevSolicitudes) =>
        prevSolicitudes.map((solicitud) =>
          solicitud.idSolicitud === idSolicitud
            ? {
                ...solicitud,
                cotizacion: editedValues.cotizacion,
                descripcionTrabajo: editedValues.descripcionTrabajo,
              }
            : solicitud
        )
      );

      setEditingRow(null);
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setErrorMessage("Error al guardar los datos.");
    }
  };

  const handleReject = async (idSolicitud) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }
      await axios.put(
        `http://localhost:8085/api/admin/rechazar-solicitud/${idSolicitud}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSolicitudes();
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al rechazar la solicitud:", error);
      setErrorMessage("Error al rechazar la solicitud.");
    }
  };

  const handleDelete = async (idSolicitud) => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }
      await axios.delete(
        `http://localhost:8085/api/admin/eliminar-solicitud/${idSolicitud}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSolicitudes();
      setErrorMessage(null);
    } catch (error) {
      console.error("Error al eliminar la solicitud:", error);
      setErrorMessage("Error al eliminar la solicitud.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const filteredSolicitudes = solicitudes.filter((solicitud) => {
    const matchesSearch =
      solicitud.idSolicitud.toString().includes(searchTerm) ||
      solicitud.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      !filterPriority || solicitud.prioridad === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredSolicitudes.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredSolicitudes.length / rowsPerPage);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex h-screen bg-gray-900 text-white">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col">
        <HeaderAdmin />

        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Solicitudes de Trabajo</h1>
              <button
                onClick={fetchSolicitudes}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Recargar
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <label className="text-gray-400 mr-2">Mostrar:</label>
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
              <input
                type="text"
                placeholder="Buscar por ID o Usuario"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded w-64"
              />
              <div className="relative">
                <button
                  onClick={() => setShowFilterBox((prev) => !prev)}
                  className="ml-2 bg-gray-600 text-white p-1 rounded"
                >
                  ▼ Prioridad
                </button>
                {showFilterBox && (
                  <div
                    ref={filterRef}
                    className="absolute bg-gray-700 text-white p-3 rounded shadow-lg top-10"
                  >
                    <button
                      onClick={() => setFilterPriority("")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setFilterPriority("ALTA")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      ALTA
                    </button>
                    <button
                      onClick={() => setFilterPriority("MEDIA")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      MEDIA
                    </button>
                    <button
                      onClick={() => setFilterPriority("BAJA")}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                      disabled={!solicitudes.some((solicitud) => solicitud.prioridad === "BAJA")}
                    >
                      BAJA
                    </button>
                  </div>
                )}
              </div>
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3">ID Solicitud</th>
                    <th className="p-3">Usuario</th>
                    <th className="p-3">Descripción Inicial</th>
                    <th className="p-3">Descripción del Trabajo</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Prioridad</th>
                    <th className="p-3">Cotización</th>
                    <th className="p-3">Estado de Cotización</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Hora</th>
                    <th className="p-3">Estado de Pago</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((solicitud, index) => (
                    <tr
                      key={solicitud.idSolicitud}
                      className={
                        index % 2 === 0 ? "bg-gray-600" : "bg-gray-700"
                      }
                    >
                      <td className="p-3">{solicitud.idSolicitud}</td>
                      <td className="p-3">{solicitud.username}</td>
                      <td className="p-3">{solicitud.descripcionInicial}</td>
                      <td className="p-3">
                        {editingRow === solicitud.idSolicitud ? (
                          <input
                            type="text"
                            name="descripcionTrabajo"
                            value={editedValues.descripcionTrabajo}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded w-full"
                          />
                        ) : (
                          solicitud.descripcionTrabajo || "N/A"
                        )}
                      </td>
                      <td className="p-3">{solicitud.estado}</td>
                      <td className="p-3">{solicitud.prioridad}</td>
                      <td className="p-3">
                        {editingRow === solicitud.idSolicitud ? (
                          <input
                            type="number"
                            name="cotizacion"
                            value={editedValues.cotizacion}
                            onChange={handleInputChange}
                            className="bg-gray-700 text-white p-2 rounded w-full"
                          />
                        ) : solicitud.cotizacion || "N/A"}
                      </td>
                      <td className="p-3">{solicitud.cotizacionAceptada || "No Aceptada"}</td>
                      <td className="p-3">{solicitud.fechaCreacion}</td>
                      <td className="p-3">{solicitud.horaCreacion}</td>
                      <td className="p-3">{solicitud.pago || "Pendiente"}</td>
                      <td className="p-3 flex space-x-2">
                        {editingRow === solicitud.idSolicitud ? (
                          <button
                            onClick={() => handleSave(solicitud.idSolicitud)}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                          >
                            Guardar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(solicitud.idSolicitud)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                          >
                            Editar
                          </button>
                        )}
                        <button
                          onClick={() => handleReject(solicitud.idSolicitud)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={() => handleDelete(solicitud.idSolicitud)}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Eliminar
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

export default SolicitudesTrabajo;
