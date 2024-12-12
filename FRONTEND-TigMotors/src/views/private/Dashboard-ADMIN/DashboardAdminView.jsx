import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./ui/Sidebar";
import HeaderAdmin from "./ui/HeaderAdmin";
import Trabajos from "./ui/Trabajos";
import Usuarios from "./ui/Usuarios";
import SolicitudesTrabajo from "./ui/SolicitudesTrabajo";
import SolicitudesRegistro from "./ui/SolicitudesRegistro";
import RegistrarTrabajo from "./ui/RegistrarTrabajo";
import Perfil from "./ui/Perfil";
import Estatus from "./ui/Estatus";


export default function DashboardAdminView() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <HeaderAdmin />

        {/* Dynamic Content using Routes */}
        <main className="p-6 overflow-y-auto">

        <div className="bg-gray-800 p-6 rounded-lg">
            <h1 className="text-2xl font-bold">Bienvenido a tu panel de Administrador</h1>
            <p className="mt-4">
              Aquí puedes gestionar todos los trabajos como registarlos y recibir solicitudes de trabajos. También con los usuarios puedes aprobarlos, eliminarlos o registrarlos. Para comenzar seleciona una de las opciones de la izquierda.
            </p>
          </div>
          

        {/* Contenedor de la gráfica */}
        <div className="w-1/4 p-4 bg-gray-700 rounded-lg">
          <h2 className="text-lg font-bold mb-4 text-center">Estatus de las Solicitudes</h2>
          <Estatus />
        </div>

          <Routes>
            {/* Wrapper for Topbar */}
            <Route
              element={
                <>
                  <Sidebar />
                </>
              }
            >
              {/* Subroutes */}
              <Route path="/admin/trabajos" element={<Trabajos />} />
              <Route path="/admin/usuarios" element={<Usuarios />} />
              <Route path="/admin/solicitudes-trabajo" element={<SolicitudesTrabajo />} />
              <Route path="/admin/solicitudes-registro" element={<SolicitudesRegistro />} />
              <Route path="/admin/registrar-trabajo" element={<RegistrarTrabajo />} />
              <Route path="/admin/perfil" element={<Perfil />} />
              
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}
