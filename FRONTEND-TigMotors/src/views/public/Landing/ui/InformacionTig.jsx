import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Crear un ícono personalizado
const customIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Cambia por el ícono que prefieras
  iconSize: [40, 40], // Tamaño del ícono
  iconAnchor: [20, 40], // Punto donde el ícono está anclado
  popupAnchor: [0, -40], // Ajusta la posición del popup
});

export default function InformaciónTig() {
  // Ajustar coordenadas para ubicarlo más hacia la derecha en la intersección
  const position = [-0.14183332935872697, -78.43794066608825]; // Ajusta según sea necesario

  return (
    <section className="py-12 bg-gray-800 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start">
          {/* Información de Contacto */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-3xl font-bold mb-4">Información de Contacto</h2>
            <ul className="text-lg text-gray-300 space-y-4">
              <li>
                <strong>Número de celular del Maestro Victor Baño:</strong>{" "}
                <span className="text-gray-100">+593 981615291</span>
              </li>
              <li>
                <strong>Número de celular del personal Eliana Estrada:</strong>{" "}
                <span className="text-gray-100">+593 996316166</span>
              </li>
              <li>
                <strong>Correo electrónico personal:</strong>{" "}
                <span className="text-gray-100">timotors@yahoo.com</span>
              </li>
              <li>
                <strong>Correo electrónico de la página web:</strong>{" "}
                <span className="text-gray-100">tigmotors.inc.uio@gmail.com</span>
              </li>
            </ul>

            <h3 className="text-2xl font-semibold mt-8 mb-4">Ubicación</h3>
            <p className="text-lg text-gray-300">
              Sector Gualo, Calles la Dolorosa y 2 de Agosto
            </p>
          </div>

          {/* Mapa */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div
              style={{
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "15px",
                overflow: "hidden",
                width: "100%",
              }}
            >
              <MapContainer
                center={position}
                zoom={16} // Aumentar el zoom para mayor precisión
                style={{
                  height: "450px",
                  width: "100%",
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={position} icon={customIcon}>
                  <Popup>
                    <div className="text-center">
                      <strong>TigMotors</strong>
                      <p>Sector Gualo, Quito</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
