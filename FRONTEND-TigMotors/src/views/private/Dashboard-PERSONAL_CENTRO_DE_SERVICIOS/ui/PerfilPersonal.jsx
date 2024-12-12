import React from "react";
import SidebarPersonal from "./SidebarPersonal";
import HeaderPersonal from "./HeaderPersonal";

function PerfilPersonal() {
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
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-white">Peril</h1>
            <p className="text-gray-400">
                Proximamente par aobtener el perfil
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PerfilPersonal;
