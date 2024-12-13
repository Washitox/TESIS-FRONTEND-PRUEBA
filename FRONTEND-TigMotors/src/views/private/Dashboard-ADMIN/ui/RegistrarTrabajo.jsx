import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import HeaderAdmin from "./HeaderAdmin";
import axios from "axios";

function RegistrarTrabajo() {
  const [usernames, setUsernames] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [priority, setPriority] = useState("MEDIA");
  const [quote, setQuote] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  // Fetch usernames from the API
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const token = getToken();
        if (!token) {
          setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
          return;
        }
        const response = await axios.get("http://localhost:8085/api/admin/lista-nombres-usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsernames(response.data);
      } catch (error) {
        console.error("Error al obtener los nombres de usuarios:", error);
        setErrorMessage("Error al cargar los nombres de usuarios.");
      }
    };

    fetchUsernames();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedUser || !initialDescription || !priority || !quote || !jobDescription) {
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }

    const newRequest = {
      username: selectedUser,
      descripcionInicial: initialDescription,
      prioridad: priority,
      cotizacion: parseFloat(quote).toFixed(2),
      descripcionTrabajo: jobDescription,
    };

    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
        return;
      }

      await axios.post("http://localhost:8085/api/admin/crear-solicitud", newRequest, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccessMessage("Trabajo registrado exitosamente.");
      setSelectedUser("");
      setInitialDescription("");
      setPriority("MEDIA");
      setQuote("");
      setJobDescription("");
    } catch (error) {
      console.error("Error al registrar el trabajo:", error);
      setErrorMessage("Error al registrar el trabajo. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar para la navegación */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Header superior */}
        <HeaderAdmin />

        {/* Contenido de la página */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/2 mx-auto">
            <h1 className="text-2xl font-bold mb-6">Registrar Trabajo</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              {successMessage && <p className="text-green-500">{successMessage}</p>}

              {/* Campo de selección de usuario */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-200">
                  Usuario
                </label>
                <select
                  id="username"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg shadow-sm focus:ring focus:ring-blue-500"
                >
                  <option value="">Seleccione un usuario</option>
                  {usernames.map((username, index) => (
                    <option key={index} value={username}>
                      {username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción inicial */}
              <div>
                <label htmlFor="initialDescription" className="block text-sm font-medium text-gray-200">
                  Descripción Inicial
                </label>
                <textarea
                  id="initialDescription"
                  value={initialDescription}
                  onChange={(e) => setInitialDescription(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg shadow-sm focus:ring focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Prioridad */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-200">
                  Prioridad
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg shadow-sm focus:ring focus:ring-blue-500"
                >
                  <option value="ALTA">ALTA</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="BAJA">BAJA</option>
                </select>
              </div>

              {/* Cotización */}
              <div>
                <label htmlFor="quote" className="block text-sm font-medium text-gray-200">
                  Cotización
                </label>
                <input
                  type="number"
                  id="quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg shadow-sm focus:ring focus:ring-blue-500"
                  step="0.01"
                />
              </div>

              {/* Descripción del trabajo */}
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-200">
                  Descripción del Trabajo
                </label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-lg shadow-sm focus:ring focus:ring-blue-500"
                ></textarea>
              </div>

              {/* Botón de envío */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegistrarTrabajo;
