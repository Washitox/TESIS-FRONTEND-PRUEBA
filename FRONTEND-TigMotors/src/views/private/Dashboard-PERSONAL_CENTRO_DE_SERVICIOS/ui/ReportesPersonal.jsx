import React from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";

function ReportesPersonal() {
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
                <h1 className="text-2xl font-bold mb-6 text-white">Reportes</h1>
                <p className="text-gray-400">
                    Aquí se generarn reportes por id, con usuario, trabajos, fecha de inicio y de fin, el precio y el estado si está cancelado, o debiendo.
                </p>
            </div>
        </main>
      </div>
    </div>
  );
}

export default ReportesPersonal;
