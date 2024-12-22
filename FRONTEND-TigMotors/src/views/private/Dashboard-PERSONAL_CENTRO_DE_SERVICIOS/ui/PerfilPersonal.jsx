import React, { useEffect, useState } from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";
import axios from "axios";

function PerfilPersonal() {
  const [staffInfo, setStaffInfo] = useState({
    username: "",
    businessName: "",
    email: "",
    phoneNumber: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const getToken = () => localStorage.getItem("authToken");

  const fetchStaffInfo = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/staff-cds/informacion-perfil`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStaffInfo(response.data);
    } catch (error) {
      console.error("Error al obtener la información del perfil:", error);
      setErrorMessage(
        "No se pudo cargar la información del perfil. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffInfo();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <SidebarPersonal />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderPersonal />

        {/* Contenido del perfil */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-white">
              Información del Perfil
            </h1>
            {loading ? (
              <p className="text-center text-gray-400">Cargando información...</p>
            ) : errorMessage ? (
              <p className="text-center text-red-500">{errorMessage}</p>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Nombre de Usuario
                  </label>
                  <p className="bg-gray-700 text-white p-3 rounded">
                    {staffInfo.username || "No disponible"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Empresa
                  </label>
                  <p className="bg-gray-700 text-white p-3 rounded">
                    {staffInfo.businessName || "No disponible"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Correo Electrónico
                  </label>
                  <p className="bg-gray-700 text-white p-3 rounded">
                    {staffInfo.email || "No disponible"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Teléfono
                  </label>
                  <p className="bg-gray-700 text-white p-3 rounded">
                    {staffInfo.phoneNumber || "No disponible"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Rol
                  </label>
                  <p className="bg-gray-700 text-white p-3 rounded">
                    {staffInfo.role || "No disponible"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PerfilPersonal;
