import { Link } from 'react-router-dom';
import logo from "../../../../assets/images/TigMotors.png"

export default function NotFoundPage() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 max-w-md text-center">
        <img src={logo} alt="TigMotors logo" className="mx-auto w-32 h-32 object-contain mb-6" />
        
        <h1 className="text-3xl font-semibold animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text text-transparent">
          Página no encontrada
        </h1>
        
        <p className="mt-6 text-indigo-300">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        
        <Link to="/" className="mt-8 inline-block text-lg font-medium text-indigo-500 underline">
          Regresar al inicio
        </Link>
      </div>
    </section>
  );
}
