import React, { useState, useEffect } from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa";

function UsuariosPersonal() {
  const [usuarios, setUsuarios] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

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

            <div className="overflow-x-auto">
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
                  {usuarios.map((usuario, idx) => (
                    <tr
                      key={usuario.id}
                      className={idx % 2 === 0 ? "bg-gray-600" : "bg-gray-700"}
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
          </div>
        </main>
      </div>
    </div>
  );
}

export default UsuariosPersonal;
