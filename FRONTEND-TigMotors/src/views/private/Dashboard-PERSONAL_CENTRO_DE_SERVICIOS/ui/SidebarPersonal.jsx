import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBriefcase, FaFileAlt, FaUser, FaUsers, FaMoneyCheckAlt } from "react-icons/fa"; // Importar el nuevo icono

function SidebarPersonal() {
  const location = useLocation();

  // Opciones del menú
  const menuItems = [
    { name: "Trabajos", path: "/personal/trabajos", icon: <FaBriefcase /> },
    { name: "Estado de Pago", path: "/personal/estado-pago", icon: <FaMoneyCheckAlt /> }, // Nueva sección
    { name: "Usuarios", path: "/personal/usuarios", icon: <FaUsers /> },
    { name: "Generar Reportes", path: "/personal/reportes", icon: <FaFileAlt /> },
    { name: "Perfil", path: "/personal/perfil", icon: <FaUser /> },
  ];

  return (
    <aside className="w-64 bg-gray-800 h-full flex flex-col">
      {/* Encabezado del sidebar */}
      <div className="p-4 text-center font-bold text-lg border-b border-gray-700 text-white">
        TigMotors Personal
      </div>

      {/* Navegación */}
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg ${
                  location.pathname === item.path
                    ? "bg-indigo-600 text-white" // Enlace activo
                    : "hover:bg-gray-700 text-gray-400" // Enlace inactivo
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default SidebarPersonal;
