import React from "react";
import Slider from "react-slick";
import sueldaenfrio from "../../../../assets/images/Suelda en frio.png";
import sueldainjerto from "../../../../assets/images/Suelda en injerto.png"
import rellenosuperficies from "../../../../assets/images/Relleno de superficies.png"
import verificacion from "../../../../assets/images/Verificacion de pruebas.png"
import diagnostico from "../../../../assets/images/Diagnostico.png"
import cepillados from "../../../../assets/images/Cepillado.png"
import fabricacion from "../../../../assets/images/Crear piezas.png"
import camisillas from "../../../../assets/images/Cambio de camisillas.png"
import helicoides from "../../../../assets/images/Colocación de helicoides.png"
import tintas from "../../../../assets/images/Colocación de tintes.png"
import asesoria from "../../../../assets/images/Asesoria de sueldas.png"
import lavado from "../../../../assets/images/Limpieza de blocks.png"
import transporte from "../../../../assets/images/Servicio de transporte.png"
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


export default function TrabajosTig() {
  const trabajos = [
    {
      title: "Soldadura",
      images: [sueldaenfrio, sueldainjerto, rellenosuperficies],
      description: [
        "Suelda en frío",
        "Suelda en Injerto",
        "Relleno de superficies",
      ],
    },
    {
      title: "Pruebas Hidrostática",
      images: [verificacion, diagnostico], 
      description: [
        "Verificación",
        "Diagnóstico",
        "Fisuras en Bloc o Cabezotes",
      ],
    },
    {
      title: "Cepillados",
      images: [cepillados],
      description: ["Nivelación de superficies"],
    },
    {
      title: "Torno",
      images: [fabricacion], 
      description: ["Fabricación de piezas"],
    },
    {
      title: "Extras",
      images: [camisillas, helicoides, tintas, asesoria, lavado, transporte],
      description: [
        "Cambio de camisillas",
        "Colocación de Helicoides",
        "Colocación de Tintas",
        "Asesoría de sueldas",
        "Lavado de Bloc o Cabezotes",
        "Servicio de transporte de piezas (Sector norte bajo – Amazonas hasta Carapungo)",
      ],
    },
  ];

  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-8">Nuestros Servicios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trabajos.map((trabajo, index) => (
            <TrabajoCard key={index} trabajo={trabajo} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrabajoCard({ trabajo }) {
  const images = trabajo.images.slice(0, trabajo.description.length); // Solo mostrar imágenes igual al número de opciones en description

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: images.length > 1, // Autoplay solo si hay múltiples imágenes
    autoplaySpeed: 2000,
    arrows: images.length > 1, // Mostrar flechas solo si hay varias imágenes
  };

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col items-center text-center"
      style={{ minHeight: "300px" }}
    >
      <div className="relative w-full h-40 mb-4">
        {images.length > 1 ? (
          <Slider {...sliderSettings} className="relative">
            {images.map((img, idx) => (
              <div key={idx}>
                <img
                  src={img}
                  alt={`${trabajo.title} ${idx + 1}`}
                  className="w-full h-40 object-contain rounded-md basis-10"
                />
              </div>
            ))}
          </Slider>
        ) : (
          <img
            src={images[0]}
            alt={trabajo.title}
            className="w-full h-40 object-contain rounded-md"
          />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{trabajo.title}</h3>
      <ul className="text-gray-400 text-sm">
        {trabajo.description.map((item, idx) => (
          <li key={idx}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
