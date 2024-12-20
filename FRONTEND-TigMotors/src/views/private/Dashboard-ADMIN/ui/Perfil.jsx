import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import HeaderAdmin from "./HeaderAdmin";
import Estatus from "./Estatus";
import axios from "axios";

function Perfil() {
  const [profileData, setProfileData] = useState({
    username: "",
    businessName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const getToken = () => localStorage.getItem("authToken");

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/informacion-perfil`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfileData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos del perfil:", error);
      setErrorMessage(
        "Error al cargar los datos del perfil. Intente nuevamente más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderAdmin />

        {/* Contenido del perfil */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Perfil del Administrador
            </h1>

            {/* Mostrar mensajes de error o carga */}
            {isLoading ? (
              <p className="text-center text-gray-400">
                Cargando datos del perfil...
              </p>
            ) : errorMessage ? (
              <p className="text-center text-red-500">{errorMessage}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información básica del perfil */}
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold mb-4 text-center">
                    Información Básica
                  </h2>
                  <table className="table-fixed w-full text-sm text-gray-200">
                    <tbody>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Nombre:</td>
                        <td className="p-2">
                          {profileData.username || "No disponible"}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Empresa:</td>
                        <td className="p-2">
                          {profileData.businessName || "No disponible"}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Correo:</td>
                        <td className="p-2">
                          {profileData.email || "No disponible"}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Teléfono:</td>
                        <td className="p-2">
                          {profileData.phoneNumber || "No disponible"}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold w-1/3">Rol:</td>
                        <td className="p-2">{profileData.role || "No disponible"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Estadísticas de usuarios */}
                <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                  <h2 className="text-lg font-bold mb-4 text-center">
                    Estadísticas de Usuarios
                  </h2>
                  <div className="flex justify-center items-center h-full">
                    <Estatus />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Perfil;
