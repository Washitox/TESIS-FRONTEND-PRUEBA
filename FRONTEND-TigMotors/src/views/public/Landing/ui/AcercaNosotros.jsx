import React from "react";
import logo from "../../../../assets/images/TigMotors.png";

export default function AcercaNosotros() {
  return (
    <section className="bg-gray-600 text-white py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="text-3xl font-bold text-center mb-6">
          Acerca de Nosotros
        </h2>
        <p className="text-center text-gray-300 mb-8">
        Con más de <strong>15 años de experiencia</strong>, nos hemos dedicado a ofrecer
          servicios de calidad y excelencia en el campo de la soldadura y reparación de
          cabezotes y motores. Nuestro equipo trabaja con pasión, esfuerzo y dedicación
          para garantizar la satisfacción de nuestros clientes en cada proyecto que
          emprendemos. Creemos en la innovación y en el trabajo bien hecho.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Imagen del logo */}
          <div className="flex items-center justify-center">
            <img
              src={logo}
              alt="Equipo TigMotors"
              className="w-40 h-auto rounded-lg shadow-lg" // Tamaño ajustado con w-40
            />
          </div>

          {/* Contenido descriptivo */}
          <div className="flex flex-col justify-center">
            <p className="text-gray-300 mb-4 leading-relaxed">
              Fundada con la misión de mejorar la calidad y precisión en cada reparación, TigMotors ha crecido para convertirse en un referente de confianza dentro del sector de la soldadura y rectificación de cabezotes o blocs. Nuestro equipo de expertos utiliza tecnología de punta y técnicas avanzadas para garantizar que cada trabajo supere las expectativas de nuestros clientes.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Ya sea que necesites una soldadura de alta precisión o un tratamiento completo para tus cabezotes, puedes confiar en nosotros. ¡Tu satisfacción es nuestra prioridad!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
