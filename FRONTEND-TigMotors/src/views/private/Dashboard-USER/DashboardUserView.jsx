import React from "react";
import HeaderUsuario from "./ui/HeaderUsuario";
import SidebarUser from "./ui/SidebarUser";

function DashboardUserView() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar del usuario */}
      <SidebarUser />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header del usuario */}
        <HeaderUsuario />

        {/* Contenedor principal */}
        <main className="p-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h1 className="text-2xl font-bold">Bienvenido a tu panel de usuario</h1>
            <p className="mt-4">
              Aquí puedes gestionar tus trabajos, solicitar nuevos y ver tu perfil.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardUserView;
