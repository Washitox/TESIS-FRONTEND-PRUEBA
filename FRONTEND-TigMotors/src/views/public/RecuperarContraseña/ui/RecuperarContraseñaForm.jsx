import { useForm } from 'react-hook-form';
import { Input, Label, Button } from 'keep-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function RecuperarContraseñaForm() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [message, setMessage] = useState(null); // Estado para manejar el mensaje de éxito o error
  const [isError, setIsError] = useState(false); // Estado para determinar si el mensaje es de error

  const FormError = ({ message }) => (
    <div className="block font-medium text-red-500 text-sm">
      {message}
    </div>
  );

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:8085/api/v1/send-token?email=${data.email}`
      );
      console.log("Token de verificación enviado:", response.data);

      // Mostrar mensaje de éxito en verde
      setMessage("Se envió la solicitud, por favor revise su correo electrónico.");
      setIsError(false); // No es un error
    } catch (error) {
      console.error("Error al enviar la solicitud de recuperación:", error.response?.data || error.message);

      // Mostrar mensaje de error en rojo
      setMessage("Error al enviar la solicitud, intente nuevamente.");
      setIsError(true); // Es un error
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Recuperar Contraseña
            </h1>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-[400px]">
            <div className="space-y-5">
              <fieldset className="max-w-md space-y-1">
                <Label htmlFor="email">
                  Correo electrónico <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ingrese su correo electrónico"
                  {...register('email', { required: 'El correo electrónico es requerido' })}
                  className="bg-gray-800 border-slate-900 text-white"
                />
                {errors.email && <FormError message={errors.email.message} />}
              </fieldset>
            </div>

            <div className="mt-6 space-y-5">
              <Button type="submit" color="success" className="w-full">
                Enviar solicitud de recuperación
              </Button>
            </div>
          </form>

          {/* Mensaje de éxito o error */}
          {message && (
            <div
              className={`mt-6 text-center font-medium ${
                isError ? 'text-red-500' : 'text-green-500'
              }`}
            >
              {message}
            </div>
          )}

          {/* Enlace inferior */}
          <div className="mt-6 text-center text-sm text-indigo-200/65">
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="font-medium text-indigo-500">
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
