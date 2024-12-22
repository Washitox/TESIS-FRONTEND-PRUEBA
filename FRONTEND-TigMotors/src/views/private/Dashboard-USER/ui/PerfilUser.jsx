import React, { useEffect, useState } from "react";
import HeaderUsuario from "./HeaderUsuario";
import SidebarUser from "./SidebarUser";
import axios from "axios";
import { FaEye, FaEyeSlash, FaPencilAlt } from "react-icons/fa";
import { Spinner } from 'keep-react';
function PerfilUser() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    businessName: "",
    email: "",
    phoneNumber: "",
  });
  const [editableFields, setEditableFields] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    repeatNewPassword: false,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const getToken = () => localStorage.getItem("authToken");

  const fetchUserInfo = async () => {
    setIsLoading(true); 
    try {
      const token = getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/informacion-usuario`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handlePasswordChange = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true); // Inicia el spinner
  
    if (passwords.newPassword !== passwords.repeatNewPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setIsLoading(false); // Detiene el spinner
      return;
    }
  
    const requestData = {
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    };
  
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        setIsLoading(false); // Detiene el spinner
        return;
      }
  
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/cambiar-contrasena`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      setSuccessMessage("Contraseña cambiada exitosamente.");
      setPasswords({ currentPassword: "", newPassword: "", repeatNewPassword: "" });
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al cambiar la contraseña."
      );
    } finally {
      setIsLoading(false); // Detiene el spinner
    }
  };
  

  const handleEditField = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: userInfo[field],
    }));
    setIsEditing(true);
  };

  const handleFieldChange = (field, value) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveField = async () => {
    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      for (const [key, value] of Object.entries(editableFields)) {
        const requestData = { [key]: value };
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api-user/actualizar-informacion`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      setSuccessMessage("Información actualizada exitosamente.");
      setEditableFields({});
      setIsEditing(false);
      fetchUserInfo();
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al actualizar la información."
      );
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar del usuario */}
      <SidebarUser />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header del usuario */}
        <HeaderUsuario />

        {/* Contenido del perfil */}
        <main className="p-6">

          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto">
          {isLoading && (
              <div className="flex justify-center my-4">
                <Spinner /> {/* Muestra el spinner */}
              </div>
            )}
            <h1 className="text-2xl font-bold mb-4 text-center">Perfil del Usuario</h1>

            {/* Información del perfil */}
            <div className="space-y-4">
              {["businessName", "email", "phoneNumber"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-400">
                    {field === "businessName"
                      ? "Empresa"
                      : field === "email"
                      ? "Correo Electrónico"
                      : "Teléfono"}
                  </label>
                  <div className="flex items-center gap-2">
                    {editableFields[field] !== undefined ? (
                      <input
                        type="text"
                        value={editableFields[field]}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                      />
                    ) : (
                      <div className="p-3 bg-gray-700 rounded-md flex-1">
                        {userInfo[field] || "N/A"}
                      </div>
                    )}
                    <button
                      onClick={() =>
                        editableFields[field] !== undefined
                          ? handleSaveField()
                          : handleEditField(field)
                      }
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <FaPencilAlt />
                    </button>
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-400">Nombre</label>
                <div className="p-3 bg-gray-700 rounded-md flex-1">
                  {userInfo.username || "N/A"}
                </div>
              </div>
            </div>


            {/* Botón de guardar */}
            {isEditing && (
              <div className="mt-6">
                <button
                  onClick={handleSaveField}
                  className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 rounded-md text-white font-semibold"
                >
                  Guardar Información
                </button>
              </div>
            )}

            {/* Mensajes */}
            {successMessage && (
              <p className="text-green-500 mt-4 text-center">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
            )}

            {/* Opciones de acciones */}
            <div className="mt-6 space-y-4">
              <button
                className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 rounded-md text-white font-semibold"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                Cambiar Contraseña
              </button>
            </div>

            {/* Formulario de cambiar contraseña */}
            {showChangePassword && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4 text-center">Cambiar Contraseña</h2>
                <div className="space-y-4">
                  {["currentPassword", "newPassword", "repeatNewPassword"].map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-400">
                        {key === "currentPassword"
                          ? "Contraseña Actual"
                          : key === "newPassword"
                          ? "Nueva Contraseña"
                          : "Repetir Nueva Contraseña"}
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords[key] ? "text" : "password"}
                          value={passwords[key]}
                          onChange={(e) =>
                            setPasswords({ ...passwords, [key]: e.target.value })
                          }
                          className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }))
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                        >
                          {showPasswords[key] ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handlePasswordChange}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                  >
                    Verificar y Cambiar Contraseña
                  </button>
                  {successMessage && (
                    <p className="text-green-500 mt-4 text-center">{successMessage}</p>
                  )}
                  {errorMessage && (
                    <p className="text-red-500 mt-4 text-center">{errorMessage}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PerfilUser;
