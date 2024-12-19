import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import HeaderAdmin from "./HeaderAdmin";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";

function RegistrarTrabajo() {
  const [usernames, setUsernames] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [priority, setPriority] = useState("MEDIA");
  const [quote, setQuote] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Spinner de carga

  const getToken = () => {
    return localStorage.getItem("authToken");
  };

  // Fetch usernames from the API
  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        setIsLoading(true);
        const token = getToken();
        if (!token) {
          setErrorMessage("Sesión expirada. Por favor, inicia sesión nuevamente.");
          setIsLoading(false);
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/lista-nombres-usuarios`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsernames(response.data);
        setErrorMessage(null);
      } catch (error) {
        console.error("Error al obtener los nombres de usuarios:", error);
        setErrorMessage("Error al cargar los nombres de usuarios.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsernames();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true); // Mostrar el spinner

    if (!selectedUser || !initialDescription || !priority || !quote || !jobDescription) {
      setErrorMessage("Todos los campos son obligatorios.");
      setIsLoading(false); // Ocultar el spinner si hay error
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
        setIsLoading(false); // Ocultar el spinner
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/crear-solicitud`,
        newRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSuccessMessage(response.data.message || "¡Trabajo registrado exitosamente!");
      setSelectedUser("");
      setInitialDescription("");
      setPriority("MEDIA");
      setQuote("");
      setJobDescription("");
    } catch (error) {
      console.error("Error al registrar el trabajo:", error);
      setErrorMessage(
        error.response?.data?.message || "Error al registrar el trabajo. Inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false); // Ocultar el spinner después de la solicitud
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <HeaderAdmin />
        <main className="p-6">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Registrar Trabajo</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mensajes */}
              {errorMessage && (
                <div className="bg-red-500 text-white p-4 rounded text-center">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="bg-green-500 text-white p-4 rounded text-center">
                  {successMessage}
                </div>
              )}

              {/* Usuario */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-200"
                >
                  Usuario
                </label>
                <select
                  id="username"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                >
                  <option value="">Seleccione un usuario</option>
                  {usernames.map((username, index) => (
                    <option key={index} value={username}>
                      {username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descripción Inicial */}
              <div>
                <label
                  htmlFor="initialDescription"
                  className="block text-sm font-medium text-gray-200"
                >
                  Descripción Inicial
                </label>
                <textarea
                  id="initialDescription"
                  value={initialDescription}
                  onChange={(e) => setInitialDescription(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded h-24"
                ></textarea>
              </div>

              {/* Prioridad */}
              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-200"
                >
                  Prioridad
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                >
                  <option value="ALTA">ALTA</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="BAJA">BAJA</option>
                </select>
              </div>

              {/* Cotización */}
              <div>
                <label
                  htmlFor="quote"
                  className="block text-sm font-medium text-gray-200"
                >
                  Cotización
                </label>
                <input
                  type="number"
                  id="quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded"
                  step="0.01"
                />
              </div>

              {/* Descripción del Trabajo */}
              <div>
                <label
                  htmlFor="jobDescription"
                  className="block text-sm font-medium text-gray-200"
                >
                  Descripción del Trabajo
                </label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 text-white p-2 rounded h-24"
                ></textarea>
              </div>

              {/* Botón Enviar */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Procesando...
                    </>
                  ) : (
                    "Registrar Trabajo"
                  )}
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
