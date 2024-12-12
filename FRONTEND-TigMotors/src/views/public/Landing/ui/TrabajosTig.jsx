import React from "react";
import Slider from "react-slick";
import image1 from "../../../../assets/images/image1.png";
import image2 from "../../../../assets/images/image2.png";
import image3 from "../../../../assets/images/image3.png";
import image4 from "../../../../assets/images/image4.png";
import image5 from "../../../../assets/images/image5.png";
import image6 from "../../../../assets/images/image5.png";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";


export default function TrabajosTig() {
  const trabajos = [
    {
      title: "Soldadura",
      images: [image1, image2, image3],
      description: [
        "Suelda en frío",
        "Suelda en Injerto",
        "Relleno de superficies",
      ],
    },
    {
      title: "Pruebas Hidrostática",
      images: [image2, image3, image4], 
      description: [
        "Verificación",
        "Diagnóstico",
        "Fisuras en Bloc o Cabezotes",
      ],
    },
    {
      title: "Cepillados",
      images: [image3],
      description: ["Nivelación de superficies"],
    },
    {
      title: "Torno",
      images: [image4], 
      description: ["Fabricación de piezas"],
    },
    {
      title: "Extras",
      images: [image6, image5, image1, image3, image4, image2],
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
      style={{ minHeight: "500px" }}
    >
      <div className="relative w-full h-40 mb-4">
        {images.length > 1 ? (
          <Slider {...sliderSettings} className="relative">
            {images.map((img, idx) => (
              <div key={idx}>
                <img
                  src={img}
                  alt={`${trabajo.title} ${idx + 1}`}
                  className="w-full h-40 object-contain rounded-md"
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
