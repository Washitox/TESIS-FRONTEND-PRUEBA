import React from "react";
import { Button } from "keep-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/TigMotors.png";

export default function HeaderCierre() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar el localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");

    // Redirigir al usuario a la página de inicio de sesión
    navigate("/");
  };

  return (
    <header className="z-30 w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-2 rounded-2xl bg-gray-900/90 px-5 before:pointer-events-none before:absolute before:inset-1 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] after:absolute after:inset-0 after:-z-10 after:backdrop-blur-sm">
          {/* Logo estático */}
          <div className="flex flex-1 items-center">
            <div className="flex items-center">
              <img
                src={logo}
                alt="Tig Motors Logo"
                className="rounded-full h-10"
              />
              <span className="ml-2 font-bold text-white">TigMotors</span>
            </div>
          </div>

          {/* Botón único de cerrar sesión */}
          <div className="flex items-center justify-end">
            <Button
              onClick={handleLogout} // Llamar a la función handleLogout
              color="danger"
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              //className="bg-gradient-to-b from-red-600 to-red-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-red-700 transition duration-300"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
