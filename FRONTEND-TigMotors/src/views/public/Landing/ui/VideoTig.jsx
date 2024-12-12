import React, { useState } from "react";
import thumbnail from "../../../../assets/images/Tig-Imagen-Fondo.png";
import videoSource from "../../../../assets/videos/video_tig.mp4";

export default function VideoTig() {
  const [showVideo, setShowVideo] = useState(false);


  
  return (
    <section className="flex flex-col items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-100 sm:text-5xl">
          Experiencia en Soldadura y Tratado de Cabezotes
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          En TigMotors, ofrecemos servicios especializados en soldadura de alta precisión y restauración de cabezotes
          automotrices. Garantizamos calidad en cada trabajo realizado.
        </p>
      </div>
      {!showVideo ? (
        <div className="relative mt-10 flex items-center justify-center">
          <img
            src={thumbnail}
            alt="Miniatura del video"
            className="w-96 h-auto rounded-lg shadow-lg"
          />
          <button
            className="absolute bg-[#28a745] hover:bg-[#218838] text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300"
            onClick={() => setShowVideo(true)}
          >
            Reproducir Video
          </button>
        </div>
      ) : (
        <div className="relative mt-10 flex flex-col items-center">
          <video
            className="w-full max-w-3xl rounded-lg shadow-lg"
            controls
            autoPlay
          >
            <source src={videoSource} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
          <button
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full transition duration-300"
            onClick={() => setShowVideo(false)}
          >
            X
          </button>
        </div>
      )}
    </section>
  );
}
