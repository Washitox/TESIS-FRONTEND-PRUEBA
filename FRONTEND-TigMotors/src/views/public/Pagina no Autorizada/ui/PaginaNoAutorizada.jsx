import { Link } from 'react-router-dom';
import logo from "../../../../assets/images/TigMotors.png";

export default function PaginaNoAutorizada() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md text-center">
        <img src={logo} alt="TigMotors logo" className="mx-auto w-32 h-32 object-contain mb-6" />
        
        <h1 className="text-3xl font-semibold animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.red.200),theme(colors.orange.200),theme(colors.red.300),theme(colors.orange.400),theme(colors.red.200))] bg-[length:200%_auto] bg-clip-text text-transparent">
          Acceso No Autorizado
        </h1>
        
        <p className="mt-6 text-red-300">
          Lo sentimos, no tienes permisos para acceder a esta página.
        </p>
        
        <Link to="/" className="mt-8 inline-block text-lg font-medium text-red-500 underline">
          Regresar al inicio
        </Link>
      </div>
    </section>
  );
}
