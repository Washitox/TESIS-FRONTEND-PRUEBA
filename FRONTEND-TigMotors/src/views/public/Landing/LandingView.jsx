import VideoTig from "./ui/VideoTig";
import Home from "../Landing/ui/Home"
import TrabajosTig from "./ui/TrabajosTig";
import InformacionTig from "./ui/InformacionTig"
import FinalLanding from "./ui/FinalLanding";
import AcercaNosotros from "./ui/AcercaNosotros";
import Equipo from "./ui/Equipo";

export default function LandingView() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <Home />
      <section id="acerca-nosotros">
        <AcercaNosotros />
      </section>
      <VideoTig />
      <TrabajosTig />
      <section id="informacion-contacto">
      <InformacionTig />
      </section>
      <FinalLanding/>
      <section id="equipo">
        <Equipo />
      </section>
    </div>
  );
}

