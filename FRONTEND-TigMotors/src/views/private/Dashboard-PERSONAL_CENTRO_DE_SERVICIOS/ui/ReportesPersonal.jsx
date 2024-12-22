import React, { useState, useEffect } from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";
import axios from "axios";
import { FaFilter, FaTrash, FaFilePdf } from "react-icons/fa";

function ReportesPersonal() {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [formData, setFormData] = useState({
    fechaInicio: "",
    fechaFin: "",
    username: "",
    estadoPago: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15); 
  const [usernames, setUsernames] = useState([]); // Lista de nombres de usuario



  const getToken = () => localStorage.getItem("authToken");

  const formatDate = (date) => {
    if (!date) return null;
    const [year, month, day] = date.split("-");
    return `${year}/${month}/${day}`;
  };

  const fetchAllFacturas = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }
      const response = await axios.get(
        "http://localhost:8085/api/staff-cds/listado-facturas",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFacturas(response.data);
      setFilteredFacturas(response.data); // Mostrar todas las facturas al inicio
    } catch (error) {
      console.error("Error al obtener todas las facturas:", error);
      setErrorMessage("No se pudieron cargar las facturas.");
    }
  };

  const handleFilter = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }

      const payload = {};
      for (const [key, value] of Object.entries(formData)) {
        if (value) payload[key] = key.includes("fecha") ? formatDate(value) : value;
      }

      const response = await axios.post(
        "http://localhost:8085/api/staff-cds/listado-con-filtros",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const filteredData = response.data.facturas || [];
      setFilteredFacturas(filteredData);
      setSuccessMessage("Facturas filtradas con éxito.");
    } catch (error) {
      console.error("Error al filtrar las facturas:", error);
      setErrorMessage("No se pudieron filtrar las facturas.");
    }
  };

  const handleDownloadPDF = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }
  
      // Validar que las fechas están presentes y en el formato correcto
      if (!formData.fechaInicio || !formData.fechaFin) {
        setErrorMessage("Ambas fechas, inicio y fin, son obligatorias.");
        return;
      }
  
      const payload = {
        fechaInicio: formatDate(formData.fechaInicio), // Convertir al formato yyyy/MM/dd
        fechaFin: formatDate(formData.fechaFin), // Convertir al formato yyyy/MM/dd
        username: formData.username,
        estadoPago: formData.estadoPago,
      };
  
      const response = await axios.post(
        "http://localhost:8085/api/staff-cds/descargar-pdf",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          responseType: "blob", // Manejar la respuesta como archivo
        }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "facturas.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      setSuccessMessage("PDF descargado exitosamente.");
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      setErrorMessage(
        error.response?.data?.message || "No se pudo descargar el PDF."
      );
    }
  };
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Cambiar la cantidad de elementos por página
    setCurrentPage(1); // Reiniciar a la primera página después de cambiar
  };
  

  const handleClearFilters = () => {
    setFormData({
      fechaInicio: "",
      fechaFin: "",
      username: "",
      estadoPago: "",
    });
    setFilteredFacturas(facturas); // Resetear a todas las facturas
  };

  const fetchUsernames = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }
  
      const response = await axios.get(
        "http://localhost:8085/api/staff-cds/lista-nombres-usuarios",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsernames(response.data); // Guardar la lista de nombres en el estado
    } catch (error) {
      console.error("Error al obtener los nombres de usuario:", error);
      setErrorMessage("No se pudieron cargar los nombres de usuario.");
    }
  };
  

  useEffect(() => {
    fetchAllFacturas();
    fetchUsernames(); 
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 5000);
  
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  const totalPages = Math.ceil(filteredFacturas.length / itemsPerPage);
  const paginatedFacturas = filteredFacturas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  

  return (
    <div className="flex h-screen bg-gray-900">
      <SidebarPersonal />
      <div className="flex-1 flex flex-col">
        <HeaderPersonal />
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-white mb-6">Facturas</h1>
            {(errorMessage || successMessage) && (
              <div className="mb-4 text-center">
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
              </div>
            )}
            <div>
              <label className="text-sm text-gray-400 mr-1 ">Mostrar:</label>
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
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400">Fecha Inicio</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400">Fecha Fin</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                />
              </div>
              <div>
              <label className="block text-sm text-gray-400">Usuario</label>
              <select
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 text-white rounded"
              >
                <option value="">Seleccione un usuario</option>
                {usernames.map((user, index) => (
                  <option key={index} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>  
              <div>
                <label className="block text-sm text-gray-400">Estado de Pago</label>
                <select
                  name="estadoPago"
                  value={formData.estadoPago}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 text-white rounded"
                >
                  <option value="">Todos</option>
                  <option value="PENDIENTE_PAGO">Pendiente</option>
                  <option value="VALOR_PAGADO">Pagado</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={handleFilter}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                <FaFilter className="mr-2" /> Filtrar
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                <FaFilePdf className="mr-2" /> Descargar PDF
              </button>
              <button
                onClick={handleClearFilters}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                <FaTrash className="mr-2" /> Limpiar
              </button>
            </div>

            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
              <table className="w-full text-left">
                <thead className="bg-gray-700 text-white">
                  <tr>
                    <th className="p-3">ID Factura</th>
                    <th className="p-3">ID Ticket</th>
                    <th className="p-3">Usuario</th>
                    <th className="p-3">Prioridad</th>
                    <th className="p-3">Descripción Inicial</th>
                    <th className="p-3">Descripción del Trabajo</th>
                    <th className="p-3">Estado del Ticket</th>
                    <th className="p-3">Cotización</th>
                    <th className="p-3">Estado de Pago</th>
                    <th className="p-3">Fecha de Creación</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFacturas.map((factura, index) => (
                    <tr
                      key={factura.facturaId}
                      className={
                        index % 2 === 0
                          ? "bg-gray-600 text-white"
                          : "bg-gray-700 text-white"
                      }
                    >
                      <td className="p-3">{factura.facturaId}</td>
                      <td className="p-3">{factura.ticketId}</td>
                      <td className="p-3">{factura.username}</td>
                      <td className="p-3">
                        {factura.prioridad || "No disponible"}
                      </td>
                      <td className="p-3">{factura.descripcionInicial}</td>
                      <td className="p-3">{factura.descripcionTrabajo}</td>
                      <td className="p-3">{factura.estadoTicket}</td>
                      <td className="p-3">${factura.cotizacion}</td>
                      <td className="p-3">{factura.estadoPago}</td>
                      <td className="p-3">{factura.fechaCreacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-white">
                  Mostrando {currentPage * itemsPerPage - itemsPerPage + 1} -{" "}
                  {Math.min(currentPage * itemsPerPage, filteredFacturas.length)}{" "}
                  de {filteredFacturas.length} entradas
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

export default ReportesPersonal;
