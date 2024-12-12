import React from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";

function TrabajosPersonal() {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <SidebarPersonal />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderPersonal />

        {/* Contenedor principal */}
        <main className="p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-white">Trabajos</h1>
            <p className="text-gray-400">
                Aquí puedes gestionar y visualizar los trabajos registrados en el sistema.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default TrabajosPersonal;
