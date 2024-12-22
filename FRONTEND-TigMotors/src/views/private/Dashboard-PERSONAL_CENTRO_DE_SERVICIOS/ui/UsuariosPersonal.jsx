import React, { useState, useEffect } from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";

function UsuariosPersonal() {
  const [usuarios, setUsuarios] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  const fetchUsuarios = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("No se encontró un token de autenticación.");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/staff-cds/lista-usuarios`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setErrorMessage("No se pudieron cargar los usuarios.");
    }
  };

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.id.toString().includes(searchTerm) ||
      usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredUsuarios.length / itemsPerPage);

  const openWhatsapp = (phoneNumber) => {
    const formattedNumber = phoneNumber.replace("+", "");
    window.open(`https://wa.me/${formattedNumber}`, "_blank");
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <SidebarPersonal />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderPersonal />

        {/* Contenido de la página */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-white">
              Usuarios para contactar
            </h1>

            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}

            {/* Controles superiores */}
            <div className="flex justify-between items-center mb-4">
              {/* Mostrar elementos por página */}
              <div>
                <label
                  htmlFor="itemsPerPage"
                  className="block text-sm font-medium mb-1"
                >
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

              {/* Filtro por ID o usuario */}
              <div>
                <label
                  htmlFor="searchTerm"
                  className="block text-sm font-medium mb-1"
                >
                  Buscar por ID o usuario
                </label>
                <input
                  type="text"
                  id="searchTerm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded border border-gray-600"
                />
              </div>

              {/* Botón de recargar */}
              <button
                onClick={fetchUsuarios}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Recargar
              </button>
            </div>

            {/* Tabla de usuarios */}
            <div className="overflow-x-auto overflow-y-auto max-h-[400px]">
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Usuario</th>
                    <th className="p-3">Nombre de Negocio</th>
                    <th className="p-3">Teléfono</th>
                    <th className="p-3">Correo</th>
                    <th className="p-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsuarios.map((usuario, idx) => (
                    <tr
                      key={usuario.id}
                      className={
                        idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"
                      }
                    >
                      <td className="p-3">{usuario.id}</td>
                      <td className="p-3">{usuario.username}</td>
                      <td className="p-3">{usuario.businessName}</td>
                      <td className="p-3">{usuario.phoneNumber}</td>
                      <td className="p-3">{usuario.email}</td>
                      <td className="p-3">
                        <button
                          onClick={() => openWhatsapp(usuario.phoneNumber)}
                          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                          title="Abrir WhatsApp"
                        >
                          <FaWhatsapp />
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
                {Math.min(currentPage * itemsPerPage, filteredUsuarios.length)}{" "}
                de {filteredUsuarios.length} usuarios
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
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

export default UsuariosPersonal;
