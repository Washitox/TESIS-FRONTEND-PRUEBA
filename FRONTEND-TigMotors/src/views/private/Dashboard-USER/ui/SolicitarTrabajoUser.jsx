import React, { useState, useEffect } from "react";
import HeaderUsuario from "./HeaderUsuario";
import SidebarUser from "./SidebarUser";
import axios from "axios";
import { useForm } from "react-hook-form";

function SolicitarTrabajoUser() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [solicitudes, setSolicitudes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const fetchSolicitudes = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL_API_USER}/historial-solicitud`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSolicitudes(response.data);
    } catch (error) {
      console.error("Error al obtener solicitudes:", error);
    }
  };

  const filtrarSolicitudes = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const response = await axios.get(
        `http://localhost:8085/api-user/filtrar-solicitudes`,
        {
          params: { estado: estadoFiltro },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSolicitudes(response.data);
    } catch (error) {
      console.error("Error al filtrar solicitudes:", error);
    }
  };

  const onSubmit = async (data) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const requestData = {
      descripcionInicial: data.descripcionInicial,
      prioridad: data.prioridad,
    };

    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      await axios.post(
        "http://localhost:8085/api-user/crear-solicitud",    
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSuccessMessage("Solicitud enviada exitosamente.");
      reset();
      fetchSolicitudes();
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al enviar la solicitud."
      );
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const totalPages = Math.ceil(solicitudes.length / itemsPerPage);
  const paginatedSolicitudes = solicitudes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <SidebarUser />
      <div className="flex-1 flex flex-col">
        <HeaderUsuario />
        <main className="p-6 flex gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/4">
            <h2 className="text-xl font-bold mb-4">Solicitar Trabajo</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <fieldset className="space-y-1">
                <label htmlFor="descripcionInicial" className="block font-medium">
                  Describa pieza y daño
                </label>
                <textarea
                  id="descripcionInicial"
                  placeholder="Ingrese una descripción"
                  {...register("descripcionInicial", {
                    required: "La descripción es requerida.",
                  })}
                  className="w-full bg-gray-700 border-gray-600 text-white p-2 rounded"
                ></textarea>
                {errors.descripcionInicial && (
                  <p className="text-red-500">{errors.descripcionInicial.message}</p>
                )}
              </fieldset>
              <fieldset className="space-y-1">
                <label htmlFor="prioridad" className="block font-medium">
                  Prioridad
                </label>
                <select
                  id="prioridad"
                  {...register("prioridad", {
                    required: "La prioridad es requerida.",
                  })}
                  className="w-full bg-gray-700 border-gray-600 text-white p-2 rounded"
                >
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </select>
                {errors.prioridad && (
                  <p className="text-red-500">{errors.prioridad.message}</p>
                )}
              </fieldset>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
              >
                Solicitar Trabajo
              </button>
              {successMessage && <p className="text-green-500">{successMessage}</p>}
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </form>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Solicitudes</h2>
              <button
                onClick={fetchSolicitudes}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Recargar
              </button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <label htmlFor="itemsPerPage" className="block text-sm font-medium">
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
              <div>
                <label htmlFor="estadoFiltro" className="block text-sm font-medium">
                  Estado de Solicitud
                </label>
                <select
                  id="estadoFiltro"
                  value={estadoFiltro}
                  onChange={(e) => setEstadoFiltro(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600"
                >
                  <option value="">Todos</option>
                  <option value="ACEPTADA">Aceptadas</option>
                  <option value="PENDIENTE">Pendientes</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3">ID Solicitud</th>
                    <th className="p-3">Descripción Inicial</th>
                    <th className="p-3">Descripción Trabajo</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Prioridad</th>
                    <th className="p-3">Cotización</th>
                    <th className="p-3">Estado Cotización</th>
                    <th className="p-3">Fecha Creación</th>
                    <th className="p-3">Hora Creación</th>
                    <th className="p-3">Estado Pago</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSolicitudes.map((solicitud, idx) => (
                    <tr
                      key={solicitud.idSolicitud}
                      className={idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
                    >
                      <td className="p-3">{solicitud.idSolicitud || "No disponible"}</td>
                      <td className="p-3">{solicitud.descripcionInicial || "No disponible"}</td>
                      <td className="p-3">{solicitud.descripcionTrabajo || "No disponible"}</td>
                      <td className="p-3">{solicitud.estado || "No disponible"}</td>
                      <td className="p-3">{solicitud.prioridad || "No disponible"}</td>
                      <td className="p-3">
                        {solicitud.cotizacion !== null
                          ? `$${solicitud.cotizacion.toFixed(2)}`
                          : "No disponible"}
                      </td>
                      <td className="p-3">{solicitud.cotizacionAceptada || "No disponible"}</td>
                      <td className="p-3">
                        {solicitud.fechaCreacion
                          ? new Date(solicitud.fechaCreacion).toLocaleDateString()
                          : "No disponible"}
                      </td>
                      <td className="p-3">{solicitud.horaCreacion || "No disponible"}</td>
                      <td className="p-3">{solicitud.pago || "No disponible"}</td>
                      <td className="p-3">
                        <button
                          onClick={async () => {
                            try {
                              const token = getToken();
                              await axios.put(
                                `http://localhost:8085/api-user/aceptar-cotizacion/${solicitud.idSolicitud}`,
                                {},
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              fetchSolicitudes();
                              setSuccessMessage("Cotización aceptada correctamente.");
                            } catch (error) {
                              console.error(error);
                              setErrorMessage("Error al aceptar la cotización.");
                            }
                          }}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const token = getToken();
                              await axios.put(
                                `http://localhost:8085/api-user/rechazar-cotizacion/${solicitud.idSolicitud}`,
                                {},
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );
                              fetchSolicitudes();
                              setSuccessMessage("Cotización rechazada correctamente.");
                            } catch (error) {
                              console.error(error);
                              setErrorMessage("Error al rechazar la cotización.");
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Rechazar
                        </button>
                        <button
                          onClick={async () => {
                            const nuevaDescripcion = prompt(
                              "Ingrese nueva descripción inicial:"
                            );
                            if (nuevaDescripcion) {
                              try {
                                const token = getToken();
                                await axios.put(
                                  `http://localhost:8085/api-user/modificar-solicitud/${solicitud.idSolicitud}`,
                                  {
                                    descripcionInicial: nuevaDescripcion,
                                  },
                                  {
                                    headers: { Authorization: `Bearer ${token}` },
                                  }
                                );
                                fetchSolicitudes();
                                setSuccessMessage(
                                  "Descripción modificada correctamente."
                                );
                              } catch (error) {
                                console.error(error);
                                setErrorMessage(
                                  "Error al modificar la descripción inicial."
                                );
                              }
                            }
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                "¿Está seguro de que desea eliminar esta solicitud?"
                              )
                            ) {
                              try {
                                const token = getToken();
                                await axios.delete(
                                  `http://localhost:8085/api-user/eliminar-solicitud/${solicitud.idSolicitud}`,
                                  {
                                    headers: { Authorization: `Bearer ${token}` },
                                  }
                                );
                                fetchSolicitudes();
                                setSuccessMessage(
                                  "Solicitud eliminada correctamente."
                                );
                              } catch (error) {
                                console.error(error);
                                setErrorMessage("Error al eliminar la solicitud.");
                              }
                            }
                          }}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
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
              <span className="text-sm text-gray-400">
                Mostrando {currentPage * itemsPerPage - itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, solicitudes.length)} de {solicitudes.length} entradas
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-50"
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

export default SolicitarTrabajoUser;
