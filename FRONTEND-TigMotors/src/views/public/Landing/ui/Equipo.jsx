import React from "react";
import jefe from "../../../../assets/images/Jefe_TigMotors.png";
import secretaria from "../../../../assets/images/Secretaria_TigMotors.jpg";
import transportador from "../../../../assets/images/Transportador_TigMotors.png";
import trabajador from "../../../../assets/images/Trabajador_TigMotors.png";
import frontend from "../../../../assets/images/Tig-Imagen-Fondo.png";
import backend from "../../../../assets/images/Tig-Imagen-Fondo.png";

const equipo = [
  {
    nombre: "Maestro/Jefe",
    descripcion:
      "Dirige la empresa con experiencia en soldadura, asegurando que cada proyecto cumpla con los estándares más altos de calidad.",
    foto: jefe,
  },
  {
    nombre: "Secretaria",
    descripcion:
      "Encargada de la administración y la gestión de reportes para los clientes, garantizando un servicio ordenado y eficiente.",
    foto: secretaria,
  },
  {
    nombre: "Transportador",
    descripcion:
      "Responsable del envío y retiro de trabajos, además de realizar pruebas de calidad en cabezotes y piezas.",
    foto: transportador,
  },
  {
    nombre: "Trabajador",
    descripcion:
      "Especialista en el tratamiento de cabezotes y blocs, realiza cepillados y generación de piezas previas a la soldadura.",
    foto: trabajador,
  },
  {
    nombre: "Desarrollador FrontEnd",
    descripcion:
      "Encargado de la creación y mantenimiento de la página web, asegurando un diseño atractivo y funcional para la empresa.",
    foto: frontend,
  },
  {
    nombre: "Desarrollador BackEnd",
    descripcion:
      "Responsable de la base de datos y la funcionalidad de los sistemas, asegurando un flujo de trabajo eficiente.",
    foto: backend,
  },
];

export default function Equipo() {
  return (
    <section id="equipo" className="py-12 bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-8">Nuestro Equipo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {equipo.map((miembro, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-gray-900 p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
            >
              <img
                src={miembro.foto}
                alt={miembro.nombre}
                className="w-24 h-24 mb-4 rounded-full object-cover border-4 border-transparent hover:border-indigo-500 transition duration-300"
              />
              <h3 className="text-xl font-semibold mb-2">{miembro.nombre}</h3>
              <p className="text-gray-300 text-sm">{miembro.descripcion}</p>
            </div>
          ))}
        </div>

        {/* Línea divisoria */}
      <hr className="my-8 border-gray-700" />

        <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Tig Motors. Todos los derechos
              reservados.
            </p>
              </div>

      
    </section>
  );
}
