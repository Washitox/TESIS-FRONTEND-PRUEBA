import React from "react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

export default function FinalLanding() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Columna 1 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>Soldadura</li>
              <li>Pruebas Hidrostáticas</li>
              <li>Cepillados</li>
              <li>Torno</li>
              <li>Extras</li>
            </ul>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Compañía</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <ScrollLink
                  to="acerca-nosotros" // Id de la sección AcercaNosotros
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-indigo-400"
                >
                  Acerca de nosotros
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  to="equipo" // Id de la sección Equipo
                  smooth={true}
                  duration={500}
                  className="cursor-pointer hover:text-indigo-400"
                >
                  Equipo
                </ScrollLink>
              </li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Recursos</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>
                <Link
                  to="/terminos"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  to="/privacidad"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contáctanos</h4>
            <ul className="text-gray-400 text-sm space-y-2">
              <li>Correo: tigmotors.inc.uio@gmail.com</li>
              <li>Teléfono: +593 981615291</li>
              <li>WhatsApp: +593 981615291</li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr className="my-8 border-gray-700" />

        {/* Derechos reservados */}
        <div className="flex flex-col lg:flex-row justify-between items-center">
          
          <div className="flex space-x-4 mt-4 lg:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
              aria-label="GitHub"
            >
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
