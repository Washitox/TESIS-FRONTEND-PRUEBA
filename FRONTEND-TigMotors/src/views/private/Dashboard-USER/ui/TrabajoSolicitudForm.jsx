import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function TrabajoSolicitudForm({ fetchSolicitudes }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const getToken = () => localStorage.getItem("authToken");

  const onSubmit = async (data) => {
    try {
      const token = getToken();
      if (!token) {
        alert("Sesión expirada. Inicia sesión nuevamente.");
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api-user/crear-solicitud`,
        {
          descripcionInicial: data.descripcionInicial,
          prioridad: data.prioridad,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      reset();
      fetchSolicitudes(); // Recargar solicitudes después de crear una nueva
      alert("Solicitud creada correctamente.");
    } catch (error) {
      console.error("Error al crear solicitud:", error);
      alert("Error al crear la solicitud.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Solicitar Trabajo</h2>

      {/* Descripción Inicial */}
      <div>
        <label className="block font-medium mb-1">Describa pieza y daño</label>
        <textarea
          {...register("descripcionInicial", { required: "La descripción es requerida." })}
          placeholder="Ingrese la descripción"
          className="w-full bg-gray-700 border-gray-600 text-white p-2 rounded"
        ></textarea>
        {errors.descripcionInicial && (
          <p className="text-red-500">{errors.descripcionInicial.message}</p>
        )}
      </div>

      {/* Prioridad */}
      <div>
        <label className="block font-medium mb-1">Prioridad</label>
        <select
          {...register("prioridad", { required: "La prioridad es requerida." })}
          className="w-full bg-gray-700 border-gray-600 text-white p-2 rounded"
        >
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Media</option>
          <option value="BAJA">Baja</option>
        </select>
        {errors.prioridad && <p className="text-red-500">{errors.prioridad.message}</p>}
      </div>

      {/* Botón de envío */}
      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
        Crear Solicitud
      </button>
    </form>
  );
}

export default TrabajoSolicitudForm;
